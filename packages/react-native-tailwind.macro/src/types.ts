import { PlatformOSType } from "react-native"

export interface TailwindStyleRule {
  id: string
  dark: boolean
  platform?: PlatformOSType
  breakpoint?: {
    label: string
    minWidth: string
  }
  selectors: string[]
  style: Record<string, any>
}
