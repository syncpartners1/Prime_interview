import { useEffect, useRef, useState } from 'react'
import { ticketSchedule } from '../../data/ticketSchedule'
import { useSessionDispatch } from '../../context/SessionContext'
import { updateTicketField } from '../../lib/firestoreSession'
import TicketCard from './TicketCard'
import TicketDetail from './TicketDetail'
import ArrivalToast from './ArrivalToast'

export default function ItsmTab({ tickets, deliveredTicketIds, elapsedSec, sessionId }) {
  const dispatch = useSessionDispatch()
  const [selectedId, setSelectedId] = useState(null)
  const [toast, setToast] = useState('')
  const prevCount = useRef(deliveredTicketIds.length)

  const deliveredTickets = ticketSchedule.filter((t) => deliveredTicketIds.includes(t.id))

  useEffect(() => {
    if (!selectedId && deliveredTickets.length > 0) {
      setSelectedId(deliveredTickets[deliveredTickets.length - 1].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveredTickets.length])

  useEffect(() => {
    if (deliveredTicketIds.length > prevCount.current) {
      const newest = deliveredTicketIds[deliveredTicketIds.length - 1]
      setToast(`קריאה חדשה התקבלה: ${newest}`)
      const timer = setTimeout(() => setToast(''), 4000)
      prevCount.current = deliveredTicketIds.length
      return () => clearTimeout(timer)
    }
    prevCount.current = deliveredTicketIds.length
    return undefined
  }, [deliveredTicketIds])

  const handleFieldChange = (ticketId, field, value, confirm = false) => {
    dispatch({ type: 'UPDATE_TICKET_FIELD', payload: { ticketId, field, value, atSec: elapsedSec, confirm } })
    updateTicketField(sessionId, ticketId, field, value, elapsedSec, confirm).catch(() => {})
  }

  if (deliveredTickets.length === 0) {
    return <div className="text-center text-slate-400">אין קריאות פעילות כרגע. קריאות יתקבלו במהלך המבחן.</div>
  }

  const selectedTicket = deliveredTickets.find((t) => t.id === selectedId) || deliveredTickets[0]
  const selectedData = tickets[selectedTicket.id] || {}

  return (
    <div className="flex h-full gap-4">
      <div className="w-72 shrink-0 space-y-2 overflow-y-auto">
        {deliveredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            data={tickets[ticket.id]}
            selected={ticket.id === selectedTicket.id}
            onClick={() => setSelectedId(ticket.id)}
            onQuickSubmit={() => handleFieldChange(ticket.id, 'status', 'closed')}
          />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <TicketDetail
          ticket={selectedTicket}
          data={selectedData}
          onFieldChange={(field, value, confirm) => handleFieldChange(selectedTicket.id, field, value, confirm)}
        />
      </div>
      <ArrivalToast message={toast} />
    </div>
  )
}
