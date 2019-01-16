import path from "path"
import os from "os"

import jestFs, {mock as fs} from "jest-plugin-fs"
import loadJsonFile from "load-json-file"

import publishimo from "../dist"

import addFileToObject from "./lib/addFileToObject"

const releaseDir = path.resolve(os.tmpdir(), "publishimo/test-release")
jest.mock("fs", () => require("jest-plugin-fs/mock"))

// Jesus, Jest's fs mocking implementation is terrible to work with
// Here we choose the name of a tests/packages directory and load specified contained files into the virtual file system
const getPackageDir = name => {
  const packageDir = path.resolve(__dirname, "packages", name)
  const objectRepresentation = {}
  addFileToObject(packageDir, objectRepresentation)
  jestFs.mock({
    [packageDir]: objectRepresentation[name],
  })
  fs.mkdirSync(packageDir, {recursive: true})
  return packageDir
}

describe("Tests with mocked fs", () => {
  afterEach(jestFs.restore)
  it("should generate release on a basic environment", () => {
    publishimo({
      pkg: getPackageDir("basic"),
      output: releaseDir,
    })
  })
  it("should generate release and output without any mistake", () => {
    const name = "basic"
    const cwd = getPackageDir(name)
    expect.stringContaining(cwd, path.sep)
    expect.stringContaining(releaseDir, path.sep)
    const options = {
      config: {
        author: {
          name: "Jaid",
          github: true,
        },
        version: "1.2.3",
      },
      pkg: cwd,
      output: releaseDir,
    }
    const result = publishimo(options)
    console.log(result)
    const pkgFile = path.resolve(releaseDir, "package.json")
    expect.stringContaining(pkgFile, path.sep)
    expect(fs.existsSync(pkgFile)).toBe(true)
    const pkg = loadJsonFile.sync(pkgFile)
    const expectedAuthorName = "Jaid"
    const expectedPkg = {
      name,
      version: "1.2.3",
      author: {
        name: expectedAuthorName,
        url: `https://github.com/${expectedAuthorName}`,
      },
      homepage: `https://github.com/${expectedAuthorName}/${name}`,
      repository: `github:${expectedAuthorName}/${name}`,
      bugs: `https://github.com/${expectedAuthorName}/${name}/issues`,
      license: "MIT",
    }
    expect(pkg).toMatchObject(expectedPkg)
    expect(result).toMatchObject({
      options,
      generatedPkg: expectedPkg,
      sourcePkg:
      {
        name,
        publishimo: "config/publishimo.js",
        license: "MIT",
        version: "",
      },
      outputDir: expect.stringContaining(`${path.sep}test-release`),
      outputPath: expect.stringContaining(`${path.sep}package.json`),
    })
    console.log(result)
  })
  it("should generate release without any configuration", () => {
    publishimo({
      output: releaseDir,
    })
    const pkg = loadJsonFile.sync(path.join(releaseDir, "package.json"))
    expect(Object.keys(pkg).length).toBe(2)
    expect(pkg).toMatchObject({
      name: "publishimo-output",
      version: "1.0.0",
    })
  })
})