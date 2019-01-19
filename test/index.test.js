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
  it("should generate release on a basic environment", async () => {
    await publishimo({
      pkg: getPackageDir("basic"),
      output: releaseDir,
    })
  })
  it("should generate release and output without any mistake", async () => {
    const name = "basic"
    const cwd = getPackageDir(name)
    expect.stringContaining(cwd, path.sep)
    expect.stringContaining(releaseDir, path.sep)
    const options = {
      fetchGithub: true,
      name: "publishimo",
      author: {
        name: "Jaid",
        github: true,
      },
      version: "1.2.3",
      main: "dist\\index.js",
      pkg: cwd,
      output: releaseDir,
    }
    const result = await publishimo(options)
    require.requireActual("fs").writeFileSync(path.resolve(__dirname, "..", "dist", "test-result.json"), JSON.stringify(result, null, 2))
    const pkgFile = path.resolve(releaseDir, "package.json")
    expect.stringContaining(pkgFile, path.sep)
    expect(fs.existsSync(pkgFile)).toBe(true)
    const pkg = loadJsonFile.sync(pkgFile)
    const expectedAuthorName = "Jaid"
    const expectedPkg = {
      name: "publishimo",
      version: "1.2.3",
      main: "dist/index.js",
      author: {
        name: expectedAuthorName,
        url: `https://github.com/${expectedAuthorName}`,
      },
      homepage: `https://github.com/${expectedAuthorName}/publishimo#readme`,
      repository: `github:${expectedAuthorName}/publishimo`,
      bugs: `https://github.com/${expectedAuthorName}/publishimo/issues`,
    }
    expect(pkg).toMatchObject(expectedPkg)
    expect(pkg.license).toBe("MIT")
    expect(result).toMatchObject({
      options,
      generatedPkg: expectedPkg,
      sourcePkg:
      {
        name: "publishimo",
        devDependencies: {
          "js-yaml": expect.stringContaining("."),
        },
      },
      sourcePkgLocation: path.join(cwd, "package.json"),
      outputDir: expect.stringContaining(`${path.sep}test-release`),
      outputPath: expect.stringContaining(`${path.sep}package.json`),
    })
  })
  it("should generate release without any configuration", async () => {
    await publishimo({
      output: releaseDir,
    })
    const pkg = await loadJsonFile(path.join(releaseDir, "package.json"))
    expect(Object.keys(pkg).length).toBe(2)
    expect(pkg).toMatchObject({
      name: "publishimo-output",
      version: "1.0.0",
    })
  })
})