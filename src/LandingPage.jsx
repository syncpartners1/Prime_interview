import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <img src="/prime_logo.png" alt="Prime Interview" className="mx-auto mb-6 h-16 w-auto" />
        <h1 className="mb-6 text-center text-xl font-semibold text-slate-800">
          סימולציית הערכת מועמדים
        </h1>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/candidate')}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            מועמד חדש
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            כניסת מנהל גיוס
          </button>
        </div>
      </div>
    </div>
  )
}
