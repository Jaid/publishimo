import {trim} from "lodash"

export default x => x
  |> trim
  |> (string => string.replace(/\\/g, "/"))