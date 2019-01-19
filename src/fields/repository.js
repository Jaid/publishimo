import normalizeUrl from "normalize-url"
import gitInfo from "hosted-git-info"
import cleanString from "lib/cleanString"
import getGithubProfile from "lib/getGithubProfile"

import fetchRepo from "../fetchRepo"

export const prepare = async ({getAny, options}) => {
  let repoInfo
  let value = getAny()
  if (typeof value === "string") {
    repoInfo = gitInfo.fromUrl(value)
  } else if (value ?.url) {
    repoInfo = gitInfo.fromUrl(value.url)
  } else {
    const author = getAny("author")
    if (author && author.name && author.github) {
      const authorGithub = getGithubProfile(author.name, author.github)
      const projectName = getAny("name")
      if (authorGithub && projectName) {
        value = `${authorGithub |> normalizeUrl}/${projectName |> cleanString}`
        repoInfo = gitInfo.fromUrl(value)
      }
    }
  }
  const result = {
    repoInfo,
    value,
  }
  if (options.fetchGithub) {
    result.github = await fetchRepo(repoInfo.user, repoInfo.project)
  }
  return result
}

export const applyMeta = x => x.repoInfo ?.shortcut() || x.value