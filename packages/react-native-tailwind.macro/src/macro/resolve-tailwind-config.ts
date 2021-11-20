import resolveConfig from "tailwindcss/resolveConfig"
import path from "path"
import fs from "fs"

const findConfigFilePath = (currentDir: string): string | null => {
  const files = fs.readdirSync(currentDir)

  const configFile = files.find((file) => file === "tailwind.config.js")

  if (configFile) return path.resolve(currentDir, configFile)

  // Check if package.json exists on this level, in which case we conclude that there is no config file
  const packageJson = files.find((file) => file === "package.json")
  if (packageJson) return null

  // Otherwise, recursively move upwards
  return findConfigFilePath(path.resolve(currentDir, ".."))
}

export const resolveTailwindConfig = (filePath: string | undefined | null) => {
  if (!filePath) return resolveConfig({ theme: {}, darkMode: "media" })

  const configFilePath = fs.lstatSync(filePath).isDirectory()
    ? findConfigFilePath(filePath)
    : findConfigFilePath(path.dirname(filePath))

  const config = configFilePath
    ? require(configFilePath)
    : { theme: {}, darkMode: "media" }

  return resolveConfig(config)
}
