import { useState, useEffect } from 'react'
import { DISC_STYLE_LABELS, RESPONSE_STRATEGIES } from '../../data/constants'
import { useDebouncedFieldSync } from '../../hooks/useDebouncedFieldSync'

export default function EmailDetail({ email, data, onFieldChange }) {
  const [reply, setReply] = useState(data?.reply || '')

  useEffect(() => {
    setReply(data?.reply || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.id])

  useDebouncedFieldSync(reply, (value) => onFieldChange('reply', value))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{email.sender}</h3>
          <div className="text-xs text-slate-400">{email.role}</div>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {DISC_STYLE_LABELS[email.discStyle]}
        </span>
      </div>
      <div className="mb-1 text-sm font-medium text-slate-700">{email.subject}</div>
      <p className="mb-5 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{email.body}</p>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-slate-500">אסטרטגיית תגובה</label>
        <select
          value={data?.strategy || ''}
          onChange={(e) => onFieldChange('strategy', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
        >
          <option value="">בחר אסטרטגיה</option>
          {RESPONSE_STRATEGIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">מענה חופשי</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="כתוב את תשובתך, מותאמת לסגנון התקשורת של השולח..."
        />
      </div>
    </div>
  )
}
