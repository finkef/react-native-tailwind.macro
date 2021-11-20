import { useMemo } from "react"

/**
 * Simple wrapper around the arrow function passed to `useTailwindStyles`. Memoizes the result until
 * deps (including compiled styles) change.
 */
export const useTailwindStyles = (fn: () => any, deps: any) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(fn, deps)
}
