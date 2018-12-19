import publishimo from "../build"
import addFileToObject from "./lib/addFileToObject"
import jestFs, {mock as fs} from "jest-plugin-fs"
import path from "path"
import os from "os"

const releaseDir = path.resolve(os.tmpdir(), "publishimo/test-release")
jest.mock("fs", () => require("jest-plugin-fs/mock"));

// Jesus, Jest's fs mocking implementation is terrible to work with
// Here we choose the name of a tests/packages directory and load specified contained files into the virtual file system
// Keeping track of TODO
const getPackageDir = name => {
  const packageDir = path.resolve(__dirname, "packages", name)
  const objectRepresentation = {}
  addFileToObject(packageDir, objectRepresentation)
  jestFs.mock({
    [packageDir]: objectRepresentation[name]
  })
  fs.mkdirSync(packageDir, {recursive: true})
  return packageDir
}

describe("Tests with mocked fs", () => {
  afterEach(jestFs.restore)
  it("should generate release on a basic environment", () => {
    const name = "basic"
    const cwd = getPackageDir(name)
    expect.stringContaining(cwd, path.sep)
    expect.stringContaining(releaseDir, path.sep)
    const result = publishimo({
      cwd,
      releaseDir
    })
    const pkgFile = path.resolve(releaseDir, "package.json")
    expect.stringContaining(pkgFile, path.sep)
    expect(fs.existsSync(pkgFile)).toBe(true)
    const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"))
    const expectedAuthorName = "Jaid"
    const expectedPkg = {
      name,
      version: "1.2.3",
      author: {
        name: expectedAuthorName,
        url: `https://github.com/${expectedAuthorName}`
      },
      homepage: `https://github.com/${expectedAuthorName}/${name}`,
      repository: `github:${expectedAuthorName}/${name}`,
      bugs: `https://github.com/${expectedAuthorName}/${name}/issues`,
      license: "MIT"
    }
    expect(pkg).toMatchObject(expectedPkg)
    expect(result).toMatchObject({
      generatedPackage: expectedPkg,
      pkg:
       {
         name,
         publishimo: "config/publishimo.js",
         license: "MIT",
         version: ""
       },
      pkgPath: expect.stringContaining(`${path.sep}${name}${path.sep}package.json`),
      config: {
        author: {
          name: expectedAuthorName,
          github: true
        },
        version: "1.2.3"
      },
      configPath: expect.stringContaining(`${path.sep}${name}${path.sep}config${path.sep}publishimo.js`),
      outputDir: expect.stringContaining(path.sep),
      cwd: expect.stringContaining(`${path.sep}${name}`)
    })
    console.log(result)
  })
  it("should generate release without package.json and publishimo.yml", () => {
    const name = "zero-config"
    const cwd = getPackageDir(name)
    publishimo({
      cwd,
      releaseDir
    })
    const pkg = JSON.parse(fs.readFileSync(path.resolve(releaseDir, "package.json"), "utf8"))
    expect(Object.keys(pkg).length).toBe(2)
    expect(pkg).toMatchObject({
      name,
      version: "1.0.0"
    })
  })
  it("should generate release without package.json", () => {
    const name = "no-package-json"
    const cwd = getPackageDir(name)
    publishimo({
      cwd,
      releaseDir
    })
    const pkg = JSON.parse(fs.readFileSync(path.resolve(releaseDir, "package.json"), "utf8"))
    expect(pkg).toMatchObject({
      name,
      version: "1.0.0",
      author: {
        name: "Pikachu"
      }
    })
  })
  it("should generate release without publishimo.yml", () => {
    const name = "no-publishimo-config"
    const cwd = getPackageDir(name)
    publishimo({
      cwd,
      releaseDir
    })
    const pkg = JSON.parse(fs.readFileSync(path.resolve(releaseDir, "package.json"), "utf8"))
    expect(pkg).toMatchObject({
      name,
      author: {
        name: "Charles Dickens"
      }
    })
  })
})
