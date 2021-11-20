import { parseString, transformStyles } from "../macro/transform-styles"

test("parseString", () => {
  expect(parseString("pt-8")).toMatchInlineSnapshot(`
    Array [
      Object {
        "content": "pt-8",
        "prefixes": Array [],
      },
    ]
  `)

  expect(
    parseString(
      "pt-8 ios:mt-4 android:sm:bg-blue-400 xl:(bg-pink-200 macos:ml-1 android:(text-gray-500 focused:font-bold))"
    )
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "content": "pt-8",
        "prefixes": Array [],
      },
      Object {
        "content": "mt-4",
        "prefixes": Array [
          "ios",
        ],
      },
      Object {
        "content": "bg-blue-400",
        "prefixes": Array [
          "android",
          "sm",
        ],
      },
      Object {
        "content": "bg-pink-200",
        "prefixes": Array [
          "xl",
        ],
      },
      Object {
        "content": "ml-1",
        "prefixes": Array [
          "xl",
          "macos",
        ],
      },
      Object {
        "content": "text-gray-500",
        "prefixes": Array [
          "xl",
          "android",
        ],
      },
      Object {
        "content": "font-bold",
        "prefixes": Array [
          "xl",
          "android",
          "focused",
        ],
      },
    ]
  `)

  expect(parseString("pt-8 ios:()")).toMatchInlineSnapshot(`
    Array [
      Object {
        "content": "pt-8",
        "prefixes": Array [],
      },
    ]
  `)

  expect(
    parseString(
      "pt-8 ios:sm:(pb-8) android:(mt-8 xl:(mt-16 w-[40px] focused:(mb-12)))"
    )
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "content": "pt-8",
        "prefixes": Array [],
      },
      Object {
        "content": "pb-8",
        "prefixes": Array [
          "ios",
          "sm",
        ],
      },
      Object {
        "content": "mt-8",
        "prefixes": Array [
          "android",
        ],
      },
      Object {
        "content": "mt-16",
        "prefixes": Array [
          "android",
          "xl",
        ],
      },
      Object {
        "content": "w-[40px]",
        "prefixes": Array [
          "android",
          "xl",
        ],
      },
      Object {
        "content": "mb-12",
        "prefixes": Array [
          "android",
          "xl",
          "focused",
        ],
      },
    ]
  `)
})

describe("transformStyles", () => {
  test("without custom tailwind config", () => {
    expect(transformStyles("pt-8", { darkMode: "class", theme: {} }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": undefined,
          "style": Object {
            "paddingTop": 32,
          },
        },
      ]
    `)

    expect(
      transformStyles(
        "pt-8 ios:mt-4 android:sm:bg-blue-400 xl:(bg-pink-200 macos:ml-1 android:(text-gray-500 focused:font-bold))",
        { darkMode: "class", theme: {} }
      )
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": undefined,
          "style": Object {
            "paddingTop": 32,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "ios",
          "style": Object {
            "marginTop": 16,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "android",
          "style": Object {
            "backgroundColor": "#60a5fa",
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": undefined,
          "style": Object {
            "backgroundColor": "#fbcfe8",
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "macos",
          "style": Object {
            "marginLeft": 4,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "android",
          "style": Object {
            "color": "#6b7280",
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "android",
          "style": Object {
            "fontWeight": "bold",
          },
        },
      ]
    `)

    expect(transformStyles("pt-8 ios:()", { darkMode: "class", theme: {} }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": undefined,
          "style": Object {
            "paddingTop": 32,
          },
        },
      ]
    `)

    expect(
      transformStyles(
        "pt-8 ios:sm:(pb-8) android:(mt-8 xl:(mt-16 w-[40px] focused:(mb-12)))",
        { darkMode: "class", theme: {} }
      )
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": undefined,
          "style": Object {
            "paddingTop": 32,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "ios",
          "style": Object {
            "paddingBottom": 32,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "android",
          "style": Object {
            "marginTop": 32,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "android",
          "style": Object {
            "marginTop": 64,
            "width": 40,
          },
        },
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": "android",
          "style": Object {
            "marginBottom": 48,
          },
        },
      ]
    `)
  })

  test("with custom tailwind config", () => {
    expect(
      transformStyles("bg-blue-500 text-custom-900 pt-1", {
        darkMode: "media",
        theme: {
          colors: { blue: { 500: "#abc" } },
          spacing: { "1": "10", "2": "20" },
          extend: {
            colors: {
              custom: {
                900: "#deadbeef",
              },
            },
          },
        },
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "breakpoint": undefined,
          "dark": false,
          "platform": undefined,
          "style": Object {
            "backgroundColor": "#abc",
            "color": "#deadbeef",
            "paddingTop": 10,
          },
        },
      ]
    `)
  })
})
