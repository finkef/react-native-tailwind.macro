// @generated: @expo/next-adapter@2.1.0
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
const { withExpo } = require("@expo/next-adapter")
const withPlugins = require("next-compose-plugins")
const path = require("path")

const withTM = require("next-transpile-modules")([
  // "react-native-tailwind.macro",
  // "react-native-media-query",
])

module.exports = withPlugins([
  // withTM({
  //   webpack: (config) => {
  //     return config
  //   },
  // }),
  [
    withExpo,
    {
      // projectRoot: path.join(__dirname, "/../.."),
    },
  ],
])
