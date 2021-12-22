import React, { FunctionComponent, useState } from "react"
import { Text, TouchableWithoutFeedback, View } from "react-native"
import { useTailwindStyles } from "react-native-tailwind.macro"

export interface ButtonProps {
  label: string
  onPress?: () => void
}

export const Button: FunctionComponent<ButtonProps> = ({ label, onPress }) => {
  const [pressed, setPressed] = useState(false)

  const styles = useTailwindStyles(
    (tw) => ({
      button: [
        tw`px-8 py-4 rounded-3xl bg-blue-500`,
        pressed && tw`bg-blue-200`,
      ],
      text: tw`text-white dark:text-black`,
    }),
    [pressed]
  )

  return (
    <TouchableWithoutFeedback
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View style={styles.button} dataSet={{ tw: styles.button.id }}>
        <Text style={styles.text} dataSet={{ tw: styles.text.id }}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}
