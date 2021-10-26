import * as React from "react"

import { View, Text } from "react-native"
import { useTailwindStyles } from "react-native-tailwind.macro"

export default function App() {
  const { box } = useTailwindStyles((tw) => {
    return { box: tw`flex-1 bg-pink-500 ios:my-20 text-bold` }
  })

  return (
    <View style={box}>
      {/* <View tw="bg-pink-400 ios:mb-20" style={styles.container}> */}
      <Text tw="font-bold">Result: 12</Text>
    </View>
  )
}
