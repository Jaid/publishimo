import path from "path"
import fs from "fs"

import writeJsonFile from "write-json-file"
import {isString, isObject} from "lodash"
import readPackageJson from "read-package-json"
import readPkgUp from "read-pkg-up"
import readPkg from "read-pkg"
import makeDir from "make-dir"

import generatePackage from "./generatePackage"

const getPkg = input => {
  console.log(input)
  if (isObject(input)) {
    return input
  }
  if (isString(input)) {
    const cwdStat = fs.statSync(input)
    if (cwdStat.isFile()) {
      return readPackageJson(input)
    } else {
      return readPkg.sync({
        cwd: input,
      })
    }
  }
  if (input === false) {
    return {}
  }
  return readPkgUp.sync()
}

export default options => {
  const sourcePkg = getPkg(options.pkg)
  const generatedPkg = generatePackage(sourcePkg, options.config)

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