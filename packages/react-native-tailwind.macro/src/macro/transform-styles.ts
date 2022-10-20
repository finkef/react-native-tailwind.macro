import { PlatformOSType } from "react-native"
import { TailwindConfig } from "tailwindcss/tailwind-config"
import { TwConfig } from "twrnc"
import create from "twrnc/create"
import { createHash } from "crypto"
import { TailwindStyleRule } from "../types"

/**
 * Matches balanced parentheses and content, with up to 5 levels of nesting.
 * Based on: https://stackoverflow.com/a/17759264
 */
const BALANCED_PARENTHESES_REGEX =
  /(?<prefix>[\w\d-]+(?::[\w\d-]+)?):\((?<content>([^()]*|\((?:[^()]*|\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\))*\))*)\)/g

/**
 * Matches simple tailwind styles, like "pt-8" or "ios:pt-2"
 */
const REGEX = /(?:(?<prefix>(?:[\w\d-[\]]+:?)*):)?(?:(?<content>[^:\s\(\)]+))/g

const PLATFORMS = new Set<PlatformOSType>([
  "ios",
  "android",
  "web",
  "macos",
  "windows",
])

const SELECTORS = new Set<string>([
  "active",
  "hover",
  "focus",
  "focus-within",
  "focus-visible",
  "visited",
])

/**
 * Parses a string recursively into an array of content + prefix combinations.
 *
 * @param str
 * @param parentPrefixes
 */
export const parseString = (
  str: string,
  parentPrefixes: string[] = []
): Array<{ prefixes: string[]; content: string }> => {
  const nested = [...str.matchAll(BALANCED_PARENTHESES_REGEX)]
    .map((match) => ({
      prefixes: [
        ...parentPrefixes,
        ...match.groups!.prefix.split(":").filter((prefix) => prefix.length),
      ],
      content: match.groups!.content,
    }))
    .filter(({ content }) => content.length)
    // Recusively resolve parentheses content
    .flatMap(({ prefixes, content }) => parseString(content, prefixes))

  // Remove nested styles
  const cleaned = str.replace(BALANCED_PARENTHESES_REGEX, "")

  const nonNested = [...cleaned.matchAll(REGEX)].map((match) => ({
    prefixes: [
      ...parentPrefixes,
      ...(match.groups!.prefix?.split(":").filter((prefix) => prefix.length) ??
        []),
    ],
    content: match.groups!.content,
  }))

  return [...nonNested, ...nested]
}

/**
 * Groups all styles for the same prefix combinations.
 *
 * @param parsed
 */
const groupByPrefixes = (
  parsed: Array<{ prefixes: string[]; content: string }>
) => {
  const grouped = parsed.reduce<
    Record<string, Array<{ prefixes: string[]; content: string }>>
  >((acc, cur) => {
    const key = [...cur.prefixes].sort().join(":")

    if (!acc[key]) acc[key] = [cur]
    else acc[key].push(cur)

    return acc
  }, {})

  return Object.values(grouped).map((arr) => ({
    prefixes: arr[0].prefixes,
    styles: arr.map(({ content }) => content),
  }))
}

const resolvePrefixes = (
  prefixes: string[],
  twConfig: TailwindConfig
): Omit<TailwindStyleRule, "id" | "style"> => {
  // Breakpoints are sorted ascending in min-width
  const breakpoints = Object.keys(twConfig.theme.screens ?? {})

  // Find the largest specified breakpoint
  const breakpointIndex = prefixes.reduce<number>((acc, cur) => {
    // Skip smaller breakpoints
    const index = breakpoints.indexOf(cur, acc > -1 ? acc : 0)

    if (index > acc) return index
    else return acc
  }, -1)
  const breakpoint =
    breakpointIndex > -1 ? breakpoints[breakpointIndex] : undefined

  return {
    dark: prefixes.some((prefix) => prefix === "dark"),
    platform: prefixes.find((prefix) =>
      PLATFORMS.has(prefix as PlatformOSType)
    ) as PlatformOSType,
    selectors: prefixes.filter((prefix) => SELECTORS.has(prefix)),
    breakpoint: breakpoint
      ? {
          label: breakpoint,
          // @ts-ignore
          minWidth: twConfig.theme.screens[breakpoint],
        }
      : undefined,
  }
}

/**
 * Translates a string of tailwind utility classes into an array of styles with resolved prefixes.
 *
 * @param str
 * @param twConfig
 */
export const transformStyles = (
  str: string,
  twConfig: TailwindConfig
): TailwindStyleRule[] => {
  const parsed = parseString(str)
  const grouped = groupByPrefixes(parsed)

  /**
   * Apply an arbitrary "ios" since we don't pass in styles that are prefixed.
   */
  const tw = create(twConfig as TwConfig, "ios")

  return grouped.map(({ prefixes, styles }) => {
    const resolvedPrefixes = resolvePrefixes(prefixes, twConfig)
    const resolvedStyle = styles
      .map((style) => tw`${style}`)
      .reduce((acc, cur) => Object.assign(acc, cur), {})

    return {
      ...resolvedPrefixes,
      id: `rntwm-${hash(JSON.stringify({ prefixes, resolvedStyle }))}`,
      style: resolvedStyle,
    }
  })
}

const hash = (str: string) =>
  createHash("md5")
    .update(str)
    .digest("base64")
    .replace(/\//g, "_")
    .replace(/[=]/g, "")
