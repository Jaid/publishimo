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
  include: [
    "readme.md",
    "license.txt",
  ],
  packageRoot: __dirname,
  extra: {
    resolve: {
      alias: {
        lib: fromPackage("src/lib"),
      },
    },
  },
})