import cleanStringObject from "lib/cleanStringObject"

export const apply = ({getAny}) => {
  const value = getAny()
  if (value) {
    return value |> cleanStringObject
  }
}
