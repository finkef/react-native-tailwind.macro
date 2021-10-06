import { useTailwindStyles } from "../../macro"

const Comp = () => {
  const styles = useTailwindStyles((tw) => ({
    box: tw`px-8`,
  }))

  return <View style={styles.box} />
}
