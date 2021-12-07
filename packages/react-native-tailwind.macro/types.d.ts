import { DetailedReactHTMLElement } from "react"
import { TailwindProvider } from "./src/tailwind-context"

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string

      /**
       * Only available in react-native-web. Allows setting data-* attributes on DOM elements.
       */
      dataSet?: Record<string, any>
    }
  }
}

type TwFunction = (strings: TemplateStringsArray) => any

declare const useTailwindStyles: <
  T extends (tw: TwFunction) => { [key: string]: any }
>(
  fn: T,
  deps?: any[]
) => {
  [key in keyof ReturnType<T>]: ReturnType<T>[key] & { readonly id?: string }
}

declare const flush: () => DetailedReactHTMLElement<
  {
    id: string
    key: string
    dangerouslySetInnerHTML: {
      __html: string
    }
  },
  // eslint-disable-next-line no-undef
  HTMLElement
>

export { useTailwindStyles, flush, TailwindProvider }
