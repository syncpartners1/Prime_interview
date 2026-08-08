import { useState } from 'react'
import { useSessionDispatch } from '../context/SessionContext'
import { createSession } from '../lib/sessionStore'

export default function StartScreen() {
  const dispatch = useSessionDispatch()
  const [name, setName] = useState('')
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('נא להזין שם מלא')
      return
    }
    setError('')
    setStarting(true)
    try {
      const session = await createSession(name.trim())
      dispatch({ type: 'SESSION_LOADED', payload: session })
    } catch {
      setError('אירעה שגיאה בהתחלת המבחן. נסה שוב.')
      setStarting(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <img src="/prime_logo.png" alt="Prime Interview" className="mx-auto mb-6 h-16 w-auto" />
        <h1 className="mb-2 text-center text-xl font-semibold text-slate-800">
          סימולציית הערכת מועמדים
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          המבחן יימשך 20 דקות בדיוק. לאחר תחילת המבחן הטיימר לא ייעצר. ודא שאתה מוכן לפני שתתחיל.
        </p>
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label htmlFor="candidateName" className="mb-1 block text-sm font-medium text-slate-700">
              שם מלא
            </label>
            <input
              id="candidateName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="הקלד/י את שמך המלא"
              disabled={starting}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={starting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {starting ? 'מתחיל...' : 'התחל מבחן'}
          </button>
        </form>
      </div>
    </div>
  )
}
