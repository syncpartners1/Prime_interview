import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import SessionList from './SessionList'
import SessionDetail from './SessionDetail'

export default function AdminDashboard({ onLogout, recruiterEmail }) {
  const [sessions, setSessions] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'sessions'), orderBy('createdAtMs', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ sessionId: d.id, ...d.data() }))
      setSessions(list)
    })
    return unsubscribe
  }, [])

  const selectedSession = sessions.find((s) => s.sessionId === selectedId) || sessions[0] || null

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/prime_logo.png" alt="Prime Interview" className="h-8 w-auto" />
          <h1 className="text-sm font-semibold text-slate-800">לוח בקרה למגייס</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{recruiterEmail}</span>
          <button onClick={onLogout} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
            התנתק
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-3">
          <SessionList sessions={sessions} selectedId={selectedSession?.sessionId} onSelect={setSelectedId} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selectedSession ? (
            <SessionDetail session={selectedSession} />
          ) : (
            <div className="text-center text-slate-400">אין מבחנים להצגה עדיין</div>
          )}
        </div>
      </div>
    </div>
  )
}
