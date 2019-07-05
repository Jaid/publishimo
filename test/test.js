import path from "path"

import fsp from "@absolunet/fsp"
import appCacheDir from "app-cache-dir"

const indexModule = process.env.MAIN ? path.resolve(__dirname, "..", process.env.MAIN) : path.join(__dirname, "..", "src")

/**
 * @type { import("../src") }
 */
const {default: publishimo} = require(indexModule)

const getInputDirectory = name => {
  return path.resolve(__dirname, "packages", name)
}

const getOutputDirectory = name => {
  return path.resolve(__dirname, "..", "dist", "test", name)
}

it("should generate release on a basic environment", async () => {
  const name = "basic"
  const packageDir = getInputDirectory(name)
  const outputDir = getOutputDirectory(name)
  await publishimo({
    pkg: packageDir,
    output: outputDir,
  })
})

it("should generate release and output without any mistake", async () => {
  const name = "basic"
  const packageDir = getInputDirectory(name)
  const outputDir = getOutputDirectory("basic-advanced-tests")
  expect.stringContaining(packageDir, path.sep)
  expect.stringContaining(outputDir, path.sep)
  const options = {
    fetchGithub: true,
    name: "publishimo",
    author: {
      name: "Jaid",
      url: "github.com/Jaid",
    },
    version: "1.2.3",
    main: "dist\\index.js",
    pkg: packageDir,
    output: outputDir,
  }
  const result = await publishimo(options)
  await fsp.outputYaml(path.resolve(outputDir, "testResult.yml"), result)
  const pkgFile = path.resolve(outputDir, "package.json")
  expect.stringContaining(pkgFile, path.sep)
  const outputExists = await fsp.pathExists(pkgFile)
  expect(outputExists).toBe(true)
  const pkg = await fsp.readJson(pkgFile)
  const expectedAuthorName = "Jaid"
  const expectedPkg = {
    name: "publishimo",
    version: "1.2.3",
    main: "dist/index.js",
    author: {
      name: expectedAuthorName,
      url: `https://github.com/${expectedAuthorName}`,
    },
    homepage: `https://github.com/${expectedAuthorName}/publishimo`,
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
    sourcePkgLocation: path.join(packageDir, "package.json"),
    outputDir: expect.stringContaining(`${path.sep}basic-advanced-tests`),
    outputPath: expect.stringContaining(`${path.sep}package.json`),
  })
  const cacheDir = path.join(appCacheDir("publishimo"), "github", "Jaid", "publishimo")
  const cacheFile = path.join(cacheDir, "fetch.json5")
  const cacheFileExists = await fsp.pathExists(cacheFile)
  expect(cacheFileExists).toBeTruthy()
  const cache = await fsp.readJson5(cacheFile)
  expect(cache).toMatchObject({
    data: {
      license: {
        spdx_id: result.generatedPkg.license,
      },
      description: result.generatedPkg.description,
      topics: expect.arrayContaining(result.generatedPkg.keywords),
    },
    fetch: {
      timestamp: expect.any(Number),
      domain: "api.github.com",
      path: "repos/Jaid/publishimo",
    },
  })
})

it("should generate release without any configuration", async () => {
  const name = "zero-config"
  const releaseDir = getOutputDirectory(name)
  await publishimo({
    output: releaseDir,
  })
  const pkg = await fsp.readJson(path.join(releaseDir, "package.json"))
  expect(Object.keys(pkg).length).toBe(2)
  expect(pkg).toMatchObject({
    name: "publishimo-output",
    version: "1.0.0",
  })
})

// Testing following case: https://github.com/npm/normalize-package-data/issues/91
it("should avoid unwanted dependency field merges", async () => {
  const pkg = {
    name: "dependency-test",
    dependencies: {
      "@babel/core": "^7.0.0",
    },
    optionalDependencies: {
      "epoch-seconds": "^1.0.0",
    },
  }
  const result = await publishimo({
    pkg,
  })
  expect(result).toMatchObject({
    generatedPkg: {
      version: "1.0.0",
      name: "dependency-test",
      dependencies: {
        "@babel/core": "^7.0.0",
      },
      optionalDependencies: {
        "epoch-seconds": "^1.0.0",
      },
    },
  })
  expect(Object.keys(result.generatedPkg.dependencies).length).toBe(1)
})

it("should generate package by combining sourcePkg, option fields and GitHub data", async () => {
  const pkg = {
    version: "5.5.5",
    author: "Jaid <jaid.jsx@gmail.com> (github.com/jaid)",
  }
  const result = await publishimo({
    pkg,
    name: "epoch-seconds",
    fetchGithub: true,
  })
  expect(pkg._id).toBeUndefined() // eslint-disable-line no-underscore-dangle
  expect(pkg.readme).toBeUndefined()
  expect(result).toMatchObject({
    generatedPkg: {
      author: {
        name: "Jaid",
        email: "jaid.jsx@gmail.com",
        url: "https://github.com/jaid",
      },
      bugs: "https://github.com/jaid/epoch-seconds/issues",
      description: "Returns the seconds passed since Unix epoch.",
      homepage: "https://github.com/jaid/epoch-seconds",
      keywords: expect.arrayContaining(["date"]),
      license: "MIT",
      name: "epoch-seconds",
      repository: "github:jaid/epoch-seconds",
      version: "5.5.5",
    },
  })
})