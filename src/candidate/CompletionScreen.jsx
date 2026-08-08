import { useSessionState } from '../context/SessionContext'

export default function CompletionScreen() {
  const state = useSessionState()

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <img src="/prime_logo.png" alt="Prime Interview" className="mx-auto mb-6 h-16 w-auto" />
        <h1 className="mb-2 text-xl font-semibold text-slate-800">המבחן הוגש בהצלחה</h1>
        <p className="mb-4 text-sm text-slate-500">
          תודה, {state.candidateName}. התשובות שלך נשמרו. מספר מבחן: {state.testId}
        </p>

        {state.aiScoringStatus === 'pending' && (
          <p className="text-sm text-blue-600">מנתח את התשובות שלך...</p>
        )}
        {state.aiScoringStatus === 'complete' && (
          <p className="text-sm text-green-600">הניתוח הושלם. תודה על השתתפותך!</p>
        )}
        {state.aiScoringStatus === 'error' && (
          <p className="text-sm text-amber-600">
            התשובות נשמרו, אך אירעה שגיאה בניתוח האוטומטי. הצוות המגייס יבדוק זאת ידנית.
          </p>
        )}
      </div>
    </div>
  )
}
