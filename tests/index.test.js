import publishimo from "../build"
import jestFs, {mock as fs} from "jest-plugin-fs"
import path from "path"
import readdirRecursive from "fs-readdir-recursive"
import os from "os"

jest.mock("fs", () => require("jest-plugin-fs/mock"));

const getPackageDir = name => {
  const packageDir = path.resolve(__dirname, "packages", name)
  console.log(packageDir)
  jestFs.unmock(readdirRecursive(packageDir))
  fs.mkdirSync(packageDir, {recursive: true})
  return packageDir
}

describe("File system tests", () => {
  beforeEach(() => jestFs.mock())
  afterEach(jestFs.restore)
  it("should generate release without package.json and publishimo.yml", () => {
    const name = "zero-config"
    const cwd = getPackageDir(name)
    expect.stringContaining(cwd, path.separator)
    const releaseDir = path.resolve(os.tmpdir(), name)
    expect.stringContaining(releaseDir, path.separator)
    publishimo({
      cwd,
      releaseDir
    })
    const pkgFile = path.resolve(releaseDir, "package.json")
    expect.stringContaining(pkgFile, path.separator)
    expect(fs.existsSync(pkgFile)).toBe(true)
    const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"))
    expect(pkg).toMatchObject({
      name,
      version: "1.0.0"
    })
  })
})
