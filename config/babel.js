const isDevelopment = process.env.NODE_ENV !== "production"

config = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "6.2.2"
        }
      }
    ]
  ],
  plugins: [
    "@babel/proposal-optional-chaining",
    "version"
  ]
}

if (isDevelopment) {
  config.sourceMaps = "inline"
} else {
  config.presets.push("minify")
  config.plugins.push("lodash")
  config.plugins.push("module:faster.js")
}

module.exports = config
