import path from "path"

import cleanString from "lib/cleanString"

export const prepare = ({getAny}) => getAny()

export const apply = ({myMeta, sourcePkgLocation}) => {
  if (myMeta) {
    return myMeta |> cleanString
  }
  if (sourcePkgLocation) {
    return sourcePkgLocation |> path.dirname |> path.basename |> cleanString
  }
  return "publishimo-output"
}