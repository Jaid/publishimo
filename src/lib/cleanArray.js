import {sortBy, sortedUniq, isNil} from "lodash"

export default x => x
  |> (_ => _.filter(!isNil(_)))
  |> sortBy
  |> sortedUniq
