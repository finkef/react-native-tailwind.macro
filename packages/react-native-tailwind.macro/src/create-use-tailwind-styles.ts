import React, { useMemo } from "react"
import MediaQueryStyleSheet from "react-native-media-query"
import { StyleObjectProps } from "./types"
import { checkPlatform } from "./check-platform"
import { useTailwind } from "./tailwind-context"

export const createUseTailwindStyles = (
  styles: Record<string, StyleObjectProps[]>
) => {
  return () => {
    const ctx = useTailwind()

    return useMemo(() => {
      console.log(styles)
      console.log("Dark", ctx.dark)

      const { styles: styleSheet, ids } = MediaQueryStyleSheet.create(
        Object.fromEntries(
          Object.entries(styles).map(([key, arr]) => [
            key,
            Object.assign(
              {},
              ...checkPlatform(arr)
                .filter(({ dark }) => !dark || ctx.dark)
                .map(({ style }) => style)
            ),
          ])
        )
      )

      for (const key in styleSheet) {
        // add id as non-enumerable property to the styles
        Object.defineProperty(styleSheet[key], "id", {
          value: ids[key],
          enumerable: false,
        })
      }

      return styleSheet
    }, [ctx])
  }
}

createUseTailwindStyles.React = React
