const path = require("path");
const pkg = require("../package.json")

const isDevelopment = process.env.NODE_ENV !== "production"

config = {
  target: "node",
  entry: "./src/cli",
  mode: isDevelopment ? "development" : "production",
  output: {
    path: path.resolve("./build"),
    filename: "cli.js",
    library: pkg.name,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: Object.keys(pkg.dependencies),
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.jsx?$/,
        enforce: "post",
        resourceQuery: /\?aot$/,
        loader: "aot-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules\//,
        loader: "babel-loader"
      }
    ]
  }
}

if (isDevelopment) {
  config.devtool = "eval"
} else {
}


module.exports = config
