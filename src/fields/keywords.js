import cleanStringArray from "lib/cleanStringArray"

export const prepare = ({getAny}) => getAny()
export const apply = ({meta, myMeta}) => {
  if (myMeta) {
    return myMeta |> cleanStringArray
  }
  if (meta?.repository?.github?.data?.topics) {
    return meta.repository.github.data.topics |> cleanStringArray
  }
}