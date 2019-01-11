import normalizeUrl from "normalize-url"
import gitInfo from "hosted-git-info"
import cleanString from "lib/cleanString"
import getGithubProfile from "lib/getGithubProfile"

export const prepare = ({getAny}) => {
  const value = getAny()
  if (value) {
    return {value}
  } else {
    const author = getAny("author")
    if (!author || !author.name || !author.github) {
      return
    }
    const authorGithub = getGithubProfile(author.name, author.github)
    const projectName = getAny("name")
    if (authorGithub && projectName) {
      const url = `${authorGithub |> normalizeUrl}/${projectName |> cleanString}`
      const repoInfo = gitInfo.fromUrl(url)
      return {
        repoInfo,
        value: repoInfo.shortcut()
      }
    }
  }
}

export const applyMeta = x => x.value
