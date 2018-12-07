import {trim} from "lodash"
import normalizeUrl from "normalize-url"

export default x => x
  |> trim
  |> normalizeUrl
