import path from "path"

import fs from "fs-extra"
import normalizeUrl from "normalize-url"
import gitInfo from "hosted-git-info"
import cleanString from "lib/cleanString"
import getGithubProfile from "lib/getGithubProfile"
import {isString, pick} from "lodash"
import appCacheDir from "app-cache-dir"
import ghGot from "gh-got"
import makeDir from "make-dir"

const fetchRepo = async (owner, repo, cache = true) => {
  const cacheDir = path.join(appCacheDir("publishimo"), "github", owner, repo)
  const cacheFile = path.join(cacheDir, "info.json")
  if (cache) {
    if (fs.existsSync(cacheFile)) {
      return {
        cacheFile,
        ...fs.readJsonSync(cacheFile),
      }
    }
  }
  if (!isString(process.env?.GITHUB_TOKEN)) {
    throw new Error(`process.env.GITHUB_TOKEN is not set, I can't fetch info of GitHub repository ${owner}/${repo}!`)
  }
  const {body, rateLimit} = await ghGot(`repos/${owner}/${repo}`, {
    headers: {
      accept: "application/vnd.github.mercy-preview+json",
    },
  })
  const info = pick(body, ["topics", "description", "license", "homepage"])
  if (cache) {
    await makeDir(cacheDir)
    fs.writeJsonSync(cacheFile, info)
    info.cacheFile = cacheFile
  }
  return {
    rateLimit,
    ...info,
  }
}

const normalizeAuthorGithub = url => normalizeUrl(url, {
  defaultProtocol: "https:",
  stripHash: true,
  forceHttps: true,
})

export const prepare = async ({getAny, options, sourcePkgLocation}) => {
  let repoInfo
  let value = getAny()
  if (typeof value === "string") {
    repoInfo = gitInfo.fromUrl(value)
  } else if (value?.url) {
    repoInfo = gitInfo.fromUrl(value.url)
  } else {
    const author = getAny("author")
    let projectName = getAny("name")
    if (!projectName && isString(sourcePkgLocation)) {
      projectName = sourcePkgLocation |> path.dirname |> path.basename |> cleanString
    }
    if (author && projectName) {
      if (author.name && author.github) {
        const authorGithub = getGithubProfile(author.name, author.github)
        if (authorGithub && projectName) {
          value = `${authorGithub |> normalizeAuthorGithub}/${projectName |> cleanString}`
          repoInfo = gitInfo.fromUrl(value)
        }
      }
      if (author?.url?.includes("github.com/")) {
        console.log(author.url)
        value = `${author.url |> normalizeAuthorGithub}/${projectName |> cleanString}`
        repoInfo = gitInfo.fromUrl(value)
      }
    }
  }
  const result = {
    repoInfo,
    value,
  }
  if (options.fetchGithub && repoInfo) {
    result.github = await fetchRepo(repoInfo.user, repoInfo.project, options.cache)
  }
  return result
}

export const applyMeta = x => x.repoInfo?.shortcut() || x.value