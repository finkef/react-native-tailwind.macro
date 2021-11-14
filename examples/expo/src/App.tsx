import * as React from "react"

import { View, Text, TouchableOpacity } from "react-native"
import {
  useTailwindStyles,
  TailwindProvider,
} from "react-native-tailwind.macro"

interface AppProps {
  toggleTheme: () => void
}

const App: React.FunctionComponent<AppProps> = ({ toggleTheme }) => {
  const { box } = useTailwindStyles((tw) => {
    return {
      box: tw`flex-1 items-center bg-pink-500 dark:bg-pink-800 ios:my-20`,
    }
  })

  return (
    <View style={box}>
      <Text tw="font-bold text-blue-900 dark:text-blue-100">Result: 12</Text>

      <TouchableOpacity tw="mt-8" onPress={toggleTheme}>
        <Text tw="text-black dark:text-white">Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  )
}

export default () => {
  const [dark, setDark] = React.useState(false)

  return (
    <TailwindProvider dark={dark}>
      <App toggleTheme={() => setDark((value) => !value)} />
    </TailwindProvider>
  )
}
