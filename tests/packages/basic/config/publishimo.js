const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

const config = {}

config.author = {
  name: "Jaid",
  github: true
}

const versionYml = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "..", "version.yml"), "utf8"));
config.version = `${versionYml.major}.${versionYml.minor}.${versionYml.patch}`
