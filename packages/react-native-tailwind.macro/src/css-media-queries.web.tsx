/**
 * Credits to https://github.com/kasinskas/react-native-media-query for their amazing work.
 * Most of the below is either taken from or largely inspired by the above.
 */

import React from "react"

// @ts-ignore
import createReactDOMStyle from "react-native-web/dist/exports/StyleSheet/createReactDOMStyle"
// @ts-ignore
import prefixStyles from "react-native-web/dist/modules/prefixStyles"

import { TailwindStyleRule } from "./types"

const COOKIE = "__rntwm_color_scheme"

const rules: Record<string, { media: string; class: string }> = {}

// References to the injected stylesheet and body.
// eslint-disable-next-line no-undef
let stylesheet: CSSStyleSheet

/**
 * If we're in a browser env, add a style tag to the document's head that we can insert styles into.
 */
if (typeof window !== "undefined") {
  const style = document.createElement("style")
  style.id = "react-native-tailwind_macro"
  style.appendChild(document.createTextNode(""))
  document.head.appendChild(style)

  if (style.sheet) stylesheet = style.sheet
}

export const registerStyle = (style: TailwindStyleRule) => {
  if (!rules[style.id]) {
    // Nothing to do
    if (!style.dark && !style.selectors.length && !style.breakpoint) return

    const css = createCssRule(style)
    rules[style.id] = css

    if (stylesheet)
      stylesheet.insertRule(css.class, Object.keys(rules).length - 1)
  }
}

export const createCssRule = ({
  id,
  style,
  dark,
  breakpoint,
  selectors,
}: TailwindStyleRule) => {
  const domStyle = prefixStyles(createReactDOMStyle(style))
  const declarationsString = Object.entries(domStyle)
    .map(([key, value]) => {
      const prop = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
      return Array.isArray(value)
        ? value.map((v) => `${prop}:${v}`).join(";")
        : `${prop}:${value} !important`
    })
    .sort()
    .join(";")

  /**
   * Styles without any selector, breakpoint or in light mode will not be added
   * to the stylesheet.
   *
   * ---
   *
   * Styles with only selectors:
   *
   * [data-tw~="abc"]:hover:active {
   *   background-color: "#deadbeef"
   * }
   *
   * ---
   *
   * Styles with media queries (and optionally selectors):
   *
   * @media (min-width: 1024px) {
   *   [data-tw~="abc"]:hover {
   *     background-color: "#deadbeef"
   *   }
   * }
   *
   * ---
   *
   * Styles with dark mode produce two variations of styles. One for use with
   * @media (prefers-color-scheme: dark) and one for class based usage where
   * a class is supposed to be present on <body />.
   * Note that for class-based usage the class selector must be inside the media query.
   *
   * media:
   * @media (min-width: 1024px) {
   *   @media (prefers-color-scheme: dark) {
   *     [data-tw~="abc"]:hover {
   *       background-color: "#deadbeef"
   *     }
   *   }
   * }
   *
   *
   * class:
   * @media (min-width: 1024px) {
   *   .rntwm-dark [data-tw~="abc"]:hover {
   *     background-color: "#deadbeef"
   *   }
   * }
   * .rntwm-dark [data-tw~="abc"]:hover {
   *   background-color: "#deadbeef"
   * }
   *
   */

  const inner =
    `[data-tw~="${id}"]` +
    selectors.map((selector) => `:${selector}`).join("") +
    ` {${declarationsString}}`

  const mediaInnerWithDarkMode = dark
    ? `@media (prefers-color-scheme: dark) { ${inner} }`
    : inner

  const classInnerWithDarkMode = dark ? `.rntwm-dark ${inner}` : inner

  const media = breakpoint
    ? `@media (min-width: ${breakpoint.minWidth}) { ${mediaInnerWithDarkMode} }`
    : mediaInnerWithDarkMode

  const class_ = breakpoint
    ? `@media (min-width: ${breakpoint.minWidth}) { ${classInnerWithDarkMode} }`
    : classInnerWithDarkMode

  return { media, class: class_ }
}

export const flush = () => (
  <>
    <style
      id="rntwm-server-class"
      key="rntwm-server-class"
      dangerouslySetInnerHTML={{
        __html: Object.values(rules)
          .map((rule) => rule.class)
          .join("\n"),
      }}
    />

    <noscript>
      {/* If JS is disabled, fall back to media stylesheet. */}
      <style
        id="rntwm-server-media"
        key="rntwm-server-media"
        dangerouslySetInnerHTML={{
          __html: Object.values(rules)
            .map((rule) => rule.media)
            .join("\n"),
        }}
      />
    </noscript>

    <script
      dangerouslySetInnerHTML={{
        __html: `
            var matches = document.cookie.match('(^|;)\\s*${COOKIE}\\s*=\\s*([^;]+)')
            var cookie = matches && matches.pop() || ''
            var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

            setTimeout(function() {
              if (cookie === "dark") document.body.classList.add("rntwm-dark")
              else if (cookie === "light") document.body.classList.add("rntwm-light")
              // Fall back to system
              else document.body.classList.add(prefersDark ? "rntwm-dark" : "rntwm-light")
            })
          `,
      }}
    />
  </>
)
