const path = require("path");
const pkg = require("../package.json")

const isDevelopment = process.env.NODE_ENV !== "production"
const getPath = shortPath => path.resolve(__dirname, "..", shortPath)

base = {
  target: "node",
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      lib: getPath("src/lib")
    }
  },
  mode: isDevelopment ? "development" : "production",
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
  base.devtool = "eval"
} else {
  base.optimization = {
    moduleIds: "total-size"
  }
}

module.exports = {
  base,
  pkg,
  isDevelopment,
  getPath
}
