import { useTailwindStyles } from "../../macro"

const useMyCustomHook = () => {
  const styles = useTailwindStyles(
    (tw) => ({
      box: tw`px-8`,
    }),
    []
  )

  return styles
}
