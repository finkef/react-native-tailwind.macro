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

const rules: Record<string, string> = {}

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
    if (!style.selectors.length && !style.breakpoint) return

    const css = createCssRule(style)
    rules[style.id] = css

    if (stylesheet) stylesheet.insertRule(css, Object.keys(rules).length - 1)
  }
}

const createCssRule = ({
  id,
  style,
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

  const inner =
    `[data-media~="${id}"]` +
    selectors.map((selector) => `:${selector}`).join("") +
    ` {${declarationsString}}`

  if (!breakpoint) return inner

  return `@media (min-width: ${breakpoint.minWidth}) { ${inner} }`
}

export const flush = () =>
  React.createElement("style", {
    id: "rntwm-server",
    key: "rntwm-server",
    dangerouslySetInnerHTML: {
      __html: Object.keys(rules)
        .map((key) => rules[key])
        .join("\n"),
    },
  })
