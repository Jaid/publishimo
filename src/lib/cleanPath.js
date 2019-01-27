import {trim} from "lodash"

export default x => x
  |> trim
  |> #.replace(/\\/g, "/")