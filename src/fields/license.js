import {trim} from "lodash"

export const prepare = ({getAny}) => getAny()
export const apply = ({meta, myMeta}) => {
  if (myMeta) {
    return myMeta |> trim
  }
  if (meta ?.repository ?.github ?.license ?.spdx_id) {
    return meta.repository.github.license.spdx_id
  }
}