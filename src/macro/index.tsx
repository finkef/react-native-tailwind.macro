import { createMacro, MacroHandler, MacroParams } from "babel-plugin-macros"
import { NodePath } from "@babel/core"
import { JSXAttribute, ObjectExpression } from "@babel/types"
import {
  addCreateUseTailwindStyles,
  addImport,
  addUseStylesCall,
  findParentFunction,
} from "./utils"
import { handleTwProp } from "./handle-tw-prop"
import { handleHook } from "./handle-hook"

const macro = (params: MacroParams & { source: string }) => {
  const {
    references: { useTailwindStyles: useTailwindStylesReferences = [] },
    state,
    babel: { types: t },
  } = params

  const program = state.file.path

  addImport({ ...params, t, path: program, program })

  /**
   * Traverse and collect all tw props on the surrounding component function in a first run.
   */
  program.traverse({
    JSXElement(path) {
      const allAttributes = path.get("openingElement").get("attributes")
      const jsxAttributes = allAttributes.filter(
        (a): a is NodePath<JSXAttribute> => a.isJSXAttribute()
      )

      const twProp = jsxAttributes.find((a) => a.node.name.name === "tw")

      // Nothing to do
      if (!twProp) return

      const component = findParentFunction({
        ...params,
        path,
        t,
        program,
      })

      component.state.stylesIdentifier =
        component.scope.generateUid("tailwindStyles")
      component.state.useStylesIdentifier =
        component.scope.generateUid("useStyles")

      if (!component.state?.createStylesPath) {
        const createStylesPath = addCreateUseTailwindStyles({
          ...params,
          t,
          program,
          path,
          identifier: component.state.useStylesIdentifier,
        })

        component.state.createStylesPath = createStylesPath
      }

      const body = component.get("body")

      if (body.isBlockStatement()) {
        const useStyles = addUseStylesCall({
          ...params,
          t,
          program,
          path: body,
          identifier: component.state.stylesIdentifier,
          useStylesIdentifier: component.state.useStylesIdentifier,
        })

        component.state.useStylesPath = useStyles
      }

      const stylesObject = component.state.useStylesPath.get(
        "declarations.0.init.arguments.0"
      ) as NodePath<ObjectExpression>

      component.state.useStylesArgumentPath = stylesObject

      handleTwProp({ ...params, path: twProp, t, program, component })
    },
  })

  useTailwindStylesReferences.forEach((path) =>
    handleHook({ ...params, path, program, t })
  )

  program.scope.crawl()
}

export default createMacro(macro as MacroHandler)
