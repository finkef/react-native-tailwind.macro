import { flush } from "react-native-media-query"

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string
    }
  }
}

type TwFunction = (strings: TemplateStringsArray) => any

declare const useTailwindStyles: <
  T extends (tw: TwFunction) => { [key: string]: any }
>(
  fn: T,
  deps?: any[]
) => ReturnType<T>

declare const flush: flush

export { useTailwindStyles, flush }
