import { TICKET_STATUS_LABELS, URGENCY_LABELS } from '../../data/constants'

const URGENCY_COLORS = {
  P1: 'bg-red-100 text-red-700',
  P2: 'bg-orange-100 text-orange-700',
  P3: 'bg-yellow-100 text-yellow-700',
  P4: 'bg-slate-100 text-slate-600',
}

export default function TicketCard({ ticket, data, selected, onClick }) {
  const status = data?.status || 'in_progress'
  const urgency = data?.urgency

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-right transition ${
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
      <div className="text-xs text-slate-400">{TICKET_STATUS_LABELS[status]}</div>
    </button>
  )
}
