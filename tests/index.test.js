import publishimo from "../build"
import jestFs, {mock as fs} from "jest-plugin-fs"
// import fs from 'jest-plugin-fs';

// This installs the mock for 'fs'.
jest.mock("fs", () => require("jest-plugin-fs/mock"));

import path from "path"
import readdirRecursive from "fs-readdir-recursive"

const getPackageDir = name => {
  const packageDir = path.resolve(__dirname, "packages", name)
  jestFs.restore()
  console.log(packageDir)
  console.log(readdirRecursive(packageDir))
  jestFs.mock()
  jestFs.unmock(readdirRecursive(packageDir).map(file => `${packageDir}/${file}`))
  console.log(readdirRecursive(packageDir))
  console.log(jestFs.files())
  return packageDir
}

describe("File system tests", () => {
  beforeEach(() => jestFs.mock())
  afterEach(() => jestFs.restore())
  test("Zero configuration", () => {
    // const packageDir = getPackageDir("zero-config")
    jestFs.restore()
    fs.writeFileSync("a.txt", "a")
    publishimo({
      cwd: packageDir
    })
    console.log(readdirRecursive(packageDir))
  })
})
