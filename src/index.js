import cosmiconfig from "cosmiconfig"
import ExConfig from "ex-config"
import readPkgUp from "read-pkg-up"
import humanizeList from "humanize-list"
import generatePackage from "./generatePackage"
import searchPlaces from "./searchPlaces?aot"

const name = "publishimo"

export default () => {
  const exConfig = new ExConfig
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

  const rawExConfig = exConfig.load(rawConfig.config)
  console.log(rawConfig)
  console.log(rawExConfig)
  return

  const generatedPackage = generatePackage(rawPackage.pkg, rawConfig.config)
  console.log(generatedPackage)
}
