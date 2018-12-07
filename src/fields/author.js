import collectObjects from "lib/collectObjects"
import cleanAuthor from "lib/cleanAuthor"

const githubUrl = "https://github.com"

export const prepare = ({rawConfig, rawPackage}) => {
  const authors = collectObjects([rawConfig.author, rawPackage.author, rawConfig.authors, rawPackage.authors, rawConfig.maintainer, rawPackage.maintainer, rawConfig.maintainers, rawPackage.maintainers, rawConfig.contributors, rawPackage.contributors])
    .map(rawAuthor => {
      const author = {
        name: rawAuthor.name,
        email: rawAuthor.email,
        url: rawAuthor.url || rawAuthor.website,
        primary: rawAuthor.primary
      }
      if (rawAuthor.github) {
        if (rawAuthor.github === true) { // github: true
          author.github = `${githubUrl}/${author.name.replace(" ", "")}`
        } else if (rawAuthor.github.contains("/")) { // github: "https://github.com/Jaid"
          author.github = rawAuthor.github
        } else {
          author.github = `${githubUrl}/${rawAuthor.github}` // github: "Jaid"
        }

        if (!author.url) {
          author.url = author.github
        }
      }

      return author
    })

  let author; let contributors
  if (authors.length) {
    const authorIndex = authors.findIndex(e => e.primary)
    if (authorIndex >= 0) {
      author = authors[authorIndex]
      authors.splice(authorIndex, 1)
    } else {
      author = authors.shift()
    }

    if (authors.length) {
      contributors = authors
    }
  }

  return {
    author,
    contributors
  }
}

export const apply = ({myMeta}) => {
  if (myMeta.author) {
    return cleanAuthor(myMeta.author)
  }
}
