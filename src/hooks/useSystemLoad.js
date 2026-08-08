import { SYSTEM_LOAD_LEVELS, TICKET_STATUS } from '../data/constants'

export function useSystemLoad(tickets, emails) {
  const openTickets = Object.values(tickets).filter((t) => t.status !== TICKET_STATUS.CLOSED).length
  const openEmails = Object.values(emails).filter((e) => !e.reply || !e.reply.trim()).length
  const openCount = openTickets + openEmails
  const level = SYSTEM_LOAD_LEVELS.find((l) => openCount <= l.max)
  return { openCount, ...level }
}
