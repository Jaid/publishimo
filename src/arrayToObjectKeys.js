import {isFunction} from "lodash"

export default (array, valueGenerator) => {
  const object = {}
  let index = 0
  for (const value of array) {
    object[value] = isFunction(valueGenerator) ? valueGenerator(value, index) : null
    index++
  }
  return object
}