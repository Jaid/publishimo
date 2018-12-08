import {reduce, isNil, isFunction} from "lodash"

export default (rawPackage, rawConfig) => {
  const config = {}
  const configMeta = {}

  const fields = [
    "name",
    "version",
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
    "keywords"
  ]

  const processors = reduce(fields, (object, field) => {
    object[field] = require(`./fields/${field}`)
    return object
  }, {})

  /*
   * Runs "prepare" first on every processor, so all processors can use each others meta data without being dependent on execution order
   * The existence of a "prepare" function is optional, hence the weird looking optional chaining syntax
   */
  for (const [field, processor] of Object.entries(processors)) {
    const result = processor.prepare?.({
      rawConfig,
      rawPackage,
      getAny: (key = field) => rawConfig[key] || rawPackage[key]
    })
    if (!isNil(result)) {
      configMeta[field] = result
    }
  }

  for (const [field, processor] of Object.entries(processors)) {
    let result
    if (processor.applyMeta) {
      const metaValue = configMeta[field]
      if (!isNil(metaValue)) {
        if (isFunction(processor.applyMeta)) {
          result = metaValue |> processor.applyMeta
        } else {
          result = metaValue
        }
      }
    } else {
      result = processor.apply({
        configMeta,
        rawConfig,
        rawPackage,
        myMeta: configMeta[field],
        getAny: (key = field) => rawConfig[key] || rawPackage[key]
      })
    }
    if (!isNil(result)) {
      config[field] = result
    }
  }

  return config
}
