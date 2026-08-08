import { useEffect, useRef, useState } from 'react'
import { emailSchedule } from '../../data/emailSchedule'
import { useSessionDispatch } from '../../context/SessionContext'
import { updateEmailField } from '../../lib/firestoreSession'
import EmailListItem from './EmailListItem'
import EmailDetail from './EmailDetail'
import ArrivalToast from '../itsm/ArrivalToast'

export default function InboxTab({ emails, deliveredEmailIds, elapsedSec, sessionId }) {
  const dispatch = useSessionDispatch()
  const [selectedId, setSelectedId] = useState(null)
  const [toast, setToast] = useState('')
  const prevCount = useRef(deliveredEmailIds.length)

  const deliveredEmails = emailSchedule.filter((e) => deliveredEmailIds.includes(e.id))

  useEffect(() => {
    if (!selectedId && deliveredEmails.length > 0) {
      setSelectedId(deliveredEmails[deliveredEmails.length - 1].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveredEmails.length])

  useEffect(() => {
    if (deliveredEmailIds.length > prevCount.current) {
      const newest = emailSchedule.find((e) => e.id === deliveredEmailIds[deliveredEmailIds.length - 1])
      setToast(`מייל חדש התקבל מ${newest?.sender || ''}`)
      const timer = setTimeout(() => setToast(''), 4000)
      prevCount.current = deliveredEmailIds.length
      return () => clearTimeout(timer)
    }
    prevCount.current = deliveredEmailIds.length
    return undefined
  }, [deliveredEmailIds])

  const handleFieldChange = (emailId, field, value) => {
    dispatch({ type: 'UPDATE_EMAIL_FIELD', payload: { emailId, field, value, atSec: elapsedSec } })
    updateEmailField(sessionId, emailId, field, value, elapsedSec).catch(() => {})
  }

  if (deliveredEmails.length === 0) {
    return <div className="text-center text-slate-400">אין מיילים חדשים כרגע. מיילים יתקבלו במהלך המבחן.</div>
  }

  const selectedEmail = deliveredEmails.find((e) => e.id === selectedId) || deliveredEmails[0]
  const selectedData = emails[selectedEmail.id] || {}

  return (
    <div className="flex h-full gap-4">
      <div className="w-72 shrink-0 space-y-2 overflow-y-auto">
        {deliveredEmails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            data={emails[email.id]}
            selected={email.id === selectedEmail.id}
            onClick={() => setSelectedId(email.id)}
          />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <EmailDetail email={selectedEmail} data={selectedData} onFieldChange={(field, value) => handleFieldChange(selectedEmail.id, field, value)} />
      </div>
      <ArrivalToast message={toast} />
    </div>
  )
}
