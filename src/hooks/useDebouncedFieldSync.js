import { useEffect, useRef } from 'react'

// Calls onCommit(value) `delayMs` after the value stops changing.
// Skips the very first call (mount) so loading existing data doesn't trigger a write.
export function useDebouncedFieldSync(value, onCommit, delayMs = 700) {
  const isFirstRun = useRef(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return undefined
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => onCommit(value), delayMs)
    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
}
