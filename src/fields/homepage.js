import cleanUrl from "lib/cleanUrl"

export const prepare = ({getAny}) => getAny()
export const apply = ({myMeta, meta}) => {
  if (myMeta) {
    return myMeta |> cleanUrl
  }
  if (meta?.repository?.github?.data?.homepage) {
    return meta.repository.github.data.homepage |> cleanUrl
  }
  if (meta?.repository?.repoInfo) {
    return `${meta.repository.repoInfo.browse()}#readme` |> cleanUrl
  }
}