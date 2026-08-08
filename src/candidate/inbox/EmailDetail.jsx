import { useState, useEffect } from 'react'
import { useDebouncedFieldSync } from '../../hooks/useDebouncedFieldSync'

export default function EmailDetail({ email, data, onFieldChange }) {
  const [reply, setReply] = useState(data?.reply || '')
  const [justSent, setJustSent] = useState(false)

  useEffect(() => {
    setReply(data?.reply || '')
    setJustSent(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.id])

  useDebouncedFieldSync(reply, (value) => onFieldChange('reply', value))

  const isSent = Boolean(data?.sent)

  const handleReplyClick = () => {
    onFieldChange('reply', reply)
    onFieldChange('sent', true)
    setJustSent(true)
    setTimeout(() => setJustSent(false), 2000)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-800">{email.sender}</h3>
        <div className="text-xs text-slate-400">{email.role}</div>
      </div>
      <div className="mb-1 text-sm font-medium text-slate-700">{email.subject}</div>
      <p className="mb-5 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{email.body}</p>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-slate-500">מענה חופשי</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="כתוב את תשובתך, מותאמת לסגנון התקשורת של השולח..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleReplyClick}
          disabled={!reply.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-default disabled:bg-slate-200 disabled:text-slate-400"
        >
          ענה
        </button>
        {justSent && <span className="text-xs font-medium text-green-600">נענה ✓</span>}
        {!justSent && isSent && <span className="text-xs font-medium text-slate-400">נענה בעבר — עריכה תדרוש מענה מחדש</span>}
      </div>
    </div>
  )
}
