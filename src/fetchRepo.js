import path from "path"

import ghGot from "gh-got"
import {pick} from "lodash"
import appCacheDir from "app-cache-dir"
import fs from "fs-extra"
import makeDir from "make-dir"

export default async (owner, repo, cache = true) => {
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
  const {body, rateLimit} = await ghGot(`https://api.github.com/repos/${owner}/${repo}`, {
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