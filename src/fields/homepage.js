import cleanUrl from "lib/cleanUrl"

export const prepare = ({getAny}) => getAny()
export const apply = ({myMeta, meta}) => {
  if (myMeta) {
    return myMeta |> cleanUrl
  }
  if (meta?.repository?.github?.homepage) {
    return meta.repository.github.homepage |> cleanUrl
  }
  if (meta?.repository?.repoInfo) {
    return `${meta.repository.repoInfo.browse()}#readme` |> cleanUrl
  }
}