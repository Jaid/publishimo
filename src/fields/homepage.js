import cleanUrl from "lib/cleanUrl"

export const prepare = ({getAny}) => getAny()
export const applyMeta = x => x |> cleanUrl
