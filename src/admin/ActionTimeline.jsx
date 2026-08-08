import { formatMMSS } from '../utils/time'

const TYPE_LABELS = {
  ticket_arrived: 'קריאה חדשה התקבלה',
  ticket_updated: 'עדכון קריאה',
  ticket_note_confirmed: 'עודכנה הערת עבודה',
  email_arrived: 'מייל חדש התקבל',
  email_sent: 'המועמד ענה למייל',
  session_completed: 'המבחן הוגש',
}

export default function ActionTimeline({ actionLog }) {
  if (!actionLog || actionLog.length === 0) {
    return <div className="text-sm text-slate-400">אין נתוני פעילות</div>
  }

  const sorted = [...actionLog].sort((a, b) => a.tSec - b.tSec)

  return (
    <ol className="space-y-2">
      {sorted.map((entry, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm">
          <span className="w-12 shrink-0 font-mono text-xs text-slate-400">{formatMMSS(entry.tSec)}</span>
          <span className="text-slate-700">
            {TYPE_LABELS[entry.type] || entry.type}
            {entry.refId && <span className="text-slate-400"> — {entry.refId}</span>}
            {entry.detail && <span className="text-slate-400"> ({entry.detail})</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
