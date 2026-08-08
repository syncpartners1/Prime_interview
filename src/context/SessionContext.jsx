import { createContext, useContext, useReducer } from 'react'
import { TEST_DURATION_SEC } from '../data/constants'

const initialState = {
  sessionId: null,
  testId: null,
  candidateName: '',
  uid: null,
  phase: 'idle', // idle | in_progress | completed
  startedAtMs: null,
  completedAtMs: null,
  durationSec: TEST_DURATION_SEC,
  deliveredTicketIds: [],
  deliveredEmailIds: [],
  tickets: {},
  emails: {},
  briefing: { executiveSummary: '', risks: '', actionPlan: '' },
  actionLog: [],
  aiScoringStatus: null, // pending | complete | error
  aiScoringError: null,
  aiResult: null,
}

function appendLog(actionLog, entry) {
  return [...actionLog, entry]
}

function sessionReducer(state, action) {
  switch (action.type) {
    case 'SESSION_LOADED': {
      return { ...initialState, ...action.payload }
    }

    case 'TICKET_ARRIVED': {
      const { ticketId, atSec } = action.payload
      if (state.deliveredTicketIds.includes(ticketId)) return state
      return {
        ...state,
        deliveredTicketIds: [...state.deliveredTicketIds, ticketId],
        tickets: {
          ...state.tickets,
          [ticketId]: { classification: '', urgency: '', status: '', notes: '', updatedAtSec: atSec },
        },
        actionLog: appendLog(state.actionLog, { tSec: atSec, type: 'ticket_arrived', refId: ticketId, detail: '' }),
      }
    }

    case 'EMAIL_ARRIVED': {
      const { emailId, atSec } = action.payload
      if (state.deliveredEmailIds.includes(emailId)) return state
      return {
        ...state,
        deliveredEmailIds: [...state.deliveredEmailIds, emailId],
        emails: {
          ...state.emails,
          [emailId]: { reply: '', sent: false, updatedAtSec: atSec },
        },
        actionLog: appendLog(state.actionLog, { tSec: atSec, type: 'email_arrived', refId: emailId, detail: '' }),
      }
    }

    case 'UPDATE_TICKET_FIELD': {
      const { ticketId, field, value, atSec, confirm } = action.payload
      const existing = state.tickets[ticketId] || {}
      const isNoteConfirm = field === 'notes' && confirm
      const shouldLog = field === 'classification' || field === 'urgency' || field === 'status' || isNoteConfirm
      const logType = isNoteConfirm ? 'ticket_note_confirmed' : 'ticket_updated'
      const detail = isNoteConfirm ? '' : `${field}=${value}`
      return {
        ...state,
        tickets: {
          ...state.tickets,
          [ticketId]: { ...existing, [field]: value, updatedAtSec: atSec },
        },
        actionLog: shouldLog
          ? appendLog(state.actionLog, { tSec: atSec, type: logType, refId: ticketId, detail })
          : state.actionLog,
      }
    }

    case 'UPDATE_EMAIL_FIELD': {
      const { emailId, field, value, atSec } = action.payload
      const existing = state.emails[emailId] || {}
      const shouldLog = field === 'sent'
      const logType = 'email_sent'
      const detail = ''
      return {
        ...state,
        emails: {
          ...state.emails,
          [emailId]: { ...existing, [field]: value, updatedAtSec: atSec },
        },
        actionLog: shouldLog
          ? appendLog(state.actionLog, { tSec: atSec, type: logType, refId: emailId, detail })
          : state.actionLog,
      }
    }

    case 'UPDATE_BRIEFING_FIELD': {
      const { field, value, atSec } = action.payload
      return {
        ...state,
        briefing: { ...state.briefing, [field]: value, updatedAtSec: atSec },
      }
    }

    case 'COMPLETE_SESSION': {
      const { completedAtMs, atSec } = action.payload
      return {
        ...state,
        phase: 'completed',
        completedAtMs,
        aiScoringStatus: 'pending',
        actionLog: appendLog(state.actionLog, { tSec: atSec, type: 'session_completed', refId: '', detail: '' }),
      }
    }

    case 'SET_AI_SCORING_STATUS': {
      return { ...state, aiScoringStatus: action.payload }
    }

    case 'SET_AI_RESULT': {
      return { ...state, aiResult: action.payload, aiScoringStatus: 'complete', aiScoringError: null }
    }

    case 'SET_AI_ERROR': {
      return { ...state, aiScoringStatus: 'error', aiScoringError: action.payload }
    }

    default:
      return state
  }
}

const SessionStateContext = createContext(null)
const SessionDispatchContext = createContext(null)

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  return (
    <SessionStateContext.Provider value={state}>
      <SessionDispatchContext.Provider value={dispatch}>{children}</SessionDispatchContext.Provider>
    </SessionStateContext.Provider>
  )
}

export function useSessionState() {
  const ctx = useContext(SessionStateContext)
  if (!ctx) throw new Error('useSessionState must be used within SessionProvider')
  return ctx
}

export function useSessionDispatch() {
  const ctx = useContext(SessionDispatchContext)
  if (!ctx) throw new Error('useSessionDispatch must be used within SessionProvider')
  return ctx
}
