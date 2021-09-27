import { MacroError } from "babel-plugin-macros"
import { addResponsiveId, addStyleRule, moveTwPropToStyle } from "./utils"
import type { NodePath } from "@babel/core"
import type { Function, JSXAttribute, JSXElement } from "@babel/types"
import type { HandlerParams } from "./types"

export function handleTwProp(
  params: HandlerParams<JSXAttribute> & {
    component: NodePath<Function>
  }
) {
  const { path } = params

  if (path.node.name.name !== "tw") return

  const nodeValue = path.get("value")

  if (!nodeValue.isStringLiteral())
    throw new MacroError(
      `Only plain strings can be used with the "tw" prop. TODO: Add suggestions.`
    )

  const styleIdentifier = addStyleRule({
    ...params,
    style: nodeValue.node.value,
  })

  moveTwPropToStyle({
    ...params,
    identifier: styleIdentifier,
  })

  addResponsiveId({
    ...params,
    path: path.parentPath.parentPath as NodePath<JSXElement>,
    identifier: styleIdentifier,
  })
}
