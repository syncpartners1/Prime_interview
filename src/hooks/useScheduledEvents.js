import { useEffect } from 'react'
import { ticketSchedule } from '../data/ticketSchedule'
import { emailSchedule } from '../data/emailSchedule'

export function useScheduledEvents({ elapsedSec, deliveredTicketIds, deliveredEmailIds, onTicketArrived, onEmailArrived, active }) {
  useEffect(() => {
    if (!active) return
    for (const ticket of ticketSchedule) {
      if (ticket.atSec <= elapsedSec && !deliveredTicketIds.includes(ticket.id)) {
        onTicketArrived(ticket, elapsedSec)
      }
    }
    for (const email of emailSchedule) {
      if (email.atSec <= elapsedSec && !deliveredEmailIds.includes(email.id)) {
        onEmailArrived(email, elapsedSec)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, elapsedSec, deliveredTicketIds, deliveredEmailIds])
}
