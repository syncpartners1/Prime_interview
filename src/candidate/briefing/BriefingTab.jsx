import { useState } from 'react'
import { useSessionDispatch } from '../../context/SessionContext'
import { updateBriefingField } from '../../lib/firestoreSession'
import { useDebouncedFieldSync } from '../../hooks/useDebouncedFieldSync'

const FIELDS = [
  {
    key: 'executiveSummary',
    label: 'סיכום תמונת מצב תפעולית',
    placeholder: 'תיאור תמציתי של יציבות המערכות כרגע...',
  },
  {
    key: 'risks',
    label: 'זיהוי סיכונים ופערים קריטיים',
    placeholder: 'חיבור בין אירועים לזיהוי סיכון רחב יותר (למשל: כפילויות ב-API + איטיות ERP)...',
  },
  {
    key: 'actionPlan',
    label: 'תכנית פעולה ומשאבים מיידיים',
    placeholder: 'מה נדרש לעשות בשעות הקרובות...',
  },
]

function BriefingField({ field, value, sessionId, elapsedSec, dispatch }) {
  const [text, setText] = useState(value || '')

  useDebouncedFieldSync(text, (val) => {
    dispatch({ type: 'UPDATE_BRIEFING_FIELD', payload: { field: field.key, value: val, atSec: elapsedSec } })
    updateBriefingField(sessionId, field.key, val, elapsedSec).catch(() => {})
  })

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        placeholder={field.placeholder}
      />
    </div>
  )
}

export default function BriefingTab({ briefing, elapsedSec, sessionId }) {
  const dispatch = useSessionDispatch()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {FIELDS.map((field) => (
        <BriefingField
          key={field.key}
          field={field}
          value={briefing[field.key]}
          sessionId={sessionId}
          elapsedSec={elapsedSec}
          dispatch={dispatch}
        />
      ))}
    </div>
  )
}
