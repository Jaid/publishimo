import cleanStringObject from "lib/cleanStringObject"

export const prepare = ({getAny}) => getAny()
export const applyMeta = x => x |> cleanStringObject
