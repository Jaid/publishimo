import cosmiconfig from "cosmiconfig"
import ExConfig from "ex-config"
import readPkgUp from "read-pkg-up"
import {isString} from "lodash"

const name = "publishimo"

// cwd
// config
// package
export default options => {
  const pkg = readPkgUp.sync({cwd: options.cwd})?.pkg
  if (!pkg) {
    throw Error("Could not find package.json")
  }

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

  if (!config) {
    // const humanizedSearchPlaces = searchPlaces.map((place, i) => i ? place : `package.json ("${name}" key)`).join(", ")
    // throw Error(`Could not find a valid ${name} configuration. Looked for files named: ${humanizedSearchPlaces}`)
  }

  const completeConfig = exConfig.load(config || {})

  return {
    pkg,
    config: completeConfig
  }
}
