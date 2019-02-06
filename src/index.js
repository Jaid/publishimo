/** @module publishimo */

import path from "path"

import {isString} from "lodash"
import resolvePkgOption from "resolve-pkg-option"
import fs from "@absolunet/fsp"

import generatePackage from "./generatePackage"

/**
 * Generates a new pkg object
 * @async
 * @param {object} options
 * @returns {Promise<object>} publishimoResult
 */
export default async options => {
  options = {
    pkg: {},
    output: false,
    cache: true,
    fetchGithub: false,
    ...options,
  }
  const {pkg: sourcePkg, path: sourcePkgLocation} = await resolvePkgOption(options.pkg)
  const generatedPkg = await generatePackage({
    sourcePkg,
    sourcePkgLocation,
    options,
  })

  let outputDir
  if (isString(options.output)) {
    const exists = await fs.pathExists(options.output)
    if (exists) {
      const stat = await fs.stat(options.output)
      if (stat.isDirectory()) {
        outputDir = options.output
      } else {
        outputDir = path.dirname(options.output)
      }
    } else if (options.output.endsWith(".json")) {
      outputDir = path.dirname(options.output)
    } else {
      outputDir = options.output
    }
  }
  if (options.output === true) {
    outputDir = "dist"
  }

  const stats = {
    sourcePkg,
    generatedPkg,
    options,
  }

  if (sourcePkgLocation) {
    stats.sourcePkgLocation = sourcePkgLocation
  }

  if (outputDir) {
    const outputPath = path.join(outputDir, "package.json")
    await fs.outputJson(outputPath, generatedPkg)
    Object.assign(stats, {
      outputDir,
      outputPath,
    })
  }

  return stats
}