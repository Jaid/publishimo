import {trim} from "lodash"

export const prepare = ({getAny}) => getAny()

export const apply = ({myMeta}) => {
  if (myMeta) {
    return myMeta |> trim
  }
  return "UNLICENSED"
}
