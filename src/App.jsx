import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import CandidateApp from './candidate/CandidateApp'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function AdminFallback() {
  return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">טוען...</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SessionProvider>
              <CandidateApp />
            </SessionProvider>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
