import pluginTester from "babel-plugin-tester"
import plugin from "babel-plugin-macros"
import path from "path"
import * as nanoid from "nanoid/non-secure"

/* @ts-ignore */
import glob from "glob-all"

let id = 0
jest.mock("nanoid/non-secure", () => ({ nanoid: jest.fn() }))
;(nanoid.nanoid as any).mockImplementation(() => {
  id++
  return `mockId-${id}`
})

beforeEach(() => {
  // Reset nanoid mock
  id = 0
})

pluginTester({
  plugin,
  pluginName: "react-native-tailwind.macro",
  babelOptions: {
    configFile: path.join(__dirname, "../../macro.babel.config.js"),
  },
  snapshot: true,
  tests: glob
    .sync(["__fixtures__/**/*.js", "!__fixtures__/**/*.config.js"], {
      cwd: __dirname,
    })
    .map((file: string) => {
      return {
        title: path.basename(file),
        fixture: path.join(__dirname, file),
        snapshot: true,
      }
    }),
})
