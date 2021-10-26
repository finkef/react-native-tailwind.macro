const path = require("path")

module.exports = function (api) {
  api.cache(false)

  return {
    presets: ["@expo/next-adapter/babel"],
    plugins: [
      "macros",
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
          alias: {
            // For development, we want to alias the library to the source
            ["react-native-tailwind.macro/exports"]: path.join(
              __dirname,
              "../../src/exports.ts"
            ),
            ["react-native"]: path.join(
              __dirname,
              "node_modules/react-native-web"
            ),
            ["react-native-web"]: path.join(
              __dirname,
              "node_modules/react-native-web"
            ),
          },
        },
      ],
    ],
    sourceType: "unambiguous",
  }
}
