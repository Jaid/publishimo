# publishimo

[![Greenkeeper badge](https://badges.greenkeeper.io/Jaid/publishimo.svg)](https://greenkeeper.io/)

Generates a better package.json for published packages.

## API
```js
import publishimo from "publishimo"
publishimo(options)
```

## Options

Key|Type|Default
-|-|-
pkg|_String_ (path) or _Object_ (pkg)|package.json from `process.cwd()`
config|_Object_|_null_
output|_String_|_null_ (doesn't write a file)

## Config

Key|Type|Default
-|-|-
