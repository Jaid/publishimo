import generatePackage from "./generatePackage"
import loadConfig from "lib/loadConfig"
import {defaults} from "lodash"

export default options => {
  options = defaults(options, {
    cwd: process.cwd(),
    config: null
  })
  const {pkg, config} = loadConfig(options)
  const generatedPackage = generatePackage(pkg, config)
  console.log(generatedPackage)
}
