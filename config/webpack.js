const path = require("path");
const pkg = require("../package.json")

const isDevelopment = process.env.NODE_ENV !== "production"
const getPath = shortPath => path.resolve(__dirname, "..", shortPath)

config = {
  target: "node",
  entry: getPath("./src/cli"),
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      lib: getPath("src/lib")
    }
  },
  mode: isDevelopment ? "development" : "production",
  output: {
    path: getPath("build"),
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
