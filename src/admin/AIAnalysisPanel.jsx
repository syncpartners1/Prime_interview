export default function AIAnalysisPanel({ aiResult, aiScoringStatus, aiScoringError }) {
  if (aiScoringStatus === 'pending' || !aiScoringStatus) {
    return <div className="text-sm text-blue-600">ניתוח ה-AI בתהליך...</div>
  }
  if (aiScoringStatus === 'error') {
    return <div className="text-sm text-red-600">שגיאה בניתוח: {aiScoringError}</div>
  }
  if (!aiResult) return null

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1 text-sm font-semibold text-slate-700">ניתוח התאמת DISC</h4>
        <p className="text-sm text-slate-600">{aiResult.disc_analysis}</p>
      </div>
      <div>
        <h4 className="mb-1 text-sm font-semibold text-slate-700">חוזקות עיקריות</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
          {aiResult.key_strengths?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-1 text-sm font-semibold text-slate-700">נקודות לשיפור</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
          {aiResult.areas_for_improvement?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
