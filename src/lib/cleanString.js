import {trim} from "lodash"
import {normalizeSync} from "normalize-diacritics/dist/index.cjs.js"

export default x => x
  |> trim
  |> normalizeSync