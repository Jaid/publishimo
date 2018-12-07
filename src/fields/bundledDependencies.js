import cleanStringObject from "lib/cleanStringObject"

export const prepare = ({getAny}) => getAny() || getAny("bundleDependencies") // This is important, because npm accepts this key as a variation

export const applyMeta = x => x |> cleanStringObject
