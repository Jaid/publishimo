import cleanUrl from "lib/cleanUrl"

export const prepare = ({getAny}) => getAny()
export const apply = ({myMeta, configMeta}) => {
  if (myMeta) {
    return myMeta
  }
  const repoInfo = configMeta.repository?.repoInfo
  if (repoInfo) {
    return repoInfo.bugs() |> cleanUrl
  }
}
