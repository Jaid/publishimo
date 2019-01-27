import path from "path"

import webpackConfigJaid from "webpack-config-jaid"

const fromPackage = directive => path.resolve(__dirname, directive)

export default webpackConfigJaid({
  development: process.env.NODE_ENV !== "production",
  publishimo: {
    publishimoOptions: {
      fetchGithub: true,
    },
  },
  packageRoot: __dirname,
  extra: {
    resolve: {
      alias: {
        lib: fromPackage("src/lib"),
      },
    },
  },
})