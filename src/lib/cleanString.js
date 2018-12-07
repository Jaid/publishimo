import {trim} from "lodash"
import {normalizeSync} from "normalize-diacritics"

export default x => x
  |> trim
  |> normalizeSync
