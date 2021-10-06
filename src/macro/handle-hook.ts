import { MacroError } from "babel-plugin-macros"
import type { NodePath, Node } from "@babel/core"
import type { TemplateElement } from "@babel/types"
import type { HandlerParams } from "./types"
import {
  addCreateUseTailwindStyles,
  addStyleRule,
  addUseStylesCall,
  findParentFunction,
} from "./utils"

export function handleHook(params: HandlerParams<Node>) {
  const { path, program, t } = params

  const parent = path.parentPath

  if (!parent?.isCallExpression())
    throw new MacroError(
      `useTailwindStyles can only be used as a function call.`
    )

  // Replace with imported version
  path.replaceWith(
    t.memberExpression(
      t.identifier(program.state.importIdentifier),
      t.identifier("useTailwindStyles")
    )
  )

  const args = parent.get("arguments")

  const arrowFunc = args[0]

  if (!arrowFunc || !arrowFunc.isArrowFunctionExpression())
    throw new MacroError(
      `useTailwindStyles expects an inline arrow function as first argument.`
    )

  const tw = arrowFunc.get("params.0") as NodePath<Node>

  if (!tw?.isIdentifier())
    throw new MacroError(
      `useTailwindStyles' arrow function expects a non-spread first argument.`
    )

  const references =
    arrowFunc.scope.getBinding(tw.node.name)?.referencePaths ?? []

  if (!references.length) return

  const useStylesIdentifier = program.scope.generateUid("useStyles")
  const createStylesPath = addCreateUseTailwindStyles({
    ...params,
    identifier: useStylesIdentifier,
  })

  // Find the surrounding function and convert body to block statement if necessary.
  const parentFunction = findParentFunction({ ...params, path })
  const body = parentFunction.get("body")

  // Won't happen
  if (!body.isBlockStatement())
    throw new MacroError(
      "Expected surrounding function to contain block statement."
    )

  const stylesIdentifier = body.scope.generateUid("styles")
  addUseStylesCall({
    ...params,
    path: body,
    identifier: stylesIdentifier,
    useStylesIdentifier,
  })

  // Add styles to dependency array
  if (args.length < 2) {
    arrowFunc.insertAfter(t.arrayExpression([t.identifier(stylesIdentifier)]))
  } else {
    const deps = args[1]

    if (!deps.isArrayExpression())
      throw new MacroError(
        `useTailwindStyles expects an inline array expression of dependencies as second argument.`
      )

    deps.unshiftContainer("elements", t.identifier(stylesIdentifier))
  }

  /* eslint-disable-next-line no-shadow */
  references.forEach((path) => {
    const taggedTemplate = path.parentPath

    if (!taggedTemplate?.isTaggedTemplateExpression())
      throw new MacroError(
        "tw can only be used as template literals like tw`px-8`."
      )

    const quasis = taggedTemplate.get(
      "quasi.quasis"
    ) as NodePath<TemplateElement>[]

    if (quasis.length !== 1)
      throw new MacroError(
        `tw can only accept a static string, it does not support interpolated expressions.`
      )

    const style = quasis[0]!.node.value.raw

    const styleIdentifier = addStyleRule({ ...params, style, createStylesPath })

    taggedTemplate.replaceWith(
      t.memberExpression(
        t.identifier(stylesIdentifier),
        t.stringLiteral(styleIdentifier),
        true
      )
    )
  })
}
