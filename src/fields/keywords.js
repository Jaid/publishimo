import cleanStringArray from "lib/cleanStringArray"

export const prepare = ({getAny}) => getAny()
export const apply = ({meta, myMeta}) => {
  if (myMeta) {
    return myMeta |> cleanStringArray
  }
  if (meta ?.repository ?.github ?.topics) {
    return meta.repository.github.topics |> cleanStringArray
  }
}