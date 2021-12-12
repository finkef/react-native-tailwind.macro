import { createCssRule } from "../css-media-queries.web"

describe("createCssRule", () => {
  test("dark: false, selectors: [], breakpoint: null", () => {
    expect(
      createCssRule({
        id: "a",
        dark: false,
        selectors: [],
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": "[data-tw~=\\"a\\"] {margin-top:24px !important}",
        "media": "[data-tw~=\\"a\\"] {margin-top:24px !important}",
      }
    `)
  })

  test('dark: false, selectors: [], breakpoint: "lg"', () => {
    expect(
      createCssRule({
        id: "a",
        dark: false,
        selectors: ["focus"],
        breakpoint: {
          label: "lg",
          minWidth: "1024px",
        },
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": "@media (min-width: 1024px) { [data-tw~=\\"a\\"]:focus {margin-top:24px !important} }",
        "media": "@media (min-width: 1024px) { [data-tw~=\\"a\\"]:focus {margin-top:24px !important} }",
      }
    `)
  })

  test('dark: false, selectors: ["focus", "active"], breakpoint: null', () => {
    expect(
      createCssRule({
        id: "a",
        dark: false,
        selectors: ["focus", "active"],
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": "[data-tw~=\\"a\\"]:focus:active {margin-top:24px !important}",
        "media": "[data-tw~=\\"a\\"]:focus:active {margin-top:24px !important}",
      }
    `)
  })

  test('dark: false, selectors: ["focus", "active"], breakpoint: "lg"', () => {
    expect(
      createCssRule({
        id: "a",
        dark: false,
        selectors: ["focus", "active"],
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": "[data-tw~=\\"a\\"]:focus:active {margin-top:24px !important}",
        "media": "[data-tw~=\\"a\\"]:focus:active {margin-top:24px !important}",
      }
    `)
  })

  test("dark: true, selectors: [], breakpoint: null", () => {
    expect(
      createCssRule({
        id: "a",
        dark: true,
        selectors: [],
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": ".rntwm-dark [data-tw~=\\"a\\"] {margin-top:24px !important}",
        "media": "@media (prefers-color-scheme: dark) { [data-tw~=\\"a\\"] {margin-top:24px !important} }",
      }
    `)
  })

  test('dark: true, selectors: [], breakpoint: "lg"', () => {
    expect(
      createCssRule({
        id: "a",
        dark: true,
        selectors: [],
        breakpoint: {
          label: "lg",
          minWidth: "1024px",
        },
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": "@media (min-width: 1024px) { .rntwm-dark [data-tw~=\\"a\\"] {margin-top:24px !important} }",
        "media": "@media (min-width: 1024px) { @media (prefers-color-scheme: dark) { [data-tw~=\\"a\\"] {margin-top:24px !important} } }",
      }
    `)
  })

  test('dark: true, selectors: ["focus", "active"], breakpoint: null', () => {
    expect(
      createCssRule({
        id: "a",
        dark: true,
        selectors: ["focus", "active"],
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": ".rntwm-dark [data-tw~=\\"a\\"]:focus:active {margin-top:24px !important}",
        "media": "@media (prefers-color-scheme: dark) { [data-tw~=\\"a\\"]:focus:active {margin-top:24px !important} }",
      }
    `)
  })

  test('dark: true, selectors: ["focus", "active"], breakpoint: "lg"', () => {
    expect(
      createCssRule({
        id: "a",
        dark: true,
        selectors: ["focus", "active"],
        breakpoint: {
          label: "lg",
          minWidth: "1024px",
        },
        style: { marginTop: 24 },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "class": "@media (min-width: 1024px) { .rntwm-dark [data-tw~=\\"a\\"]:focus:active {margin-top:24px !important} }",
        "media": "@media (min-width: 1024px) { @media (prefers-color-scheme: dark) { [data-tw~=\\"a\\"]:focus:active {margin-top:24px !important} } }",
      }
    `)
  })
})
