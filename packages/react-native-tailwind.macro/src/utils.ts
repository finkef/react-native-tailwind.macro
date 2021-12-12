import { Appearance } from "react-native"

/**
 * Tries to retrieve the color scheme from a persisted cookie on web.
 */
export const getColorSchemeFromCookie = (): "light" | "dark" | undefined => {
  if (typeof document !== "undefined") {
    const cookie = document.cookie
      ?.match("(^|;)\\s*__rntwm_color_scheme\\s*=\\s*([^;]+)")
      ?.pop()

    if (cookie === "light" || cookie === "dark") return cookie
  }

  return undefined
}

/**
 * Tries to set the color scheme as a cookie on web.
 */
export const setColorSchemeCookie = (colorScheme: "light" | "dark") => {
  if (typeof document !== "undefined") {
    document.cookie = `__rntwm_color_scheme=${colorScheme};expires=${new Date(
      // Expire in 10 years, practically never
      Date.now() + 10 * 365 * 24 * 60 * 60 * 1000
    ).toISOString()};path=/;`
  }
}

/**
 * Returns a sane default for the initial color scheme. Tries to use the cookie on web before
 * falling back to the system default.
 */
export const getInitialColorScheme = (): "light" | "dark" =>
  getColorSchemeFromCookie() ?? Appearance.getColorScheme() ?? "light"
