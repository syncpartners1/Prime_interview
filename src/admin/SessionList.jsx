import SessionListItem from './SessionListItem'

export default function SessionList({ sessions, selectedId, onSelect }) {
  if (sessions.length === 0) {
    return <div className="p-2 text-center text-sm text-slate-400">אין מבחנים עדיין</div>
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <SessionListItem
          key={session.sessionId}
          session={session}
          selected={session.sessionId === selectedId}
          onClick={() => onSelect(session.sessionId)}
        />
      ))}
    </div>
  )
}
