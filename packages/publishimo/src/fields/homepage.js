import cleanUrl from "lib/cleanUrl"

export const prepare = ({getAny}) => getAny()
export const apply = ({myMeta, configMeta}) => {
  if (myMeta) {
    return myMeta | cleanUrl
  }
  const repoInfo = configMeta.repository?.repoInfo
  if (repoInfo) {
    return repoInfo.browse() |> cleanUrl
  }
}
