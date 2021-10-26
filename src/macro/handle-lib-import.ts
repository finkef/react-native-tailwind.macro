import type { Node } from "@babel/core"
import { MacroError } from "babel-plugin-macros"
import type { HandlerParams } from "./types"

export function handleLibImport(params: HandlerParams<Node>) {
  const { path, program, t } = params

  const importNode = path.get("name")

  if (Array.isArray(importNode))
    throw new MacroError(
      `Invalid import "[${importNode.map(({ node }) => node).join(", ")}]"`
    )

  const importName = importNode.node

  if (typeof importName !== "string")
    throw new MacroError(`Invalid import "${importName}"`)

  // Replace with imported version
  path.replaceWith(
    t.memberExpression(
      t.identifier(program.state.importIdentifier),
      t.identifier(importName)
    )
  )
}
