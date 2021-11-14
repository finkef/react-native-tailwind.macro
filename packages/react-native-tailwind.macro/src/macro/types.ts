import type { NodePath, Node } from "@babel/core"
import type { Program } from "@babel/types"
import type { MacroParams } from "babel-plugin-macros"

export interface HandlerParams<T = Node>
  extends Omit<MacroParams & { source: string }, "babel"> {
  t: MacroParams["babel"]["types"]
  path: NodePath<T>
  program: NodePath<Program>
}
