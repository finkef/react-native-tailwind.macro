import { useTailwindStyles } from "../../macro"

const useMyCustomHook = () =>
  useTailwindStyles(
    (tw) => ({
      box: tw`px-8`,
    }),
    []
  )
