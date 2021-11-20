import { Platform } from "react-native"
import type { TailwindStyleRule } from "./types"

export function checkPlatform(styles: TailwindStyleRule[]) {
  return styles.filter(
    (style) => !style.platform || style.platform === Platform.OS
  )
}
