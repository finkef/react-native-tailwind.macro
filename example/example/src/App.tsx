import * as React from "react"

import { StyleSheet, View, Text } from "react-native"
import "react-native-tailwind.macro"

// console.log(tw)

export default function App() {
  return (
    // @ts-ignore
    <View tw="bg-blue-500" style={styles.container}>
      <Text>Result: 12</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})
