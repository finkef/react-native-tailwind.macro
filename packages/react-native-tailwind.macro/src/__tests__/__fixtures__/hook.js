import { useTailwindStyles } from "../../macro"

const Comp = () => {
  const [isFocused] = useState(false)

  const styles = useTailwindStyles(
    (tw) => ({
      box: isFocused ? tw`px-8` : tw`px-16`,
    }),
    [isFocused]
  )

  return <View style={styles.box} />
}
