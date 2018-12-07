import {trim} from "lodash"

export const prepare = ({getAny}) => getAny()

export const apply = ({myMeta}) => {
  if (myMeta) {
    return myMeta |> trim
  }
  return "0.0.0"
}
