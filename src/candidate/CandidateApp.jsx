import { useEffect, useState } from 'react'
import { useSessionDispatch, useSessionState } from '../context/SessionContext'
import { resumeSession } from '../lib/sessionStore'
import StartScreen from './StartScreen'
import AssessmentShell from './AssessmentShell'
import CompletionScreen from './CompletionScreen'

export default function CandidateApp() {
  const state = useSessionState()
  const dispatch = useSessionDispatch()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    resumeSession()
      .then((session) => {
        if (cancelled || !session) return
        dispatch({ type: 'SESSION_LOADED', payload: session })
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
        טוען...
      </div>
    )
  }

  if (state.phase === 'idle') return <StartScreen />
  if (state.phase === 'completed') return <CompletionScreen />
  return <AssessmentShell />
}
