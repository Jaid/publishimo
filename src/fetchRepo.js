import ghGot from "gh-got"
import {pick} from "lodash"

export default async (owner, repo) => {
  const {body, rateLimit} = await ghGot(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      accept: "application/vnd.github.mercy-preview+json",
    },
  })
  return {
    rateLimit,
    ...pick(body, ["topics", "description", "license"]),
  }
}