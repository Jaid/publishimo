import cleanString from "lib/cleanString"

export const apply = ({getAny}) => {
  const value = getAny()
  if (value) {
    return value |> cleanString
  }

  return "unnamed"
}
