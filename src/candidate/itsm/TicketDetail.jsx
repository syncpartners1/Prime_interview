import { useState, useEffect } from 'react'
import { CLASSIFICATION_LABELS, TICKET_STATUS, TICKET_STATUS_LABELS, URGENCY_LABELS } from '../../data/constants'
import { useDebouncedFieldSync } from '../../hooks/useDebouncedFieldSync'

export default function TicketDetail({ ticket, data, onFieldChange }) {
  const [notes, setNotes] = useState(data?.notes || '')
  const [justUpdated, setJustUpdated] = useState(false)

  useEffect(() => {
    setNotes(data?.notes || '')
    setJustUpdated(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id])

  useDebouncedFieldSync(notes, (value) => onFieldChange('notes', value))

  const isClosed = (data?.status || TICKET_STATUS.IN_PROGRESS) === TICKET_STATUS.CLOSED

  const handleUpdateClick = () => {
    onFieldChange('notes', notes, true)
    setJustUpdated(true)
    setTimeout(() => setJustUpdated(false), 2000)
  }

  const handleFinishClick = () => {
    onFieldChange('status', TICKET_STATUS.CLOSED)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-mono text-slate-400">{ticket.id}</h2>
      </div>
      <h3 className="mb-3 text-lg font-semibold text-slate-800">{ticket.title}</h3>
      <p className="mb-5 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{ticket.description}</p>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">סיווג</label>
          <select
            value={data?.classification || ''}
            onChange={(e) => onFieldChange('classification', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
          >
            <option value="">בחר סיווג</option>
            {Object.entries(CLASSIFICATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">דחיפות</label>
          <select
            value={data?.urgency || ''}
            onChange={(e) => onFieldChange('urgency', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
          >
            <option value="">בחר דחיפות</option>
            {Object.entries(URGENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">סטטוס</label>
          <select
            value={data?.status || 'in_progress'}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
          >
            {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-slate-500">הערת עבודה / מענה</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="תאר את הפעולות שביצעת ואת התיעדוף..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleUpdateClick}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          עדכן
        </button>
        {justUpdated && <span className="text-xs font-medium text-green-600">עודכן ✓</span>}

        <button
          onClick={handleFinishClick}
          disabled={isClosed}
          className="mr-auto rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-default disabled:bg-slate-200 disabled:text-slate-400"
        >
          {isClosed ? 'הקריאה נסגרה ✓' : 'סיים טיפול בקריאה'}
        </button>
      </div>
    </div>
  )
}
