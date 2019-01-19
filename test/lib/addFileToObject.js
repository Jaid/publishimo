import path from "path"

const fs = require.requireActual("fs")

const addFileToObject = (file, object = {}) => {
  if (fs.statSync(file).isDirectory()) {
    const directoryName = file |> path.basename
    object[directoryName] = {}
    for (const entry of fs.readdirSync(file)) {
      const entryPath = path.resolve(file, entry)
      addFileToObject(entryPath, object[directoryName])
    }
  } else {
    object[file |> path.basename] = fs.readFileSync(file, "utf8")
  }
  return object
}

export default addFileToObject