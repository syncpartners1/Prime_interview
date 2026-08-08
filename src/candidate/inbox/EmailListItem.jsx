export default function EmailListItem({ email, data, selected, onClick }) {
  const sent = Boolean(data?.sent)

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-right transition ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="mb-1 text-sm font-medium text-slate-800">{email.sender}</div>
      <div className="mb-1 text-xs text-slate-400">{email.role}</div>
      <div className="truncate text-xs text-slate-500">{email.subject}</div>
      {sent && <div className="mt-1 text-[10px] font-medium text-green-600">נשלח</div>}
    </button>
  )
}
