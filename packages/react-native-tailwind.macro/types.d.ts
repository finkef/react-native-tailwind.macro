import { TailwindProvider } from "./src/tailwind-context"
import {
  getInitialColorScheme,
  getColorSchemeFromCookie,
  setColorSchemeCookie,
} from "./src/utils"

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string

      /**
       * Only available in react-native-web. Allows setting data-* attributes on DOM elements.
       */
      dataSet?: {
        /**
         * Responsive id available from Tailwind styles, e.g. `styles.box.id`.
         */
        tw?: string
      } & Record<string, any>
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

// eslint-disable-next-line no-undef
declare const flush: () => JSX.Element

export {
  useTailwindStyles,
  flush,
  TailwindProvider,
  getInitialColorScheme,
  getColorSchemeFromCookie,
  setColorSchemeCookie,
}
