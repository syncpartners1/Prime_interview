import { ticketSchedule } from '../data/ticketSchedule'
import { emailSchedule } from '../data/emailSchedule'
import { CLASSIFICATION_LABELS, TICKET_STATUS_LABELS, URGENCY_LABELS } from '../data/constants'

export default function RawResponsesPanel({ tickets = {}, emails = {}, briefing = {} }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">קריאות ITSM</h4>
      {ticketSchedule.map((ticket) => {
        const answer = tickets[ticket.id]
        if (!answer) return null
        return (
          <details key={ticket.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">
              {ticket.id} — {ticket.title}
            </summary>
            <div className="mt-2 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <div className="mb-1 font-semibold text-slate-500">תשובת המועמד</div>
                <div>סיווג: {CLASSIFICATION_LABELS[answer.classification] || '—'}</div>
                <div>דחיפות: {URGENCY_LABELS[answer.urgency] || '—'}</div>
                <div>החלטת טיפול: {TICKET_STATUS_LABELS[answer.status] || 'טרם טופל'}</div>
                <div className="mt-1 whitespace-pre-wrap text-slate-600">{answer.notes || '—'}</div>
              </div>
              <div>
                <div className="mb-1 font-semibold text-slate-500">תשובה נכונה</div>
                <div>סיווג: {CLASSIFICATION_LABELS[ticket.correctClassification]}</div>
                <div>דחיפות: {URGENCY_LABELS[ticket.correctUrgency]}</div>
                <div className="mt-1 whitespace-pre-wrap text-slate-600">{ticket.expectedHandling}</div>
              </div>
            </div>
          </details>
        )
      })}

      <h4 className="pt-2 text-sm font-semibold text-slate-700">מיילים</h4>
      {emailSchedule.map((email) => {
        const answer = emails[email.id]
        if (!answer) return null
        return (
          <details key={email.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">
              {email.sender} ({email.discStyle}) — {email.subject}
            </summary>
            <div className="mt-2 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <div className="mb-1 font-semibold text-slate-500">תשובת המועמד</div>
                <div className="whitespace-pre-wrap text-slate-600">{answer.reply || '—'}</div>
              </div>
              <div>
                <div className="mb-1 font-semibold text-slate-500">גישה מצופה</div>
                <div className="whitespace-pre-wrap text-slate-600">{email.expectedApproach}</div>
              </div>
            </div>
          </details>
        )
      })}

      <h4 className="pt-2 text-sm font-semibold text-slate-700">תדרוך למנמ"ר</h4>
      <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-xs">
        <div>
          <div className="mb-1 font-semibold text-slate-500">סיכום תמונת מצב</div>
          <div className="whitespace-pre-wrap text-slate-600">{briefing.executiveSummary || '—'}</div>
        </div>
        <div>
          <div className="mb-1 font-semibold text-slate-500">סיכונים ופערים</div>
          <div className="whitespace-pre-wrap text-slate-600">{briefing.risks || '—'}</div>
        </div>
        <div>
          <div className="mb-1 font-semibold text-slate-500">תכנית פעולה</div>
          <div className="whitespace-pre-wrap text-slate-600">{briefing.actionPlan || '—'}</div>
        </div>
      </div>
    </div>
  )
}
