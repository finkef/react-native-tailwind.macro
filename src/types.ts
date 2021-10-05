export interface PlatformProps {
  ios: boolean
  android: boolean
  web: boolean
  windows: boolean
  macos: boolean
}

export interface MediaProps {
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
}

export interface StyleProps {
  style: string | number
}

export interface StyleObjectProps {
  platforms: PlatformProps | null
  media: MediaProps | null
  style: Record<string, any>
  dark: boolean
}
