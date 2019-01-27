import {sortBy, sortedUniq, trim} from "lodash"

export default x => x
  |> #.filter(x => ["number", "boolean", "string"].includes(typeof x))
  |> #.map(x => trim(x))
  |> sortBy
  |> sortedUniq