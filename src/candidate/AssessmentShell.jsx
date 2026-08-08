import { useRef, useState } from 'react'
import { useSessionDispatch, useSessionState } from '../context/SessionContext'
import { useCountdown } from '../hooks/useCountdown'
import { useScheduledEvents } from '../hooks/useScheduledEvents'
import { useSystemLoad } from '../hooks/useSystemLoad'
import { markTicketDelivered, markEmailDelivered, completeSession, setAiResult, setAiError } from '../lib/firestoreSession'
import { callGeminiScoring } from '../lib/gemini'
import Header from './Header'
import TabNav from './TabNav'
import ItsmTab from './itsm/ItsmTab'
import InboxTab from './inbox/InboxTab'
import BriefingTab from './briefing/BriefingTab'
import BriefingAlertBanner from './briefing/BriefingAlertBanner'

export default function AssessmentShell() {
  const state = useSessionState()
  const dispatch = useSessionDispatch()
  const [activeTab, setActiveTab] = useState('itsm')
  const [confirmingSubmit, setConfirmingSubmit] = useState(false)

  const stateRef = useRef(state)
  stateRef.current = state

  const handleComplete = useRef(async () => {
    const current = stateRef.current
    if (current.phase !== 'in_progress') return
    const completedAtMs = Date.now()
    const atSec = current.startedAtMs ? Math.floor((completedAtMs - current.startedAtMs) / 1000) : 0

    dispatch({ type: 'COMPLETE_SESSION', payload: { completedAtMs, atSec } })
    completeSession(current.sessionId, completedAtMs, atSec).catch(() => {})

    try {
      const result = await callGeminiScoring(current)
      dispatch({ type: 'SET_AI_RESULT', payload: result })
      await setAiResult(current.sessionId, result)
    } catch (err) {
      const message = err?.message || 'שגיאה לא ידועה'
      dispatch({ type: 'SET_AI_ERROR', payload: message })
      setAiError(current.sessionId, message).catch(() => {})
    }
  })

  const { elapsedSec, remainingSec } = useCountdown(state.startedAtMs, state.durationSec, () => handleComplete.current())

  const handleTicketArrived = (ticket, atSec) => {
    dispatch({ type: 'TICKET_ARRIVED', payload: { ticketId: ticket.id, atSec } })
    markTicketDelivered(state.sessionId, ticket, atSec).catch(() => {})
  }

  const handleEmailArrived = (email, atSec) => {
    dispatch({ type: 'EMAIL_ARRIVED', payload: { emailId: email.id, atSec } })
    markEmailDelivered(state.sessionId, email, atSec).catch(() => {})
  }

  useScheduledEvents({
    elapsedSec,
    deliveredTicketIds: state.deliveredTicketIds,
    deliveredEmailIds: state.deliveredEmailIds,
    onTicketArrived: handleTicketArrived,
    onEmailArrived: handleEmailArrived,
    active: state.phase === 'in_progress',
  })

  const systemLoad = useSystemLoad(state.tickets)

  const openTicketCount = state.deliveredTicketIds.filter((id) => state.tickets[id]?.status !== 'closed').length
  const openEmailCount = state.deliveredEmailIds.filter((id) => !state.emails[id]?.sent).length

  const briefingIsEmpty =
    !state.briefing.executiveSummary?.trim() && !state.briefing.risks?.trim() && !state.briefing.actionPlan?.trim()
  const showBriefingAlert = state.phase === 'in_progress' && remainingSec > 0 && remainingSec <= 300 && briefingIsEmpty

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <Header
        candidateName={state.candidateName}
        testId={state.testId}
        remainingSec={remainingSec}
        systemLoad={systemLoad}
      />
      <TabNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        ticketBadge={openTicketCount}
        emailBadge={openEmailCount}
        onSubmit={() => setConfirmingSubmit(true)}
      />
      {showBriefingAlert && <BriefingAlertBanner onGoToBriefing={() => setActiveTab('briefing')} />}
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'itsm' && (
          <ItsmTab tickets={state.tickets} deliveredTicketIds={state.deliveredTicketIds} elapsedSec={elapsedSec} sessionId={state.sessionId} />
        )}
        {activeTab === 'inbox' && (
          <InboxTab emails={state.emails} deliveredEmailIds={state.deliveredEmailIds} elapsedSec={elapsedSec} sessionId={state.sessionId} />
        )}
        {activeTab === 'briefing' && (
          <BriefingTab briefing={state.briefing} elapsedSec={elapsedSec} sessionId={state.sessionId} />
        )}
      </main>

      {confirmingSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <p className="mb-4 text-slate-700">
              האם אתה בטוח שברצונך להגיש את המבחן? לא ניתן יהיה לשנות תשובות לאחר ההגשה.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmingSubmit(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  setConfirmingSubmit(false)
                  handleComplete.current()
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                הגש מבחן
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
