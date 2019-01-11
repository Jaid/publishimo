const {base, getPath, pkg} = require("./webpack-base")

config = {
  entry: getPath("src"),
  output: {
    path: getPath("build"),
    filename: "index.js",
    library: pkg.name,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  ...base
}

module.exports = config
