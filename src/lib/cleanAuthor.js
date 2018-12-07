import {pick} from "lodash"
import objClean from "obj-clean"

export default x => x
  |> (_ => pick(_, ["name", "email", "url"]))
  |> objClean
