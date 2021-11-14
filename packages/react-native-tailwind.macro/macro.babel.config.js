module.exports = {
  plugins: [
    "@babel/plugin-syntax-jsx",
    [
      "module-resolver",
      { alias: { "react-native-tailwind.macro": "./src/index.tsx" } },
    ],
  ],
}
