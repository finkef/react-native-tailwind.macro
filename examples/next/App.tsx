import * as React from "react"

import { View, Text } from "react-native"
import {
  TailwindProvider,
  getInitialColorScheme,
} from "react-native-tailwind.macro"
import { Button } from "./components/Button"

interface AppProps {
  toggleTheme: () => void
}

const App: React.FunctionComponent<AppProps> = ({ toggleTheme }) => {
  return (
    <View tw="flex-1 items-center py-20 bg-white dark:bg-gray-900">
      <Button label="Toggle Dark Mode" onPress={toggleTheme} />

      <Text tw="mt-16 font-bold text-xl dark:text-white">Platforms</Text>
      <Text tw="dark:text-white ios:(font-bold text-blue-500)">iOS</Text>
      <Text tw="dark:text-white android:(font-bold text-blue-500)">
        Android
      </Text>
      <Text tw="dark:text-white web:(font-bold text-blue-500)">Web</Text>
      <Text tw="dark:text-white macos:(font-bold text-blue-500)">macOS</Text>
      <Text tw="dark:text-white windows:(font-bold text-blue-500)">
        Windows
      </Text>

      <Text tw="mt-16 font-bold text-xl dark:text-white">Breakpoints</Text>
      <Text tw="dark:text-white xs:(font-bold text-blue-500 dark:text-pink-500)">
        xs
      </Text>
      <Text tw="dark:text-white sm:(font-bold text-blue-500 dark:text-pink-500)">
        sm
      </Text>
      <Text tw="dark:text-white md:(font-bold text-blue-500 dark:text-pink-500)">
        md
      </Text>
      <Text tw="dark:text-white lg:(font-bold text-blue-500 dark:text-pink-500)">
        lg
      </Text>
      <Text tw="dark:text-white xl:(font-bold text-blue-500 dark:text-pink-500)">
        xl
      </Text>

      <Text tw="mt-8 text-custom">
        Text using custom color from tailwind.config.js
      </Text>
    </View>
  )
}

export default () => {
  const [dark, setDark] = React.useState(getInitialColorScheme() === "dark")

  return (
    <TailwindProvider dark={dark}>
      <App toggleTheme={() => setDark((value) => !value)} />
    </TailwindProvider>
  )
}
