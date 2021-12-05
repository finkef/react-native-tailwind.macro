import { useMemo } from "react"

/**
 * Simple wrapper around the arrow function passed to `useTailwindStyles`. Memoizes the result until
 * deps (including compiled styles) change.
 */
export const useTailwindStyles = (fn: () => any, deps: any) => {
  return useMemo(
    () => {
      const obj = fn()

      Object.values(obj).forEach((styles) => {
        // Iterate over all styles and add joined responsive ids
        // as non-enumerable property for arrays
        if (Array.isArray(styles)) {
          Object.defineProperty(styles, "id", {
            value: styles
              .map((style: any) => style.id)
              .filter(Boolean)
              .join(" "),
            enumerable: false,
          })
        }
      })

      return obj
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )
}
