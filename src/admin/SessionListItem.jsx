const PHASE_LABELS = {
  in_progress: 'בביצוע',
  completed: 'הושלם',
}

export default function SessionListItem({ session, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-right transition ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{session.candidateName}</span>
        {session.aiResult && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
            {session.aiResult.overall_score}
          </span>
        )}
      </div>
      <div className="mb-1 text-xs font-mono text-slate-400">{session.testId}</div>
      <div className="text-xs text-slate-500">{PHASE_LABELS[session.phase] || session.phase}</div>
    </button>
  )
}
