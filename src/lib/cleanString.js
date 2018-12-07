import {trim} from "lodash"
import normalizeDiacritics from "normalize-diacritics"

export default x => x
  |> trim
  |> normalizeDiacritics.sync
