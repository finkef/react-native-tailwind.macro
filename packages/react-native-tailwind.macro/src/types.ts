import { PlatformOSType } from "react-native"

export interface TailwindStyleRule {
  dark: boolean
  platform?: PlatformOSType
  breakpoint?: string
  style: Record<string, any>
}
