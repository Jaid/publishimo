import path from "path"

import webpackConfigJaid from "webpack-config-jaid"

const isDevelopment = process.env.NODE_ENV !== "production"
const fromPackage = directive => path.resolve(__dirname, directive)

export default webpackConfigJaid({
  isDevelopment,
  packageRoot: __dirname,
  extra: {
    resolve: {
      alias: {
        lib: fromPackage("src/lib"),
      },
    },
  },
})