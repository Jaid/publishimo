import {sortBy, sortedUniq, isNil, trim} from "lodash"

export default x => x
  |> (_ => _.filter(!isNil(_) && _ !== ""))
  |> (_ => _.map(trim))
  |> sortBy
  |> sortedUniq
