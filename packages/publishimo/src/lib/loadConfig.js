import cosmiconfig from "cosmiconfig"
import ExConfig from "ex-config"
import readPkgUp from "read-pkg-up"
import {isString} from "lodash"
import path from "path"

const name = "publishimo"

// cwd
// config
// package
export default options => {
  const loadedPkg = readPkgUp.sync({cwd: options.cwd})
  const pkg = loadedPkg?.pkg || {}
  const pkgPath = loadedPkg?.path

  const exConfig = new ExConfig

  const searchPlaces = [
    "package.json",
    `.${name}rc`,
    `.${name}rc.js`,
    `${name}.config.js`,
    `${name}.json`,
    `.${name}.json`,
    `${name}.yaml`,
    `${name}.yml`,
    `.${name}.yaml`,
    `.${name}.yml`
  ]
  // const explorer = cosmiconfig(name, {searchPlaces})
  const explorer = cosmiconfig(name, {searchPlaces})

  let loadedConfig

  if (options.config) {
    loadedConfig = explorer.loadSync(options.config)
  } else if (pkg[name] |> isString) {
    loadedConfig = explorer.loadSync(path.resolve(options.cwd, pkg[name]))
  } else {
    loadedConfig = explorer.searchSync(options.cwd)
  }

  const config = exConfig.load(loadedConfig?.config || {})
  const configPath = loadedConfig?.filepath

  return {
    pkg,
    pkgPath,
    config,
    configPath
  }
}
