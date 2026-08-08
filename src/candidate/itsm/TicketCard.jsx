import { TICKET_STATUS, TICKET_STATUS_LABELS, URGENCY_LABELS } from '../../data/constants'

const URGENCY_COLORS = {
  P1: 'bg-red-100 text-red-700',
  P2: 'bg-orange-100 text-orange-700',
  P3: 'bg-yellow-100 text-yellow-700',
  P4: 'bg-slate-100 text-slate-600',
}

export default function TicketCard({ ticket, data, selected, onClick, onQuickSubmit }) {
  const status = data?.status || ''
  const urgency = data?.urgency
  const isClosed = status === TICKET_STATUS.CLOSED

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      className={`w-full cursor-pointer rounded-xl border p-3 text-right transition ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
        {urgency && (
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${URGENCY_COLORS[urgency]}`}>
            {URGENCY_LABELS[urgency]}
          </span>
        )}
      </div>
      <div className="mb-1 text-sm font-medium text-slate-800">{ticket.title}</div>
      <div className="mb-2 text-xs text-slate-400">{status ? TICKET_STATUS_LABELS[status] : 'טרם טופל'}</div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (!isClosed) onQuickSubmit()
        }}
        disabled={isClosed}
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-default disabled:border-transparent disabled:bg-green-50 disabled:text-green-700"
      >
        {isClosed ? 'נסגר ✓' : 'עדכן'}
      </button>
    </div>
  )
}
