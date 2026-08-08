import { SYSTEM_LOAD_LEVELS, TICKET_STATUS } from '../data/constants'

// Load reflects open tickets without a response only — emails are tracked separately.
export function useSystemLoad(tickets) {
  const openCount = Object.values(tickets).filter((t) => t.status !== TICKET_STATUS.CLOSED).length
  const level = SYSTEM_LOAD_LEVELS.find((l) => openCount <= l.max)
  return { openCount, ...level }
}
