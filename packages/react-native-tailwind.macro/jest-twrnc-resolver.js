/**
 * Currently, jest doesn't support the `exports` fields in package.json that twrnc relies on.
 * If the required module is twrnc/create, resolve the actual cjs path.
 *
 * Note: This is not ideal, but works for now until `exports` is supported in Jest 28.
 */
module.exports = (request, options) => {
  if (request === "twrnc/create")
    return options.defaultResolver("twrnc/dist/cjs/create.js", options)
  else return options.defaultResolver(request, options)
}
