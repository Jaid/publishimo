import {isNil, isFunction} from "lodash"
import sortKeys from "sort-keys"
import arrayToObjectKeys from "array-to-object-keys"

import resolveAny from "./resolveAny"

export default async ({sourcePkg = {}, sourcePkgLocation, options}) => {
  const generatedPkg = {}

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
  const metaGeneratorJobs = Object.entries(processors).map(([field, processor]) => resolveAny(processor.prepare, {
    options,
    sourcePkg,
    sourcePkgLocation,
    getAny: (key = field) => options[key] || sourcePkg[key],
  }))
  const results = await Promise.all(metaGeneratorJobs)
  const meta = arrayToObjectKeys(Object.keys(processors), (key, index) => results[index])

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
        myMeta: meta[field],
        options,
        sourcePkg,
        sourcePkgLocation,
        getAny: (key = field) => options[key] || sourcePkg[key],
      })
    }
    if (!isNil(result)) {
      generatedPkg[field] = result
    }
  }
  debugger
  return generatedPkg |> sortKeys
}