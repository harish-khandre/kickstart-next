import consola from "consola"
import type { PackageManager } from "./types"

export const getUserPkgManager: () => PackageManager = () => {
  // This environment variable is set by npm and yarn but pnpm seems less consistent
  const userAgent = process.env.npm_config_user_agent
  consola.error("userAgent", userAgent)

  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn"
    } else if (userAgent.startsWith("pnpm")) {
      return "pnpm"
    } else if (userAgent.startsWith("bun")) {
      return "bun"
    } else {
      return "npm"
    }
  } else {
    // If no user agent is set, assume npm
    return "npm"
  }
}
