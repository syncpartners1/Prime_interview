import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminApp() {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      const isRecruiter = u?.providerData?.some((p) => p.providerId === 'password')
      setUser(isRecruiter ? u : null)
      setChecking(false)
    })
    return unsubscribe
  }, [])

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
        טוען...
      </div>
    )
  }

  if (!user) return <AdminLogin />

  return <AdminDashboard onLogout={() => signOut(auth)} recruiterEmail={user.email} />
}
