import path from "path"

import cleanString from "lib/cleanString"

export const prepare = ({getAny}) => getAny()

export const apply = ({myMeta, sourcePkgLocation}) => {
  if (myMeta) {
    return myMeta |> cleanString
  }
  if (sourcePkgLocation) {
    return path.dirname(sourcePkgLocation) |> cleanString
  }
  return "publishimo-output"
}