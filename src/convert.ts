import type { StyleObjectProps, PlatformProps, MediaProps } from './types'

import tailwind from 'tailwind-rn'
import { Platform } from 'react-native'

// let input = "xl:pt-16 ios:android:md:pt-8 ios:2xl:(pt-8 bg-blue-500 w-32) web:(pt-16)"

//Regex for spliting with spaces but not in parentherses
//https://stackoverflow.com/questions/41075573/split-string-by-all-spaces-except-those-in-parentheses
export function convert(input: string) {
  let partedInput = input.split(/(?!\(.*)\s(?![^(]*?\))/g)
  let compStyles: StyleObjectProps[] = []

  partedInput.map((twStyle) => {
    //Check if nested
    let isNested = twStyle.includes('(')
    let hasOptions = twStyle.includes(':')
    //Split input into peaces
    let splitInput = twStyle.split(':')
    //If a specific size or platform command is fount
    let specificPlatform = false
    let specificMedia = false
    //Object
    let platforms: PlatformProps = {
      ios: false,
      android: false,
      web: false,
      windows: false,
      macos: false,
    }
    let media: MediaProps = {
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    }
    //Find if it is a nested twCommand
    //Maps trough platform and media queries
    if (isNested && platforms !== null) {
      splitInput
        .filter((inputs) => !inputs.includes('('))
        .map((el) => {
          switch (el) {
            case 'ios':
            case 'android':
            case 'web':
              platforms[el] = true
              specificPlatform = true
              break
            case 'sm':
              media[el] = true
              specificMedia = true
              break
            case 'md':
              media.md = true
              specificMedia = true
              break
            case 'lg':
              media.lg = true
              specificMedia = true
              break
            case 'xl':
              media.xl = true
              specificMedia = true
              break
            case '2xl':
              media.xxl = true
              specificMedia = true
              break
          }
        })
    } else if (hasOptions) {
      splitInput
        .filter((inputs) => !inputs.includes('('))
        .map((el) => {
          switch (el) {
            case 'ios':
            case 'android':
              platforms[el] = true
              specificPlatform = true
              break
            case 'sm':
              media[el] = true
              specificMedia = true
              break
            case 'md':
              media.md = true
              specificMedia = true
              break
            case 'lg':
              media.lg = true
              specificMedia = true
              break
            case 'xl':
              media.xl = true
              specificMedia = true
              break
            case '2xl':
              media.xxl = true
              specificMedia = true
              break
          }
        })
    }

    if (isNested) {
      //Find the tw commands in brakets
      let styles = splitInput.filter((inputs) => inputs.includes('('))
      //Map over styles in brakets and put styling in there
      styles[0]
        .replace('(', '')
        .replace(')', '')
        .split(' ')
        .map((style) => {
          let styling: StyleObjectProps = {
            platforms: specificPlatform ? platforms : null,
            media: specificMedia ? media : null,
            style: tailwind(style),
          }
          compStyles.push(styling)
        })
    } else {
      let styling: StyleObjectProps = {
        platforms: specificPlatform ? platforms : null,
        media: specificMedia ? media : null,
        style: tailwind(
          hasOptions
            ? twStyle.split(':')[twStyle.split(':').length - 1]
            : twStyle
        ),
      }
      compStyles.push(styling)
    }
  })

  function getKey({ platforms, media }: StyleObjectProps): string {
    let platformKey = Object.entries(platforms || {})
      .filter(([_key, value]) => value)
      .map(([key]) => key)
    platformKey.sort()
    let mediaKey = Object.entries(media || {})
      .filter(([_key, value]) => value)
      .map(([key]) => key)
    mediaKey.sort()
    return [...platformKey, ...mediaKey].join('_')
  }

  //Compress doubled styles to one style object
  let container = Object.values(
    compStyles.reduce(
      (
        acc: Record<string, StyleObjectProps>,
        crr: StyleObjectProps
      ): Record<string, StyleObjectProps> => {
        let unique = getKey(crr)
        if (acc[unique]) {
          acc[unique].style = { ...acc[unique].style, ...crr.style }
        } else {
          acc[unique] = crr
        }
        return acc
      },
      {}
    )
  )

  //Order platform size from small to high
  //Get the size postions in integer to be able to sort
  //[0,0,1,3,5]
  let sizeNumber = container.map((obj) => {
    if (obj.media == null) {
      return 0
    } else {
      return Object.values(obj.media).indexOf(true) + 1
    }
  })

  //connect the size integer with the whole object
  let orderObj: Record<string, StyleObjectProps> = {}
  sizeNumber.map((index, i) => {
    orderObj[index + '_' + i] = container[i]
  })

  //Order the Object by its keys
  let platformOrdered = Object.keys(orderObj)
    .sort((fir, sec) => {
      return parseInt(fir.split('_')[0], 10) - parseInt(sec.split('_')[0], 10)
    })
    .map((key) => orderObj[key])

  //Hardcoded values same as tailwind
  let mediaQueryRules = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }
  //convert the media to querys
  let withQueries = platformOrdered.map((obj) => {
    if (obj.media !== null) {
      let keys = Object.keys(obj.media) as (keyof MediaProps)[]
      let activeKey = keys.find((key) => obj.media?.[key])
      let activePixel = mediaQueryRules[activeKey!]
      let query = { [`@media(min-width: ${activePixel}px)`]: obj.style }
      obj.style = query
      return obj
    } else {
      return obj
    }
  })
  return withQueries
}

export function checkPlatform(styles: StyleObjectProps[]) {
  return styles.filter(
    (style) => style.platforms === null || style.platforms[Platform.OS]
  )
}
