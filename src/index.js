/** @module publishimo */

import path from "path"
import fs from "fs"

import writeJsonFile from "write-json-file"
import {isString} from "lodash"
import makeDir from "make-dir"
import resolvePkgOption from "resolve-pkg-option"

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
    if (fs.existsSync()) {
      const stat = fs.statSync(options.output)
      if (stat.isFile()) {
        outputDir = path.dirname(options.output)
      } else {
        outputDir = options.output
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
    makeDir.sync(outputDir)
    const outputPath = path.join(outputDir, "package.json")
    writeJsonFile.sync(outputPath, generatedPkg)
    Object.assign(stats, {
      outputDir,
      outputPath,
    })
  }

  return stats
}