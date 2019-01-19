import {sortBy, sortedUniq, trim} from "lodash"

export default x => x
  |> (_ => _.filter(x => ["number", "boolean", "string"].includes(typeof x)))
  |> (_ => _.map(x => trim(x)))
  |> sortBy
  |> sortedUniq