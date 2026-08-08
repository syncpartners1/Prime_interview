import { useState } from 'react'
import { callGeminiScoring } from '../lib/gemini'
import { setAiResult, setAiError, setAiScoringStatus } from '../lib/firestoreSession'
import ScoreRadarChart from './ScoreRadarChart'
import ActionTimeline from './ActionTimeline'
import AIAnalysisPanel from './AIAnalysisPanel'
import RawResponsesPanel from './RawResponsesPanel'

const PHASE_LABELS = {
  in_progress: 'בביצוע',
  completed: 'הושלם',
}

export default function SessionDetail({ session }) {
  const [rerunning, setRerunning] = useState(false)

  const handleRerun = async () => {
    setRerunning(true)
    await setAiScoringStatus(session.sessionId, 'pending').catch(() => {})
    try {
      const result = await callGeminiScoring(session)
      await setAiResult(session.sessionId, result)
    } catch (err) {
      await setAiError(session.sessionId, err?.message || 'שגיאה לא ידועה').catch(() => {})
    } finally {
      setRerunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{session.candidateName}</h2>
          <div className="text-xs text-slate-400">
            {session.testId} · {PHASE_LABELS[session.phase] || session.phase}
          </div>
        </div>
        <button
          onClick={handleRerun}
          disabled={rerunning || session.phase !== 'completed'}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {rerunning ? 'מריץ...' : 'הרץ ניתוח AI מחדש'}
        </button>
      </div>

      {session.aiResult && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-center text-3xl font-bold text-blue-600">{session.aiResult.overall_score}</div>
          <ScoreRadarChart aiResult={session.aiResult} />
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">ניתוח AI</h3>
        <AIAnalysisPanel
          aiResult={session.aiResult}
          aiScoringStatus={session.aiScoringStatus}
          aiScoringError={session.aiScoringError}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">ציר זמן פעולות</h3>
        <ActionTimeline actionLog={session.actionLog} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">תשובות מלאות</h3>
        <RawResponsesPanel tickets={session.tickets} emails={session.emails} briefing={session.briefing} />
      </div>
    </div>
  )
}
