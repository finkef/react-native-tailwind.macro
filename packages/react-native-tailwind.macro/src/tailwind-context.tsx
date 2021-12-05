import React, { createContext, useContext, useMemo } from "react"
import { Appearance, Platform } from "react-native"

export interface TailwindContext {
  dark: boolean
  platform: typeof Platform.OS
}

const DEFAULT_CONTEXT = {
  dark: Appearance.getColorScheme() === "dark",
  platform: Platform.OS,
}

const Context = createContext<TailwindContext>(DEFAULT_CONTEXT)

export interface TailwindProviderProps {
  dark?: boolean
}

export const TailwindProvider: React.FunctionComponent<
  TailwindProviderProps
> = ({ dark, children }) => {
  // Memoize the context value to skip rerenders
  const value = useMemo(
    () => ({ ...DEFAULT_CONTEXT, dark: Boolean(dark) }),
    [dark]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useTailwind = () => {
  const ctx = useContext(Context)

  return ctx
}
