import fs from "fs"
import path from "path"

import cleanString from "lib/cleanString"

export const prepare = ({getAny}) => getAny()

export const apply = ({cwd, myMeta}) => {
  if (myMeta) {
    return myMeta |> cleanString
  }
  const projectDirName = cwd |> path.basename
  if (projectDirName) {
    return projectDirName |> cleanString
  }
  return "unnamed"
}