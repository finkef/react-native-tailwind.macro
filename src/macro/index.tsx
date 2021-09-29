import { createMacro, MacroHandler, MacroParams } from "babel-plugin-macros"
import type { NodePath } from "@babel/core"
import type { JSXAttribute, ObjectExpression } from "@babel/types"
import template from "@babel/template"
import { addImport, findParentComponent } from "./utils"
import { handleTwProp } from "./handle-tw-prop"

const macro = (params: MacroParams & { source: string }) => {
  const {
    // references,
    state,
    babel: { types: t },
  } = params

  // const { default: tw = [] } = references

  const program = state.file.path

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

      const component = findParentComponent({
        ...params,
        path,
        t,
        program,
      })

      /**
       * Imports createUseTailwindStylesHook.
       */
      addImport({ ...params, path, t, program })

      component.state.stylesIdentifier =
        component.scope.generateUid("tailwindStyles")
      component.state.useStylesIdentifier =
        component.scope.generateUid("useStyles")

      if (!component.state?.createStylesPath) {
        const [createStylesPath] = program.pushContainer(
          "body",
          template(
            "const %%useStyles%% = %%import%%.createUseTailwindStyles({})"
          )({
            useStyles: component.state.useStylesIdentifier,
            import: program.state.importIdentifier,
          })
        )

        component.state.createStylesPath = createStylesPath
      }

      const body = component.get("body")

      if (body.isBlockStatement()) {
        const [useStyles] = body.unshiftContainer(
          "body",
          template("const %%styles%% = %%useStyles%%()")({
            styles: component.state.stylesIdentifier,
            useStyles: component.state.useStylesIdentifier,
          })
        )

        component.state.useStylesPath = useStyles
      }

      const stylesObject = component.state.useStylesPath.get(
        "declarations.0.init.arguments.0"
      ) as NodePath<ObjectExpression>

      component.state.useStylesArgumentPath = stylesObject

      handleTwProp({ ...params, path: twProp, t, program, component })
    },
  })

  program.scope.crawl()
}

export default createMacro(macro as MacroHandler)
