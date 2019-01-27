import {sortBy, sortedUniq, compact} from "lodash"

export default x => x
  |> compact
  |> sortBy
  |> sortedUniq