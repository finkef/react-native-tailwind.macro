import { transformStyles } from "../macro/transform-styles"
import { checkPlatform } from "../check-platform"

const mock = jest.fn(() => "android")

jest.mock("react-native", () => ({
  Platform: {
    get OS() {
      return mock()
    },
  },
}))

test("checkPlatform advanced ios ", () => {
  mock.mockImplementation(() => "ios")
  expect(
    checkPlatform(
      transformStyles(
        "ios:(bg-blue-500 text-white) android:(bg-purple-500 text-red-900) p-8",
        { darkMode: "media", theme: {} }
      )
    )
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "breakpoint": undefined,
        "dark": false,
        "platform": undefined,
        "style": Object {
          "paddingBottom": 32,
          "paddingLeft": 32,
          "paddingRight": 32,
          "paddingTop": 32,
        },
      },
      Object {
        "breakpoint": undefined,
        "dark": false,
        "platform": "ios",
        "style": Object {
          "backgroundColor": "#3b82f6",
          "color": "#fff",
        },
      },
    ]
  `)
})

test("checkPlatform basic android", () => {
  mock.mockImplementation(() => "android")
  expect(
    checkPlatform(
      transformStyles("android:pt-8 ios:pt-16", {
        darkMode: "media",
        theme: {},
      })
    )
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "breakpoint": undefined,
        "dark": false,
        "platform": "android",
        "style": Object {
          "paddingTop": 32,
        },
      },
    ]
  `)
})

test("checkPlatform basic ios", () => {
  mock.mockImplementation(() => "ios")
  expect(
    checkPlatform(
      transformStyles("android:pt-8 ios:pt-16", {
        darkMode: "media",
        theme: {},
      })
    )
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "breakpoint": undefined,
        "dark": false,
        "platform": "ios",
        "style": Object {
          "paddingTop": 64,
        },
      },
    ]
  `)
})
