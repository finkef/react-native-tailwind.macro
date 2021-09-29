// @generated: @expo/next-adapter@2.1.0
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
const { withExpo } = require("@expo/next-adapter")
const withPlugins = require("next-compose-plugins")

const withTM = require("next-transpile-modules")([])

module.exports = withPlugins([
  withTM({
    webpack: (config) => {
      return config
    },
  }),
  [
    withExpo,
    {
      projectRoot: __dirname,
    },
  ],
])