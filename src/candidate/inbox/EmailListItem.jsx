import { DISC_STYLE_LABELS } from '../../data/constants'

const DISC_COLORS = {
  D: 'bg-red-100 text-red-700',
  I: 'bg-yellow-100 text-yellow-700',
  S: 'bg-green-100 text-green-700',
  C: 'bg-blue-100 text-blue-700',
}

export default function EmailListItem({ email, data, selected, onClick }) {
  const replied = Boolean(data?.reply?.trim())

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-right transition ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{email.sender}</span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${DISC_COLORS[email.discStyle]}`}>
          {DISC_STYLE_LABELS[email.discStyle]}
        </span>
      </div>
      <div className="mb-1 text-xs text-slate-400">{email.role}</div>
      <div className="truncate text-xs text-slate-500">{email.subject}</div>
      {replied && <div className="mt-1 text-[10px] font-medium text-green-600">נענה</div>}
    </button>
  )
}
