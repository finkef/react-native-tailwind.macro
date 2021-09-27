import tw from '../../macro'

const Comp = () => (
  <View
    tw="pt-8"
    style={[styles.a, isFocused ? tw`bg-blue-400` : tw`bg-pink-500`]}
  />
)
