import {trim, mapValues} from "lodash"
import cleanObject from "lib/cleanObject"

export default x => x
  |> cleanObject
  |> (_ => mapValues(_, trim))