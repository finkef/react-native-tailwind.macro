const path = require("path")

module.exports = function (api) {
  api.cache(false)

  return {
    plugins: ["macros"],
    presets: ["@expo/next-adapter/babel"],
  }
}
