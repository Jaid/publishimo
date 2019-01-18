import {isNil, isFunction} from "lodash"
import sortKeys from "sort-keys"

import arrayToObjectKeys from "./arrayToObjectKeys"

export default ({sourcePkg = {}, sourcePkgLocation, config = {}}) => {
  const generatedPkg = {}
  const meta = {}

  const fields = [
    "name",
    "version",
    "main",
    "description",
    "author",
    "license",
    "os",
    "cpu",
    "engines",
    "repository",
    "homepage",
    "bugs",
    "contributors",
    "dependencies",
    "peerDependencies",
    "bundleDependencies",
    "optionalDependencies",
    "keywords",
  ]

  const processors = arrayToObjectKeys(fields, field => require(`./fields/${field}`))

  /*
   * Runs "prepare" first on every processor, so all processors can use each others meta data without being dependent on execution order
   * The existence of a "prepare" function is optional, hence the weird looking optional chaining syntax
   */
  for (const [field, processor] of Object.entries(processors)) {
    const result = processor.prepare ?.({
      config,
      sourcePkg,
      sourcePkgLocation,
      getAny: (key = field) => config[key] || sourcePkg[key],
    })
    if (!isNil(result)) {
      meta[field] = result
    }
  }

  for (const [field, processor] of Object.entries(processors)) {
    let result
    if (processor.applyMeta) {
      const metaValue = meta[field]
      if (!isNil(metaValue)) {
        if (isFunction(processor.applyMeta)) {
          result = metaValue |> processor.applyMeta
        } else {
          result = metaValue
        }
      }
    } else {
      result = processor.apply({
        meta,
        config,
        sourcePkg,
        sourcePkgLocation,
        myMeta: meta[field],
        getAny: (key = field) => config[key] || sourcePkg[key],
      })
    }
    if (!isNil(result)) {
      generatedPkg[field] = result
    }
  }

  return generatedPkg |> sortKeys
}