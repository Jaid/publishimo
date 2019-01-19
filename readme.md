# publishimo

[![Greenkeeper badge](https://badges.greenkeeper.io/Jaid/publishimo.svg)](https://greenkeeper.io/)

Generates a better package.json for published packages.

## API
```js
import publishimo from "publishimo"
publishimo(options).then(result => {
  console.log(result)
})
```

## Options

```js
const publishimoConfig = {

  // Can be a path to an existing package.json or a pkg object
  pkg: path.resolve("..", "package.json"), // Default: {}

  // Output generated pkg data as JSON to specified file
  output: path.resolve("..", "dist", "package.json"), // Default: false

  // If true, some metadata gets fetched from an existing GitHub repository
  fetchGithub: true, // Default: false

  name: "name", // Default: Name of project root folder
  version: "1.2.3", // Default: 1.0.0
  main: "index.js", // No default, but publishimo-webpack-plugin has one
  description: "", // Default comes from GitHub if fetchGithub is true
  keywords: ["tag"] // Default comes from GitHub if fetchGithub is true
  author: {
    name: "Smitty Werben Jagger Man Jaidsen",
    email: "jaid@example.com",
    github: "Jaid" // Shortcut for author.homepage
  },
  license: "MIT", // No default, set this by yourself please!
  os: ["!darwin"],
  cpu : ["x64", "ia32"],
  engines: {
    "node" : ">=11.6.0"
  },
  repository: "", // Default: github.com/{author.github}/{name},
  homepage: "", //Default: github.com/{author.github}/{name}#readme"
  bugs: "", // Default: github.com/{author.github}/{name}/issues
  contributors: "",
  dependencies: {},
  peerDependencies: {},
  bundleDependencies: {},
  optionalDependencies: {}

}
```