/** @module publishimo */

/**
 * @typedef options
 * @type {object}
 * @property {object|string} [pkg={}] Path to a package.json or pkg data
 * @property {string} [output=false] If typeof `string`, this will be the path where the generated package.json is saved to
 * @property {boolean|string} [fetchGithub=false] If `true`, generated pkg data will be enhanced by information fetched from the GitHub repository using `process.env.GITHUB_TOKEN` to make GitHub API calls. If typeof `string`, this will be used as GitHub token.
 * @property {Number|false} [cacheSeconds=28800] If typeof `number`, the data fetched from GitHub expires after that much seconds.
 * @property {boolean} [json5=false] If `true`, `json5.stringify` will be used as output format. If `false`, `JSON.stringify` will be used.
 * @property {string[]} [includeFields=[]] Field names that should forcefully be forwarded from `options.pkg` to generated pkg. For example, use `includeFields: ["babel"]` to include your Babel config in your output package.
 * @property {string[]} [excludeFields=[]] Fields names that are never written to generated pkg.
 */

/**
 * @typedef result
 * @type {object}
 * @property {object} sourcePkg Source pkg data
 * @property {object} generatedPkg Generated pkg data
 * @property {object} options Options used for processing
 * @property {string} [sourcePkgLocation] If `options.pkg` is typeof `string`, this will be the path where the source pkg data got loaded from
 * @property {string} [outputDir] If `options.output` is given, this will be the directory where the generated package.json got saved to
 * @property {string} [outputPath] If `options.output` is given, this will be the path (including filename) where the generated package.json got saved to
 */

import path from "path"

import {isString} from "lodash"
import resolvePkgOption from "resolve-pkg-option"
import fs from "@absolunet/fsp"

import generatePackage from "./generatePackage"

const debug = require("debug")("publishimo")

/**
 * Generates a better package.json object
 * @async
 * @function default
 * @param {options} options
 * @returns {Promise<result>} Result object
 */
export default async options => {
  options = {
    pkg: {},
    output: false,
    cacheSeconds: 8 * 60 * 60, // 8 hours
    fetchGithub: false,
    json5: false,
    includeFields: [],
    excludeFields: [],
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