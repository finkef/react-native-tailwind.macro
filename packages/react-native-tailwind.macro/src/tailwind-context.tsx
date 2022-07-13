import React, { createContext, useContext, useEffect, useMemo } from "react"
import { Platform } from "react-native"
import { getInitialColorScheme, setColorSchemeCookie } from "./utils"

export interface TailwindContext {
  dark: boolean
  platform: typeof Platform.OS
}

const DEFAULT_CONTEXT = {
  dark: getInitialColorScheme() === "dark",
  platform: Platform.OS,
}

const Context = createContext<TailwindContext>(DEFAULT_CONTEXT)

export interface TailwindProviderProps {
  dark?: boolean
  children?: React.ReactNode
}

export const TailwindProvider = ({ dark, children }: TailwindProviderProps) => {
  // Memoize the context value to skip rerenders
  const value = useMemo(
    () => ({ ...DEFAULT_CONTEXT, dark: Boolean(dark) }),
    [dark]
  )

  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.body.classList.add(dark ? "rntwm-dark" : "rntwm-light")
      document.body.classList.remove(dark ? "rntwm-light" : "rntwm-dark")

      if (typeof dark !== "undefined") {
        // Persist the selection in a cookie
        setColorSchemeCookie(dark ? "dark" : "light")
      }
    }
  }, [dark])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useTailwind = () => {
  const ctx = useContext(Context)

  return ctx
}
