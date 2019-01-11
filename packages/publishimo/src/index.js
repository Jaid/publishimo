import fs from "fs"
import path from "path"

import {defaults, isUndefined} from "lodash"
import loadConfig from "lib/loadConfig"

import generatePackage from "./generatePackage"

export default options => {
  options = defaults(options, {
    cwd: process.cwd(),
    config: null,
    entry: "index.js",
  })

  if (isUndefined(options.releaseDir)) {
    options.releaseDir = path.resolve(options.cwd, "release")
  }

  const cwdStat = fs.statSync(options.cwd)
  if (cwdStat.isFile()) {
    options.cwd = options.cwd |> path.dirname
  }
  const {pkg, pkgPath, config, configPath} = loadConfig(options)
  const generatedPackage = generatePackage(options.cwd, pkg, config)

  if (!fs.existsSync(options.releaseDir)) {
    fs.mkdirSync(options.releaseDir, {recursive: true})
  }
  fs.writeFileSync(path.resolve(options.releaseDir, "package.json"), JSON.stringify(generatedPackage))

  return {
    generatedPackage,
    pkg,
    pkgPath,
    config,
    configPath,
    outputDir: options.releaseDir,
    cwd: options.cwd,
  }
}