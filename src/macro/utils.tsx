import { MacroError } from "babel-plugin-macros"
import parser from "@babel/parser"
import template from "@babel/template"
import { nanoid } from "nanoid/non-secure"
import type {
  JSXElement,
  JSXOpeningElement,
  JSXAttribute,
  Function,
  ObjectExpression,
  ObjectProperty,
  Expression,
  BlockStatement,
} from "@babel/types"
import type { Node, NodePath } from "@babel/core"
import type { HandlerParams } from "./types"

const SPREAD_ID = "__spread__"
const COMPUTED_ID = "__computed__"

/**
 * Generates a new pseudo-random style identifier.
 */
export function generateUniqueStyleIdentifier() {
  return nanoid(10)
}

/**
 * Returns the enclosing function (aka component) or throws if none is found.
 */
export function findParentFunction({ path, t, ...args }: HandlerParams) {
  const functionParent = path.getFunctionParent()

  if (!functionParent)
    throw new MacroError(
      `You can only use "tw" and "useTailwindStyles" inside functions and function components.`
    )

  if (!functionParent.state)
    functionParent.state = { twRules: [], hasHook: true }

  convertImmediateJSXReturnToBlockStatement({
    ...args,
    t,
    path: functionParent,
  })

  return functionParent
}

/**
 * Converts an arrow function with immediate return into a block statement with explicit return.
 */
function convertImmediateJSXReturnToBlockStatement({
  path,
  t,
}: HandlerParams<Function>) {
  const body = path.node.body

  if (!t.isBlockStatement(body)) {
    path.set("body", t.blockStatement([t.returnStatement(body)]))
  }
}

/**
 * Convert plain js into babel ast
 * Credits: https://github.com/ben-rogerson/twin.macro/blob/master/src/macroHelpers.js#L75
 */
export function astify(literal: any, t: HandlerParams["t"]): Node {
  if (literal === null) {
    return t.nullLiteral()
  }

  switch (typeof literal) {
    case "function":
      return t.unaryExpression("void", t.numericLiteral(0), true)
    case "number":
      return t.numericLiteral(literal)
    case "boolean":
      return t.booleanLiteral(literal)
    case "undefined":
      return t.unaryExpression("void", t.numericLiteral(0), true)
    case "string":
      if (literal.startsWith(COMPUTED_ID)) {
        return parser.parseExpression(literal.slice(COMPUTED_ID.length))
      }

      return t.stringLiteral(literal)
    default:
      // Assuming literal is an object

      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map((x) => astify(x, t) as any))
      }

      try {
        return t.objectExpression(
          objectExpressionElements(literal, t, "spreadElement")
        )
      } catch (_) {
        return t.objectExpression(
          objectExpressionElements(literal, t, "spreadProperty")
        )
      }
  }
}

/**
 * Credits: https://github.com/ben-rogerson/twin.macro/blob/master/src/macroHelpers.js#L54
 */
function objectExpressionElements(
  literal: any,
  t: HandlerParams["t"],
  spreadType: "spreadElement" | "spreadProperty"
): Array<ObjectProperty> {
  return Object.keys(literal)
    .filter((k) => {
      return typeof literal[k] !== "undefined"
    })
    .map((k) => {
      if (k.startsWith(SPREAD_ID)) {
        return t[spreadType](parser.parseExpression(literal[k]))
      }

      const computed = k.startsWith(COMPUTED_ID)
      const key = computed
        ? parser.parseExpression(k.slice(12))
        : t.stringLiteral(k)
      return t.objectProperty(key, astify(literal[k], t) as any, computed)
    })
}

/**
 * Adds the lib import to the top of the file. Skips if it was already added.
 */
export function addImport({ program, t, source }: HandlerParams<any>) {
  if (program.state?.didImport) return

  const identifier = program.scope.generateUid("ReactNativeTailwindMacro")

  program.unshiftContainer(
    "body",
    t.importDeclaration(
      [t.importNamespaceSpecifier(t.identifier(identifier))],
      t.stringLiteral(source + "/lib")
    )
  )

  if (!program.state) program.state = {}
  program.state.importIdentifier = identifier
  program.state.didImport = true
}

/**
 * Adds a style rule to the `createUseTailwindStyles` call.
 * @returns Generated style identifier
 */
export function addStyleRule({
  createStylesPath,
  style,
  t,
}: HandlerParams<any> & {
  createStylesPath: NodePath<Node>
  style: string
}) {
  const id = generateUniqueStyleIdentifier()

  const object = createStylesPath.get(
    "declarations.0.init.arguments.0"
  ) as NodePath<ObjectExpression>

  object.pushContainer(
    "properties",
    t.objectProperty(t.stringLiteral(id), t.stringLiteral(style))
  )

  return id
}

/**
 * Moves the translated tw prop calls to the styles prop.
 */
export function moveTwPropToStyle({
  path,
  identifier,
  component,
  t,
}: HandlerParams<JSXAttribute> & {
  component: NodePath<Function>
  identifier: string
}) {
  const jsxElement = path.parentPath as NodePath<JSXOpeningElement>

  const allAttributes = jsxElement.get("attributes")
  const jsxAttributes = allAttributes.filter((a): a is NodePath<JSXAttribute> =>
    a.isJSXAttribute()
  )

  const twPropIndex = jsxAttributes.findIndex((a) => a.node.name.name === "tw")
  const stylePropIndex = jsxAttributes.findIndex(
    (a) => a.node.name.name === "style"
  )

  const mode = twPropIndex > stylePropIndex ? "append" : "prepend"

  const twStyleExpression = t.memberExpression(
    t.identifier(component.state.stylesIdentifier),
    t.stringLiteral(identifier),
    true
  )

  if (stylePropIndex < 0) {
    /**
     * There is no style prop, simply add a new one.
     */
    path.insertBefore(
      t.jsxAttribute(
        t.jsxIdentifier("style"),
        t.jsxExpressionContainer(twStyleExpression)
      )
    )
  } else {
    /**
     * If styles is not an array, convert it into one.
     * Otherwise, simply append or prepend style identifier.
     */

    const styleProp = jsxAttributes[stylePropIndex]
    const styleExpression = styleProp.get(
      "value.expression"
    ) as NodePath<Expression>

    if (styleExpression.isArrayExpression()) {
      if (mode === "append") {
        styleExpression.pushContainer("elements", twStyleExpression)
      } else {
        styleExpression.unshiftContainer("elements", twStyleExpression)
      }
    } else {
      const literal = styleExpression.node

      styleProp.replaceWith(
        t.jsxAttribute(
          t.jsxIdentifier("style"),
          t.jsxExpressionContainer(
            t.arrayExpression(
              mode === "append"
                ? [literal, twStyleExpression]
                : [twStyleExpression, literal]
            )
          )
        )
      )
    }
  }

  // Remove tw prop
  path.remove()
}

/**
 * Adds the responsive ids to the dataSet media property.
 */
export function addResponsiveId({
  path,
  identifier,
  component,
  program,
  t,
}: HandlerParams<JSXElement> & {
  component: NodePath<Function>
  identifier: string
}) {
  const jsxElement = path.get("openingElement")

  const dataSetProp = jsxElement
    .get("attributes")
    .find(
      (a): a is NodePath<JSXAttribute> =>
        a.isJSXAttribute() && a.node.name.name === "dataSet"
    )

  const objectProperty = t.objectProperty(
    t.identifier("media"),
    t.memberExpression(
      t.memberExpression(
        t.identifier(component.state.stylesIdentifier),
        t.stringLiteral(identifier),
        true
      ),
      t.identifier("id")
    )
  )

  if (!dataSetProp) {
    jsxElement.pushContainer(
      "attributes",
      t.jsxAttribute(
        t.jsxIdentifier("dataSet"),
        t.jsxExpressionContainer(t.objectExpression([objectProperty]))
      )
    )
  } else {
    const expression = dataSetProp.get("value.expression") as NodePath<Node>

    if (!expression.isObjectExpression())
      throw new MacroError(
        "dataSet must be an inline object definition for react-native-tailwind.macro to apply responsive styles."
      )

    const mediaProperty = expression
      .get("properties")
      .find(
        (prop): prop is NodePath<ObjectProperty> =>
          prop.isObjectProperty() &&
          (prop.get("key") as NodePath<any>).node?.name === "media"
      )

    if (mediaProperty) {
      const value = mediaProperty.get("value")

      if (
        !value.isExpression() &&
        !value.isJSXNamespacedName() &&
        !value.isSpreadElement()
      )
        throw new MacroError("Cannot augment dataSet media property.")

      value.replaceWith(
        t.callExpression(
          t.memberExpression(
            t.identifier(program.state.importIdentifier),
            t.identifier("joinResponsiveIds")
          ),
          [
            value.node,
            t.memberExpression(
              t.memberExpression(
                t.identifier(component.state.stylesIdentifier),
                t.stringLiteral(identifier),
                true
              ),
              t.identifier("id")
            ),
          ]
        )
      )
    } else expression.pushContainer("properties", objectProperty)
  }
}

export function addCreateUseTailwindStyles({
  program,
  identifier,
}: HandlerParams & { identifier: string }) {
  const [createStylesPath] = program.pushContainer(
    "body",
    template("const %%useStyles%% = %%import%%.createUseTailwindStyles({})")({
      useStyles: identifier,
      import: program.state.importIdentifier,
    })
  )

  return createStylesPath
}

export function addUseStylesCall({
  path,
  identifier,
  useStylesIdentifier,
}: HandlerParams<BlockStatement> & {
  identifier: string
  useStylesIdentifier: string
}) {
  const [useStyles] = path.unshiftContainer(
    "body",
    template("const %%styles%% = %%useStyles%%()")({
      styles: identifier,
      useStyles: useStylesIdentifier,
    })
  )

  return useStyles
}
