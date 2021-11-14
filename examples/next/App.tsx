import React from "react"
import { View, Text } from "react-native"
import { useTailwindStyles } from "react-native-tailwind.macro"

export default function App() {
  const a = useTailwindStyles(
    (tw) => ({
      box: tw`bg-purple-500`,
    }),
    []
  )

  return (
    <View
      tw="bg-blue-500 md:bg-green-500"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text tw="font-bold md:font-thin text-gray-900">
        Welcome to React Native
      </Text>
    </View>
  )
}
