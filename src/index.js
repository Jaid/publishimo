/** @module publishimo */

import path from "path"

import {isString} from "lodash"
import resolvePkgOption from "resolve-pkg-option"
import fs from "@absolunet/fsp"

import generatePackage from "./generatePackage"

const debug = require("debug")("publishimo")

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
    cacheSeconds: 8 * 60 * 60, // 8 hours
    fetchGithub: false,
    json5: false,
    ...options,
  }
  debug(`Starting with options ${JSON.stringify(options)}`)
  const {pkg: sourcePkg, path: sourcePkgLocation} = await resolvePkgOption(options.pkg)
  debug(`Resolved pkg data ${JSON.stringify({
    sourcePkgLocation,
    sourcePkg,
  })}`)
  const generatedPkg = await generatePackage({
    sourcePkg,
    sourcePkgLocation,
    options,
  })
  debug(`Generated ${JSON.stringify(generatedPkg)}`)

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
    debug(`Saving data as ${outputPath}`)
    await (options.json5 ? fs.outputJson5 : fs.outputJson)(outputPath, generatedPkg)
    Object.assign(stats, {
      outputDir,
      outputPath,
    })
  }

  return stats
}