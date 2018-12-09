import publishimo from "../build"
import jestFs, {mock as mockFs} from "jest-plugin-fs"
import path from "path"
import readdirRecursive from "fs-readdir-recursive"

const getPackageDir = name => {
  const packageDir = path.resolve(__dirname, "packages", name)
  console.log(readdirRecursive(packageDir))
  jestFs.unmock(readdirRecursive(packageDir).map(file => `${packageDir}/${file}`))
  return packageDir
}

describe("File system tests", () => {
  test("Zero  configuration", () => {
    const packageDir = getPackageDir("zero-config")
    publishimo({
      cwd: packageDir
    })
  })
})
