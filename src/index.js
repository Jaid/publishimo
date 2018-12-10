import generatePackage from "./generatePackage"
import loadConfig from "lib/loadConfig"
import {defaults, isUndefined} from "lodash"
import fs from "fs"
import path from "path"

export default options => {
  options = defaults(options, {
    cwd: process.cwd(),
    config: null,
    entry: "index.js"
  })

  if (isUndefined(options.releaseDir)) {
    options.releaseDir = path.resolve(options.cwd, "release")
  }

  const cwdStat = fs.statSync(options.cwd)
  if (cwdStat.isFile()) {
    options.cwd = options.cwd |> path.dirname
  }
  const {pkg, config} = loadConfig(options)
  const generatedPackage = generatePackage(options.cwd, pkg, config)

  if (!fs.existsSync(options.releaseDir)) {
    fs.mkdirSync(options.releaseDir)
  }
  fs.writeFileSync(path.resolve(options.releaseDir, "package.json"), JSON.stringify(generatedPackage))
}
