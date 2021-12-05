import resolveConfig from "tailwindcss/resolveConfig"
import fs from "fs"

export const resolveTailwindConfig = (filePath: string | undefined | null) => {
  const config =
    filePath && fs.existsSync(filePath)
      ? require(filePath)
      : { theme: {}, darkMode: "media" }

  return resolveConfig(config)
}
