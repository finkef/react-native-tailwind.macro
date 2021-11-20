const path = require("path")

module.exports = function (api) {
  api.cache(false)

  return {
    presets: ["@expo/next-adapter/babel"],
    plugins: ["macros"],
  }
}
