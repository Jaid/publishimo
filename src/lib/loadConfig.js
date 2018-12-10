import cosmiconfig from "cosmiconfig"
import ExConfig from "ex-config"
import readPkgUp from "read-pkg-up"
import {isString} from "lodash"

const name = "publishimo"

// cwd
// config
// package
export default options => {
  const pkg = readPkgUp.sync({cwd: options.cwd})?.pkg || {}

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
  const explorer = cosmiconfig(name, {
    searchPlaces,
    cwd: options.cwd
  })

  let config
  if (options.config) {
    config = explorer.loadSync(options.config)?.config
  } else if (pkg[name] |> isString) {
    config = explorer.loadSync(pkg[name])?.config
  } else {
    config = explorer.searchSync()?.config
  }

  const completeConfig = exConfig.load(config || {})

  return {
    pkg,
    config: completeConfig
  }
}
