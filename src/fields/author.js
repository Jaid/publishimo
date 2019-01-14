import collectObjects from "lib/collectObjects"
import cleanAuthor from "lib/cleanAuthor"
import getGithubProfile from "lib/getGithubProfile"
import {isString} from "lodash"

export const prepare = ({config, sourcePkg}) => {
  const authors = collectObjects([config.author, sourcePkg.author, config.authors, sourcePkg.authors, config.maintainer, sourcePkg.maintainer, config.maintainers, sourcePkg.maintainers, config.contributors, sourcePkg.contributors])
    .map(rawAuthor => {
      let author
      if (rawAuthor |> isString) {
        author = {name: rawAuthor}
      } else {
        author = {
          name: rawAuthor.name,
          email: rawAuthor.email,
          url: rawAuthor.url || rawAuthor.website,
          primary: rawAuthor.primary,
        }
      }
      if (!author.url) {
        const githubUrl = getGithubProfile(rawAuthor.name, rawAuthor.github)
        if (githubUrl) {
          author.url = githubUrl
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
    contributors,
  }
}

export const apply = ({myMeta}) => {
  if (myMeta.author) {
    return cleanAuthor(myMeta.author)
  }
}