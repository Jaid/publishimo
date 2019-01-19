import path from "path"

import cleanString from "lib/cleanString"

export const prepare = ({getAny, sourcePkgLocation}) => {
  const configValue = getAny()
  if (configValue) {
    return configValue |> cleanString
  }
  if (sourcePkgLocation) {
    return sourcePkgLocation |> path.dirname |> path.basename |> cleanString
  }
  return "publishimo-output"
}

export const applyMeta = x => x