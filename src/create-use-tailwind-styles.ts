/**
 * Placeholder
 */
export const createUseTailwindStyles = (styles: Record<string, string>) => {
  return () =>
    Object.fromEntries(
      Object.entries(styles).map(([key, _value]) => {
        const style = { backgroundColor: "pink" }

        Object.defineProperty(style, "id", { value: key, enumerable: false })

        return [key, style]
      })
    )
}
