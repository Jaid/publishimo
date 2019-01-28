// Defined here: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html

import path from "path"

import cleanPath from "lib/cleanPath"

export const prepare = ({getAny}) => getAny() || getAny("typings")
export const applyMeta = typesPath => {
  if (typesPath.endsWith(".js")) {
    return typesPath
     |> path.basename(#, ".js")
     |> `${#}.d.ts`
     |> cleanPath
  } else {
    return typesPath |> cleanPath
  }
}