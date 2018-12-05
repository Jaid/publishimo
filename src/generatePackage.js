import lodash from "lodash"

const getAuthorObject = field => {
  if (!field) {
    return null
  }

  if (lodash.isArray(field)) {
    return field.map(entry => getAuthorObject(entry))
  }

  if (lodash.isObject(field)) {
    const author = {
      name: field.name
    }
    if (field.email) {
      author.email = field.email
    }

    return author
  }

  if (lodash.isString(field)) {
    const author = parseAuthor(field)
    if (lodash.isEmpty(author)) {
      return null
    } else {
      return author
    }
  }
}

export default (rawPackage, rawConfig) => {
  const config = {}
  console.log(rawConfig)
  config.name = rawConfig.name || rawPackage.name
  config.version = rawPackage.version || "0.0.0"
  config.description = rawConfig.description || rawPackage.description
  config.dependencies = rawConfig.dependencies || rawPackage.dependencies
  config.license = rawConfig.license || rawPackage.license || "UNLICENSED" // https://docs.npmjs.com/files/package.json#license

  const authors = []

  const possibleAuthorFields = [rawConfig.author, rawPackage.author, rawConfig.authors, rawPackage.authors, rawConfig.maintainer, rawPackage.maintainer, rawConfig.maintainers, rawPackage.maintainers, rawConfig.contributors, rawPackage.contributors]
  for (const field of possibleAuthorFields) {
    const author = getAuthorObject(field)
    if (!author) {
      continue
    }

    if (lodash.isObject(author)) {
      authors.push(author)
    } else if (lodash.isArray(author)) {
      Array.prototype.push.apply(authors, author)
    }
  }

  // config.author = rawConfig.author || rawPackage.author


  console.log({
    config,
    authors
  })
}
