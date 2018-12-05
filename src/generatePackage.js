import lodash from "lodash"

const githubUrl = "https://github.com"

const getAuthorObject = field => {
  if (!field) {
    return null
  }

  if (lodash.isArray(field)) {
    return field.map(entry => getAuthorObject(entry))
  }

  if (lodash.isObject(field)) {
    const author = {
      name: field.name,
      email: field.email,
      url: field.url || field.website
    }
    if (field.github) {
      if (field.github === true) { // github: true
        author.github = `${githubUrl}/${author.name.replace(" ", "")}`
      } else if (field.github.contains("/")) { // github: "https://github.com/Jaid"
        author.github = field.github
      } else {
        author.github = `${githubUrl}/${field.github}` // github: "Jaid"
      }

      if (!author.url) {
        author.url = author.github
      }
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
