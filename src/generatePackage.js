import {reduce, isNil, isFunction} from "lodash"

export default (rawPackage, rawConfig) => {
  const config = {}
  const configMeta = {}

  const fields = [
    "name",
    "version",
    "description",
    "author",
    "os",
    "cpu",
    "engines",
    "repository",
    "contributors",
    "dependencies",
    "peerDependencies",
    "optionalDependencies",
    "bundledDependencies",
    "license",
    "keywords",
    "homepage"
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
      getAny: () => rawConfig[field] || rawPackage[field]
    })
    if (!isNil(result)) {
      configMeta[field] = result
    }
  }

  for (const [field, processor] of Object.entries(processors)) {
    let result
    if (processor.applyMeta) {
      const metaValue = configMeta[field]
      if (isFunction(process.applyMeta) && !isNil(metaValue)) {
        result = metaValue |> applyMeta
      } else {
        result = metaValue
      }
    } else {
      result = processor.apply({
        configMeta,
        rawConfig,
        rawPackage,
        myMeta: configMeta[field],
        getAny: () => rawConfig[field] || rawPackage[field]
      })
    }
    if (!isNil(result)) {
      config[field] = result
    }
  }

  return config
}
