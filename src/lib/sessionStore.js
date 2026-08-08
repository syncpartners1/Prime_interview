import { nanoid } from 'nanoid'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { TEST_DURATION_SEC } from '../data/constants'

const LOCAL_STORAGE_KEY = 'prime_interview_session_id'

export function ensureAnonymousAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        if (user) {
          resolve(user)
        } else {
          signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(reject)
        }
      },
      reject,
    )
  })
}

function buildInitialSessionData(uid, candidateName) {
  const testId = `PIA-${nanoid(6).toUpperCase()}`
  return {
    testId,
    candidateName,
    uid,
    phase: 'in_progress',
    startedAtMs: Date.now(),
    completedAtMs: null,
    durationSec: TEST_DURATION_SEC,
    deliveredTicketIds: [],
    deliveredEmailIds: [],
    tickets: {},
    emails: {},
    briefing: { executiveSummary: '', risks: '', actionPlan: '' },
    actionLog: [],
    aiScoringStatus: null,
    aiScoringError: null,
    aiResult: null,
    createdAtMs: Date.now(),
  }
}

export async function createSession(candidateName) {
  const user = await ensureAnonymousAuth()
  const sessionId = nanoid()
  const data = buildInitialSessionData(user.uid, candidateName)
  await setDoc(doc(db, 'sessions', sessionId), data)
  localStorage.setItem(LOCAL_STORAGE_KEY, sessionId)
  return { sessionId, ...data }
}

export async function resumeSession() {
  const sessionId = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!sessionId) return null

  const user = await ensureAnonymousAuth()
  const snap = await getDoc(doc(db, 'sessions', sessionId))
  if (!snap.exists()) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return null
  }
  const data = snap.data()
  if (data.uid !== user.uid) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return null
  }
  return { sessionId, ...data }
}

export function clearLocalSession() {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}
