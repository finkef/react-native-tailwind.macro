import React from "react"
import { View, Text } from "react-native"
import "react-native-tailwind.macro"

export default function App() {
  return (
    <View
      // @ts-ignore
      tw="bg-blue-500 md:bg-pink-500"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text tw="font-bold md:font-thin">Welcome to React Native</Text>
    </View>
  )
}
