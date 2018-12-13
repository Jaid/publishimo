import publishimo from "../build"
import jestFs, {mock as fs} from "jest-plugin-fs"
import path from "path"
import os from "os"

jest.mock("fs", () => require("jest-plugin-fs/mock"));

// Jesus, Jest's fs mocking implementation is terrible to work with
// Here we choose the name of a tests/packages directory and load specified contained files into the virtual file system
// Keeping track of TODO
const getPackageDir = (name, files = null) => {
  const packageDir = path.resolve(__dirname, "packages", name)
  if (files) {
    files = files.map(file => path.resolve(packageDir, file))
  } else {
    files = require.requireActual("fs").readdirSync(packageDir, {withFileTypes: true})
      .filter(dirent => !dirent.isDirectory())
      .map(dirent => path.resolve(packageDir, dirent.name))
  }
  jestFs.unmock(files)
  fs.mkdirSync(packageDir, {recursive: true})
  return packageDir
}

describe("File system tests", () => {
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
  it("should generate release without package.json", () => {
    const name = "no-package-json"
    const cwd = getPackageDir(name)
    const releaseDir = path.resolve(os.tmpdir(), name)
    const result = publishimo({
      cwd,
      releaseDir
    })
    console.log(result)
    const pkg = JSON.parse(fs.readFileSync(path.resolve(releaseDir, "package.json"), "utf8"))
    expect(pkg).toMatchObject({
      name,
      version: "1.0.0",
      author: {
        name: "Pikachu"
      }
    })
  })
})
