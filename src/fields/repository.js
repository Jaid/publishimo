import path from "path"

import fs from "@absolunet/fsp"
import normalizeUrl from "normalize-url"
import gitInfo from "hosted-git-info"
import cleanString from "lib/cleanString"
import getGithubProfile from "lib/getGithubProfile"
import {isString, pick} from "lodash"
import appCacheDir from "app-cache-dir"
import ghGot from "gh-got"
import epochSeconds from "epoch-seconds"

const apiDomain = "api.github.com"

const fetchRepo = async (owner, repo, cacheSeconds = 0, token = process.env.GITHUB_TOKEN) => {
  const cacheDir = path.join(appCacheDir("publishimo"), "github", owner, repo)
  const cacheFile = path.join(cacheDir, "fetch.json5")
  if (cacheSeconds) {
    const exists = await fs.pathExists(cacheFile)
    if (exists) {
      const cacheData = await fs.readJson5(cacheFile)
      const now = epochSeconds()
      const difference = now - cacheData.fetch.timestamp
      if (difference < cacheSeconds) {
        return {
          cacheDir,
          cacheFile,
          ...cacheData,
        }
      }
    }
  }
  const apiPath = `repos/${owner}/${repo}`
  if (!token) {
    throw new Error(`options.fetchGithub="token" and process.env.GITHUB_TOKEN are not set, I can't fetch info of ${apiPath} on domain ${apiDomain}`)
  }
  const {body, rateLimit} = await ghGot(apiPath, {
    token,
    json: true,
    headers: {
      accept: "application/vnd.github.mercy-preview+json",
    },
  })
  const info = {
    fetch: {
      domain: apiDomain,
      path: apiPath,
      timestamp: epochSeconds(),
    },
    data: pick(body, ["topics", "description", "license", "homepage"]),
  }
  if (cacheSeconds) {
    await fs.outputJson5(cacheFile, info)
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
    result.github = await fetchRepo(repoInfo.user, repoInfo.project, options.cacheSeconds, typeof options.fetchGithub === "string" ? options.fetchGithub : undefined)
  }
  return result
}

export const applyMeta = x => x.repoInfo?.shortcut() || x.value