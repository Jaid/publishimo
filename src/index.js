import path from "path"
import fs from "fs"

import writeJsonFile from "write-json-file"
import {isString, isObject} from "lodash"
import readPkg from "read-pkg"
import makeDir from "make-dir"

import generatePackage from "./generatePackage"

const getPkg = input => {
  if (isObject(input)) {
    return {
      location: null,
      pkg: input,
    }
  }
  if (isString(input)) {
    const cwdStat = fs.statSync(input)
    if (cwdStat.isFile()) {
      return {
        location: input,
        pkg: readPkg({cwd: path.dirname(input)}),
      }
    } else {
      return {
        location: path.join(input, "package.json"),
        pkg: readPkg.sync({cwd: input}),
      }
    }
  }
  const result = readPkg.sync()
  return {
    location: result.path,
    pkg: result.pkg,
  }
}

export default options => {
  options = {
    pkg: {},
    ...options,
  }
  const {pkg: sourcePkg, location: sourcePkgLocation} = getPkg(options.pkg)
  const generatedPkg = generatePackage({
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