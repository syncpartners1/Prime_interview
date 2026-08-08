// Deploys dist/ to Firebase Hosting via the REST API directly, without firebase-tools.
// Requires: gcloud CLI authenticated (gcloud auth login) with access to the Firebase project.
// Usage: npm run build && node scripts/deploy-hosting.mjs

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const PROJECT_ID = 'prime-interview-504916'
const SITE = 'primelease-interview'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')
const REWRITES = [{ glob: '**', path: '/index.html' }]

function getToken() {
  return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim()
}

function listFiles(dir, base = dir) {
  let results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results = results.concat(listFiles(full, base))
    } else {
      const rel = '/' + path.relative(base, full).split(path.sep).join('/')
      results.push({ full, rel })
    }
  }
  return results
}

async function apiFetch(url, opts = {}) {
  const token = getToken()
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': PROJECT_ID,
      ...(opts.headers || {}),
    },
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = text
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}: ${JSON.stringify(json)}`)
  return json
}

async function main() {
  if (!fs.existsSync(DIST)) {
    throw new Error('dist/ not found — run "npm run build" first')
  }

  const files = listFiles(DIST)
  console.log(`${files.length} files found.`)

  const gzipByRel = {}
  const hashByRel = {}
  for (const f of files) {
    const content = fs.readFileSync(f.full)
    const gz = zlib.gzipSync(content, { level: 9 })
    const hash = crypto.createHash('sha256').update(gz).digest('hex')
    gzipByRel[f.rel] = gz
    hashByRel[f.rel] = hash
  }

  console.log('Creating hosting version...')
  const version = await apiFetch(`https://firebasehosting.googleapis.com/v1beta1/sites/${SITE}/versions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config: { rewrites: REWRITES } }),
  })
  const versionName = version.name
  console.log('Version:', versionName)

  console.log('Populating files...')
  const populate = await apiFetch(`https://firebasehosting.googleapis.com/v1beta1/${versionName}:populateFiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: hashByRel }),
  })

  const uploadUrl = populate.uploadUrl
  const needed = populate.uploadRequiredHashes || []
  console.log(`Need to upload ${needed.length} file(s).`)

  const hashToRel = {}
  for (const rel of Object.keys(hashByRel)) hashToRel[hashByRel[rel]] = rel

  for (const hash of needed) {
    const rel = hashToRel[hash]
    const gz = gzipByRel[rel]
    const token = getToken()
    const res = await fetch(`${uploadUrl}/${hash}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream' },
      body: gz,
    })
    if (!res.ok) throw new Error(`Upload failed for ${rel} (${hash}): ${res.status} ${await res.text()}`)
    console.log('Uploaded', rel)
  }

  console.log('Finalizing version...')
  await apiFetch(`https://firebasehosting.googleapis.com/v1beta1/${versionName}?updateMask=status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'FINALIZED' }),
  })

  console.log('Creating release...')
  const release = await apiFetch(
    `https://firebasehosting.googleapis.com/v1beta1/sites/${SITE}/releases?versionName=${encodeURIComponent(versionName)}`,
    { method: 'POST' },
  )
  console.log('Release created:', release.name)
  console.log(`DONE. Live at https://${SITE}.web.app`)
}

main().catch((err) => {
  console.error('DEPLOY FAILED:', err.message)
  process.exit(1)
})
