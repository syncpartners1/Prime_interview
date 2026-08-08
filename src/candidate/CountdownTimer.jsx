import { formatMMSS } from '../utils/time'

export default function CountdownTimer({ remainingSec }) {
  const isCritical = remainingSec <= 60
  const isWarning = remainingSec <= 300 && !isCritical

  const colorClass = isCritical ? 'text-red-600' : isWarning ? 'text-amber-500' : 'text-slate-800'

  return (
    <div className={`font-mono text-2xl font-bold tabular-nums ${colorClass}`}>
      {formatMMSS(remainingSec)}
    </div>
  )
}
