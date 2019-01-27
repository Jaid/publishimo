import {pick, trim, mapValues} from "lodash"
import objClean from "obj-clean"
import normalizeUrl from "normalize-url"

export default x => {
  x = x
    |> (_ => pick(_, ["name", "email", "url"]))
    |> objClean
    |> (_ => mapValues(_, trim))
  if (x.url) {
    x.url = normalizeUrl(x.url, {
      defaultProtocol: "https:",
    })
  }
  return x
}