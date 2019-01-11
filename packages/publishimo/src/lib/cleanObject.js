import objClean from "obj-clean"
import sortKeys from "sort-keys"

export default x => x
  |> objClean
  |> sortKeys