import {trim} from "lodash"

export const apply = ({getAny}) => {
  const value = getAny()
  if (value) {
    return value |> trim
  }
}
