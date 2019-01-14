import cleanString from "lib/cleanString"

export const prepare = ({getAny}) => getAny()

export const apply = ({myMeta}) => {
  if (myMeta) {
    return myMeta |> cleanString
  }
  return "publishimo-output"
}