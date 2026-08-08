import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function sessionRef(sessionId) {
  return doc(db, 'sessions', sessionId)
}

export async function markTicketDelivered(sessionId, ticket, atSec) {
  await updateDoc(sessionRef(sessionId), {
    deliveredTicketIds: arrayUnion(ticket.id),
    [`tickets.${ticket.id}`]: { classification: '', urgency: '', status: 'in_progress', notes: '', updatedAtSec: atSec },
    actionLog: arrayUnion({ tSec: atSec, type: 'ticket_arrived', refId: ticket.id, detail: '' }),
  })
}

export async function markEmailDelivered(sessionId, email, atSec) {
  await updateDoc(sessionRef(sessionId), {
    deliveredEmailIds: arrayUnion(email.id),
    [`emails.${email.id}`]: { strategy: '', reply: '', updatedAtSec: atSec },
    actionLog: arrayUnion({ tSec: atSec, type: 'email_arrived', refId: email.id, detail: '' }),
  })
}

export async function updateTicketField(sessionId, ticketId, field, value, atSec) {
  const patch = {
    [`tickets.${ticketId}.${field}`]: value,
    [`tickets.${ticketId}.updatedAtSec`]: atSec,
  }
  if (field === 'classification' || field === 'urgency' || field === 'status') {
    patch.actionLog = arrayUnion({ tSec: atSec, type: 'ticket_updated', refId: ticketId, detail: `${field}=${value}` })
  }
  await updateDoc(sessionRef(sessionId), patch)
}

export async function updateEmailField(sessionId, emailId, field, value, atSec) {
  const patch = {
    [`emails.${emailId}.${field}`]: value,
    [`emails.${emailId}.updatedAtSec`]: atSec,
  }
  if (field === 'strategy') {
    patch.actionLog = arrayUnion({ tSec: atSec, type: 'email_reply_strategy', refId: emailId, detail: value })
  }
  await updateDoc(sessionRef(sessionId), patch)
}

export async function updateBriefingField(sessionId, field, value, atSec) {
  await updateDoc(sessionRef(sessionId), {
    [`briefing.${field}`]: value,
    'briefing.updatedAtSec': atSec,
  })
}

export async function completeSession(sessionId, completedAtMs, atSec) {
  await updateDoc(sessionRef(sessionId), {
    phase: 'completed',
    completedAtMs,
    aiScoringStatus: 'pending',
    actionLog: arrayUnion({ tSec: atSec, type: 'session_completed', refId: '', detail: '' }),
  })
}

export async function setAiResult(sessionId, aiResult) {
  await updateDoc(sessionRef(sessionId), {
    aiResult,
    aiScoringStatus: 'complete',
    aiScoringError: null,
  })
}

export async function setAiError(sessionId, errorMessage) {
  await updateDoc(sessionRef(sessionId), {
    aiScoringStatus: 'error',
    aiScoringError: errorMessage,
  })
}

export async function setAiScoringStatus(sessionId, status) {
  await updateDoc(sessionRef(sessionId), { aiScoringStatus: status })
}
