import React, { useMemo } from "react"
import { Dimensions, Platform } from "react-native"
import { registerStyle } from "./css-media-queries"
import { useTailwind } from "./tailwind-context"
import { TailwindStyleRule } from "./types"

export const createUseTailwindStyles = (
  styles: Record<string, TailwindStyleRule[]>
) => {
  return () => {
    const ctx = useTailwind()

    return useMemo(() => {
      const deviceWidth = Dimensions.get("window").width

      const stylesheet = Object.fromEntries(
        Object.entries(styles).map(([key, arr]) => {
          const { mergedStyles, id } = arr
            .filter(
              ({ platform, dark, selectors, breakpoint }) =>
                // Check platform
                (!platform || platform === Platform.OS) &&
                // Check dark mode
                (!dark || Platform.OS === "web" || ctx.dark) &&
                // Selectors are only valid on web
                (!selectors.length || Platform.OS === "web") &&
                // Validate device size on non-web
                (!breakpoint ||
                  Platform.OS === "web" ||
                  deviceWidth >=
                    parseInt(breakpoint.minWidth.replace("px", ""), 10))
            )
            .reduce<{ id: string; mergedStyles: Record<string, any> }>(
              (acc, cur) => {
                const requiresMediaQuery =
                  cur.dark || cur.selectors.length || cur.breakpoint

                if (Platform.OS === "web" && requiresMediaQuery) {
                  // Add style to css stylesheet
                  registerStyle(cur)

                  return {
                    // Skip responsive styles
                    mergedStyles: acc.mergedStyles,
                    id: [acc.id, cur.id].filter(Boolean).join(" "),
                  }
                }

                return {
                  mergedStyles: Object.assign(acc.mergedStyles, cur.style),
                  id: acc.id,
                }
              },
              { mergedStyles: {}, id: "" }
            )

          // Add non-enumerable id property to the style object to be applied to data-tw.
          Object.defineProperty(mergedStyles, "id", {
            value: id,
            enumerable: false,
          })

          return [key, mergedStyles]
        })
      )

      return stylesheet
    }, [ctx])
  }
}

createUseTailwindStyles.React = React
