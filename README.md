# react-native-tailwind.macro ✨

![npm version](https://img.shields.io/npm/v/react-native-tailwind.macro)
![github workflow status](https://img.shields.io/github/workflow/status/finkef/react-native-tailwind.macro/ci)

![demo](images/demo.png)

> Babel macro for easily writing responsive Tailwind styles in React Native (+ Web).

---

Easily style components using the `tw` prop:

```ts
import "react-native-tailwind.macro"
import { View, Text } from "react-native"

const Badge = () => (
  <View tw="px-3 py-0.5 rounded-xl ios:rounded-full bg-blue-100 dark:bg-blue-800">
    <Text tw="text-sm lg:text-lg font-medium text-blue-800">Badge</Text>
  </View>
)
```

Apply conditions and create memoized and complex styles using `useTailwindStyles`:

```ts
import { useTailwindStyles } from "react-native-tailwind.macro"
import { View, Text } from "react-native"

const Status = ({ isActive, labelColor }) => {
  const { box, text } = useTailwindStyles(
    (tw) => ({
      box: [tw`rounded-3xl px-8 py-4 bg-gray-100`, isActive && tw`bg-blue-800`],
      text: [tw`font-medium`, isActive && tw`font-bold`, { color: labelColor }],
    }),
    [isActive, labelColor]
  )

  return (
    <View style={box}>
      <Text style={text}>{isActive ? "Active" : "Inactive"}</Text>
    </View>
  )
}
```

---

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Using the tw prop](#using-the-tw-prop)
  - [useTailwindStyles](#usetailwindstyles)
  - [TailwindProvider](#tailwindprovider)
  - [Macro Options](#macro-options)
- [Next.js SSR Setup](#nextjs-ssr-setup)
- [How it works](#how-it-works)
- [Caveats](#caveats)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

## Features

- ⚡️&nbsp;&nbsp;&nbsp;Responsive styles on native and web (with CSS Media Queries and SSR support - no more layout flashes!)

  `bg-blue-500 md:bg-purple-500 xl:bg-indigo-500`

- 🌓&nbsp;&nbsp;&nbsp;Dark Mode

  `text-black dark:text-white`

- 📱&nbsp;&nbsp;&nbsp;Platform selectors

  `ios:bg-blue-800 android:bg-purple-800`

- 🖥&nbsp;&nbsp;&nbsp;Web only selectors

  `focus:bg-blue-400 active:bg-indigo-400`

- 🕺&nbsp;&nbsp;&nbsp;Stackable selectors

  `ios:md:font-bold android:(text-blue-800 sm:dark:text-blue-100)`

- 🧠&nbsp;&nbsp;&nbsp;All styles are statically generated at build time and memoized

- 🛠&nbsp;&nbsp;&nbsp;`useTailwindStyles` hook for optimized conditional and complex styles

- 📝&nbsp;&nbsp;&nbsp;Respects your tailwind.config.js and allows for [custom classes and plugins](https://github.com/jaredh159/tailwind-react-native-classnames#adding-custom-classes) made possible by the amazing [tailwind-react-native-classnames](https://github.com/jaredh159/tailwind-react-native-classnames)

## Installation

This library relies on [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros).

```sh
yarn add --dev babel-plugin-macros

yarn add react-native-tailwind.macro
```

Add babel-plugin-macros to your `.babelrc` or `babel.config.js` and you're all set up!

```json
{
  "plugins": ["macros"]
}
```

## Usage

### Using the `tw` prop

The best and easiest usage is to simply use the `tw` prop that is artificially added to all JSX elements. Under the hood, the macro removes the `tw` prop completely and instead applies or extends a `style` prop and also adds a web-only data-tw id used to apply CSS-based media queries.

All you have to do is have _any_ import of react-native-tailwind.macro in your file, either `import "react-native-tailwind.macro"` or `import { /* whatever import you need */ } from "react-native-tailwind.macro"`.

**Example:**

```ts
import "react-native-tailwind.macro"
import { View } from "react-native"
import { MyComponent } from "./my-component"

const Example = () => (
  <>
    <View tw="w-[100px] h-[100px] bg-blue-500 md:bg-purple-500" />

    {/* Only works if MyComponent accepts a "style" prop */}
    <MyComponent tw="bg-pink-500 ios:dark:bg-indigo-800" />
  </>
)
```

⚠️ **NOTE:** In order for `<MyComponent />` to render responsive styles on the web, you need to also pass down a `dataSet` prop to the element receiving the style. The easiest way to achieve this would be to use the rest-spread syntax for `MyComponent`'s props and pass all non-used props to the style-carrying element:

```ts
const MyComponent = ({ disabled, ...props }) => (
  <View {...props}>
    <Text>{disabled ? "Disabled" : "Enabled"}</Text>
  </View>
)
```

### `useTailwindStyles`

In cases where you don't have access to a style prop or need to apply styles using other props, like `contentContainerStyle` on a `ScrollView`, you can use `useTailwindStyles` to produce the desired style objects.

```ts
import { useTailwindStyles } from "react-native-tailwind.macro"
import { ScrollView } from "react-native"

const Example = () => {
  const styles = useTailwindStyles((tw) => ({
    contentContainer: tw`py-8`,
  }))

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} {/* ... */}>
      {/* Content */}
    </ScrollView>
  )
}
```

This also comes in handy, when you want to apply styles conditionally, pass in [Reanimated](https://github.com/software-mansion/react-native-reanimated) animated styles or do any other fancy stuff with your styles.

```ts
import { useTailwindStyles } from "react-native-tailwind.macro"
import { TouchableOpacity, Text } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

const Example = ({ rounded, backgroundColor }) => {
  // Reanimated 🔥
  const offset = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * 255 }],
    }
  })

  const styles = useTailwindStyles(
    (tw) => ({
      box: [
        tw`w-[100px] h-[100px] lg:(w-[300px] h-[300px])`,
        rounded && tw`rounded-3xl`, // conditional Tailwind style
        animatedStyles, // apply Reanimated styles
        { backgroundColor }, // apply passed in backgroundColor
      ],
      text: tw`text-lg font-bold`,
    }),
    // only recompute when any of these deps change, skip all unnecessary re-renders
    [rounded, animatedStyles, backgroundColor]
  )

  return (
    <>
      <Animated.View
        style={styles.box}
        {/* Required for responsive styles on the web, hence it's preferred to apply all responsive styles through the `tw` prop */}
        dataSet={{ tw: styles.box.id }}
      />
      <TouchableOpacity
        {/* Mix and match tw prop and styles in your code */}
        tw="mt-8"
        onPress={() => (offset.value = Math.random())}
      >
        <Text style={styles.text}>Move</Text>
      </TouchableOpacity>
    </>
  )
}
```

#### Pro Tip 👻

Even if you don't rely on any Tailwind styles, `useTailwindStyles` can be used to generate memoized styles as performance boost, see [this gist](https://gist.github.com/mrousavy/0de7486814c655de8a110df5cef74ddc#react-native) for explanation.

```ts
const styles = useTailwindStyles(
  (tw) => ({
    box: [{ backgroundColor: "red" }, isActive && { backgroundColor: "pink" }],
  }),
  [isActive]
)
```

### `TailwindProvider`

By default, the device's color scheme preference is used to enable dark mode. If you want to dynamically change whether dark mode is enabled, you can wrap your App with `TailwindProvider` and pass in your dark mode preference.

On the web, the set value will automatically be persisted in a cookie to enable SSR and SSG without flashes on load.

```ts
import {
  TailwindProvider,
  getInitialColorScheme,
} from "react-native-tailwind.macro"

const App = () => {
  const [darkMode, setDarkMode] = useState(getInitialColorScheme() === "dark")

  return <TailwindProvider dark={darkMode}>{/* ... */}</TailwindProvider>
}
```

### `getInitialColorScheme`

Returns either the cookie-persisted preference on web or falls back to the system preference.

```ts
import { getInitialColorScheme } from "react-native-tailwind.macro"

getInitialColorScheme() // returns "light" or "dark"
```

### Macro Options

You can apply options to the macro by adding a `babel-plugin-macros.config.js` or specifying them in your `package.json` like below:

```js
// babel-plugin-macros.config.js
module.exports = {
  reactNativeTailwind: {
    // your options
  },
}
```

Alternatively:

```js
// package.json
{
  //...
  "babelMacros": {
    "reactNativeTailwind": {
      // your options
    }
  }
}
```

<details>
<summary><strong>Available Options</strong></summary>

| Name   | Default                  | Description                       |
| ------ | ------------------------ | --------------------------------- |
| config | `"./tailwind.config.js"` | The path to your Tailwind config. |

</details>

## Next.js SSR Setup

In order to enable SSR support via media queries on Next.js, update your [custom document](https://nextjs.org/docs/advanced-features/custom-document) as follows:

```diff
// pages/_document.js

+ import { flush } from "react-native-tailwind.macro"

/* ... */

export class Document extends NextDocument {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent("Main", () => Main)
    const { getStyleElement } = AppRegistry.getApplication("Main")
    const page = renderPage()
    const styles = [
      getStyleElement(),
+     flush(),
    ]
    return { ...page, styles: React.Children.toArray(styles) }
  }

  render() {
    /* ... */
  }
}
```

## How it works

Behind the scenes, `react-native-tailwind.macro` turns your _simple_ code from this

```ts
import "react-native-tailwind.macro"

const Example = () => (
  <View tw="w-[100px] h-[100px] bg-purple-500 dark:ios:lg:bg-pink-500 hover:bg-indigo-500" />
)
```

... to something along the lines of this:

```ts
// Import the necessary utilities
import * as ReactNativeTailwindMacro from "react-native-tailwind.macro/exports"

// Creates a hook based on the static output from Tailwind style compilation
const useStyles = ReactNativeTailwindMacro.createUseTailwindStyles({
  // Compiled Tailwind styles with unique id and information on when to apply
  a7gsbs: [
    {
      dark: false,
      selectors: [],
      style: {
        width: 100,
        height: 100,
        backgroundColor: "#8b5cf6",
      },
    },
    {
      dark: true,
      breakpoint: {
        label: "lg",
        minWidth: "1024px",
      },
      selectors: [],
      platform: "ios",
      style: {
        backgroundColor: "#ec4899",
      },
    },
    {
      dark: false,
      // Styles on web will only be applied on web
      selectors: ["hover"],
      style: {
        backgroundColor: "#6366f1",
      },
    },
  ],
})

const Example = () => {
  // Call to the produced hook, takes into account the current context and returns
  // memoized styles that only change when the context changes
  const tailwindStyles = useStyles()

  return (
    <View
      // Apply the memoized style
      style={tailwindStyles["a7gsbs"]}
      // Apply data-tw id for CSS-based media queries
      dataSet={{ tw: tailwindStyles["a7gsbs"].id }}
    />
  )
}
```

For more examples and use cases, check the [macro test snapshots](packages/react-native-tailwind.macro/src/__snapshots__/macro.test.ts.snap).

## Caveats

- Only works in function components due to dependency on context

- `useTailwindStyles` doesn't properly support responsive styles on the web, prefer to use the `tw` prop for responsive styles if possible

- `<View tw="..."/>` and `` tw`...`  `` only accept static styles without string interpolation

## Credits

- [tailwind-react-native-classnames](https://github.com/jaredh159/tailwind-react-native-classnames): Used for compiling Tailwind styles

- [react-native-media-query](https://github.com/kasinskas/react-native-media-query): Provides the base implementation used to enable CSS media query support

- [twin.macro](https://github.com/ben-rogerson/twin.macro): Inspiration for writing a babel macro

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
