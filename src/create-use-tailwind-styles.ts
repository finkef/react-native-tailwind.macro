import MediaQueryStyleSheet from "react-native-media-query"
import { StyleObjectProps } from "./types"
import { checkPlatform } from "./check-platform"

export const createUseTailwindStyles = (
  styles: Record<string, StyleObjectProps[]>
) => {
  const { styles: styleSheet, ids } = MediaQueryStyleSheet.create(
    Object.fromEntries(
      Object.entries(styles).map(([key, arr]) => [
        key,
        Object.assign({}, ...checkPlatform(arr).map(({ style }) => style)),
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

  return () => styleSheet
}
