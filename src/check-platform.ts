import type { StyleObjectProps } from "./types"
import { Platform } from "react-native"

export function checkPlatform(styles: StyleObjectProps[]) {
  return styles.filter(
    (style) => style.platforms === null || style.platforms[Platform.OS]
  )
}
