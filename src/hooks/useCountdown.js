import { useEffect, useState } from 'react'

export function useCountdown(startedAtMs, durationSec, onExpire) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!startedAtMs) return undefined
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [startedAtMs])

  const elapsedSec = startedAtMs ? Math.max(0, Math.floor((now - startedAtMs) / 1000)) : 0
  const remainingSec = startedAtMs ? Math.max(0, durationSec - elapsedSec) : durationSec

  useEffect(() => {
    if (startedAtMs && remainingSec === 0 && onExpire) onExpire()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAtMs, remainingSec === 0])

  return { elapsedSec, remainingSec }
}
