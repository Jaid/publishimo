import {isNil, isFunction, omit, omitBy} from "lodash"
import sortKeys from "sort-keys"
import arrayToObjectKeys, {parallel} from "array-to-object-keys"

import resolveAny from "./resolveAny"

export default async ({sourcePkg = {}, sourcePkgLocation, options}) => {
  const fields = [
    "name",
    "version",
    "main",
    "types",
    "bin",
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

  const generatedPkg = await parallel(fields, async field => {
    const processor = processors[field]
    if (processor.applyMeta) {
      const metaValue = meta[field]
      if (!isNil(metaValue)) {
        if (isFunction(processor.applyMeta)) {
          return processor.applyMeta(metaValue)
        } else {
          return metaValue
        }
      }
    } else if (processor.apply) {
      return resolveAny(processor.apply, {
        meta,
        myMeta: meta[field],
        options,
        sourcePkg,
        sourcePkgLocation,
        getAny: (key = field) => options[key] || sourcePkg[key],
      })
    }
  })

  const addIncludes = pkg => {
    for (const key of options.includeFields) {
      pkg[key] = sourcePkg[key] || options[key]
    }
    return pkg
  }

  const cleanedPkg = generatedPkg
  |> omit(#, options.excludeFields)
  |> addIncludes
  |> omitBy(#, isNil)
  |> sortKeys

  return cleanedPkg
}