import { convert } from '../convert'

test('platform android and ios convert', () => {
  expect(convert('android:pt-8 ios:pt-16')).toStrictEqual([
    {
      platforms: { ios: false, android: true, web: false },
      media: null,
      style: { paddingTop: 32 },
    },
    {
      platforms: { ios: true, android: false, web: false },
      media: null,
      style: { paddingTop: 64 },
    },
  ])
})

test('basic convert', () => {
  expect(convert('pt-8')).toStrictEqual([
    {
      platforms: null,
      media: null,
      style: { paddingTop: 32 },
    },
  ])
})

test('size convert', () => {
  expect(convert('sm:bg-blue-500')).toStrictEqual([
    {
      platforms: null,
      media: { sm: true, md: false, lg: false, xl: false, xxl: false },
      style: {
        '@media(min-width: 640px)': {
          backgroundColor: 'rgba(59, 130, 246, 1)',
        },
      },
    },
  ])
})

test('platform ios convert', () => {
  expect(convert('ios:pt-8')).toStrictEqual([
    {
      platforms: { ios: true, android: false, web: false },
      media: null,
      style: { paddingTop: 32 },
    },
  ])
})

test('platform android convert', () => {
  expect(convert('android:pt-8')).toStrictEqual([
    {
      platforms: { ios: false, android: true, web: false },
      media: null,
      style: { paddingTop: 32 },
    },
  ])
})

test('nested convert', () => {
  expect(convert('md:(pt-4 bg-blue-500)')).toStrictEqual([
    {
      platforms: null,
      media: { sm: false, md: true, lg: false, xl: false, xxl: false },
      style: {
        '@media(min-width: 768px)': {
          paddingTop: 16,
          backgroundColor: 'rgba(59, 130, 246, 1)',
        },
      },
    },
  ])
})

test('platform and size convert', () => {
  expect(convert('ios:lg:pt-8')).toStrictEqual([
    {
      platforms: { ios: true, android: false, web: false },
      media: { sm: false, md: false, lg: true, xl: false, xxl: false },
      style: { '@media(min-width: 1024px)': { paddingTop: 32 } },
    },
  ])
})

test('combined convert', () => {
  expect(
    convert(
      'xl:pt-16 ios:android:md:pt-8 ios:2xl:(pt-8 bg-blue-500 w-32) web:(pt-16)'
    )
  ).toStrictEqual([
    {
      platforms: { ios: false, android: false, web: true },
      media: null,
      style: { paddingTop: 64 },
    },
    {
      platforms: { ios: true, android: true, web: false },
      media: { sm: false, md: true, lg: false, xl: false, xxl: false },
      style: { '@media(min-width: 768px)': { paddingTop: 32 } },
    },
    {
      platforms: null,
      media: { sm: false, md: false, lg: false, xl: true, xxl: false },
      style: { '@media(min-width: 1280px)': { paddingTop: 64 } },
    },
    {
      platforms: { ios: true, android: false, web: false },
      media: { sm: false, md: false, lg: false, xl: false, xxl: true },
      style: {
        '@media(min-width: 1536px)': {
          paddingTop: 32,
          backgroundColor: 'rgba(59, 130, 246, 1)',
          width: 128,
        },
      },
    },
  ])
})

test('flipped combined convert', () => {
  expect(
    convert(
      'ios:android:md:pt-8 xl:pt-16 web:(pt-16) ios:2xl:(pt-8 bg-blue-500 w-32)'
    )
  ).toStrictEqual([
    {
      platforms: { ios: false, android: false, web: true },
      media: null,
      style: { paddingTop: 64 },
    },
    {
      platforms: { ios: true, android: true, web: false },
      media: { sm: false, md: true, lg: false, xl: false, xxl: false },
      style: { '@media(min-width: 768px)': { paddingTop: 32 } },
    },
    {
      platforms: null,
      media: { sm: false, md: false, lg: false, xl: true, xxl: false },
      style: { '@media(min-width: 1280px)': { paddingTop: 64 } },
    },
    {
      platforms: { ios: true, android: false, web: false },
      media: { sm: false, md: false, lg: false, xl: false, xxl: true },
      style: {
        '@media(min-width: 1536px)': {
          paddingTop: 32,
          backgroundColor: 'rgba(59, 130, 246, 1)',
          width: 128,
        },
      },
    },
  ])
})
