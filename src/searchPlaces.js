const pkg = require("../package.json")
const name = pkg.name

module.exports = [
  "package.json",
  `.${name}rc`,
  `.${name}rc.js`,
  `${name}.config.js`,
  `${name}.json`,
  `.${name}.json`,
  `${name}.yaml`,
  `${name}.yml`,
  `.${name}.yaml`,
  `.${name}.yml`
]
