import cosmiconfig from "cosmiconfig"
import readPkgUp from "read-pkg-up"
import humanizeList from "humanize-list"
import generatePackage from "./generatePackage"
import searchPlaces from "./searchPlaces?aot"

const name = "publishimo"

export default () => {
  const explorer = cosmiconfig(name, {searchPlaces})

  const rawPackage = readPkgUp.sync()
  if (!rawPackage?.pkg) {
    throw Error("Could not find package.json")
  }

  const rawConfig = explorer.searchSync()
  if (!rawConfig?.config) {
    const humanizedSearchPlaces = humanizeList(searchPlaces.map((place, i) => i ? place : `package.json ("${name}" key)`))
    throw Error(`Could not find a valid ${name} configuration. Looked for files named: ${humanizedSearchPlaces}`)
  }

  generatePackage(rawPackage.pkg, rawConfig.config)
}

/*
 * if (!rawConfig) {
 * }
 *
 * console.log(rawConfig)
 *
 * config = generateConfig(rawConfig)
 */
