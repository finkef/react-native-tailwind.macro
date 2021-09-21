import pluginTester from 'babel-plugin-tester'
import plugin from 'babel-plugin-macros'
import path from 'path'

/* @ts-ignore */
import glob from 'glob-all'

pluginTester({
  plugin,
  pluginName: 'react-native-tailwind.macro',
  babelOptions: {
    configFile: path.join(__dirname, '../../macro.babel.config.js'),
  },
  snapshot: true,
  tests: glob
    .sync(['__fixtures__/**/*.js', '!__fixtures__/**/*.config.js'], {
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
