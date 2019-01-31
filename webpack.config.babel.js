import path from "path"

import webpackConfigJaid from "webpack-config-jaid"

const fromPackage = directive => path.resolve(__dirname, directive)

export default webpackConfigJaid({
  publishimo: {
    publishimoOptions: {
      fetchGithub: true,
    },
  },
  documentation: true,
  extra: {
    resolve: {
      alias: {
        lib: fromPackage("src/lib"),
      },
    },
  },
})