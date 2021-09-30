const path = require("path")

module.exports = function (api) {
  api.cache(false)

  return {
    presets: ["babel-preset-expo"],
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
          },
        },
      ],
    ],
    sourceType: "unambiguous",
  }
}
