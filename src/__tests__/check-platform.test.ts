import { convert, checkPlatform } from "../convert"

const mock = jest.fn(() => "android")

jest.mock("react-native", () => ({
  Platform: {
    get OS() {
      return mock()
    },
  },
}))

test("checkPortal advanced ios ", () => {
  mock.mockImplementation(() => "ios")
  expect(
    checkPlatform(
      convert(
        "ios:(bg-blue-500 text-white) android:(bg-purple-500 text-red-900) p-8"
      )
    )
  ).toStrictEqual([
    {
      platforms: {
        ios: true,
        android: false,
        web: false,
        macos: false,
        windows: false,
      },
      media: null,
      dark: false,
      style: {
        backgroundColor: "rgba(59, 130, 246, 1)",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    {
      platforms: null,
      media: null,
      dark: false,
      style: {
        paddingBottom: 32,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 32,
      },
    },
  ])
})

test("checkPortal basic android", () => {
  mock.mockImplementation(() => "android")
  expect(checkPlatform(convert("android:pt-8 ios:pt-16"))).toStrictEqual([
    {
      platforms: {
        ios: false,
        android: true,
        web: false,
        macos: false,
        windows: false,
      },
      dark: false,
      media: null,
      style: { paddingTop: 32 },
    },
  ])
})

test("checkPortal basic ios", () => {
  mock.mockImplementation(() => "ios")
  expect(checkPlatform(convert("android:pt-8 ios:pt-16"))).toStrictEqual([
    {
      platforms: {
        ios: true,
        android: false,
        web: false,
        macos: false,
        windows: false,
      },
      media: null,
      dark: false,
      style: { paddingTop: 64 },
    },
  ])
})
