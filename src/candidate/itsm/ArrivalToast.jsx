export default function ArrivalToast({ message }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  )
}
