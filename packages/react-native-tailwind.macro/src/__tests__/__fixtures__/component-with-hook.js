import { useTailwindStyles } from "../../macro"

const Comp = () => {
  const { box } = useTailwindStyles(
    (tw) => ({ box: isFocused ? tw`md:px-8` : tw`lg:pt-16` }),
    [isFocused]
  )

  return <View tw="bg-blue-500" style={box} dataSet={{ tw: box.id }} />
}
