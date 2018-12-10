import cleanString from "lib/cleanString"
import fs from "fs"
import path from "path"

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
