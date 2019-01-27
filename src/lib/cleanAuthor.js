import {pick, trim, mapValues} from "lodash"
import objClean from "obj-clean"
import normalizeUrl from "normalize-url"

export default x => {
  x = x
    |> pick(#, ["name", "email", "url"])
    |> objClean
    |> mapValues(#, trim)
  if (x.url) {
    x.url = normalizeUrl(x.url, {
      defaultProtocol: "https:",
    })
  }
  return x
}