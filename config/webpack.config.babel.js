import path from "path"

import webpackConfigNode from "webpack-config-node"

const isDevelopment = process.env.NODE_ENV !== "production"
const fromPackage = directive => path.resolve(__dirname, "..", directive)

export default webpackConfigNode({
  isDevelopment,
  packageRoot: path.resolve(__dirname, ".."),
  lib: true,
  extra: {
    devtool: "inline-source-map",
    resolve: {
      alias: {
        lib: fromPackage("src/lib"),
      },
    },
  },
})