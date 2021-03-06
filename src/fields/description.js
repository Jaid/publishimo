import {trim} from "lodash"

export const prepare = ({getAny}) => getAny()
export const apply = ({meta, myMeta}) => {
  if (myMeta) {
    return myMeta |> trim
  }
  if (meta?.repository?.github?.data?.description) {
    return meta.repository.github.data.description |> trim
  }
}