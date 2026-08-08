const COLOR_CLASSES = {
  green: 'bg-green-100 text-green-700 border-green-300',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
  red: 'bg-red-100 text-red-700 border-red-300 animate-pulse',
}

export default function SystemLoadIndicator({ load }) {
  return (
    <div className={`rounded-full border px-3 py-1 text-xs font-medium ${COLOR_CLASSES[load.color]}`}>
      עומס מערכת: {load.label}
    </div>
  )
}
