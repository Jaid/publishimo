import cleanUrl from "lib/cleanUrl"

export const prepare = ({getAny}) => getAny()
export const apply = ({myMeta, meta}) => {
  if (myMeta) {
    return myMeta | cleanUrl
  }
  const repoInfo = meta.repository ?.repoInfo
  if (repoInfo) {
    return `${repoInfo.browse()}#readme` |> cleanUrl
  }
}