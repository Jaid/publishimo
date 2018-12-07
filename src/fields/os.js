import cleanStringArray from "lib/cleanStringArray"

export const apply = ({getAny}) => {
  const value = getAny()
  if (value) {
    return value |> cleanStringArray
  }
}
