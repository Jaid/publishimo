import cleanPath from "lib/cleanPath"

export const prepare = ({getAny}) => getAny()
export const applyMeta = path => {
  if (path.trim() === "index.js") { // "main": "index.js" is not needed, says https://docs.npmjs.com/creating-a-package-json-file#default-values-extracted-from-the-current-directory
    return
  }
  return path |> cleanPath
}