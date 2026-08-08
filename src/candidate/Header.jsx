import CountdownTimer from './CountdownTimer'
import SystemLoadIndicator from './SystemLoadIndicator'

export default function Header({ candidateName, testId, remainingSec, systemLoad }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/prime_logo.png" alt="Prime Interview" className="h-9 w-auto" />
        <div>
          <div className="text-sm font-semibold text-slate-800">{candidateName}</div>
          <div className="text-xs text-slate-400">מספר מבחן: {testId}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <SystemLoadIndicator load={systemLoad} />
        <CountdownTimer remainingSec={remainingSec} />
      </div>
    </header>
  )
}
