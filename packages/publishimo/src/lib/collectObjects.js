import {isNil, isArray, isArrayLike, isString} from "lodash"

export default (sources, addNullish = false) => {
  if (sources === null || sources === undefined) {
    return []
  }

  if (isString(sources) || !isArrayLike(sources)) {
    return sources
  }

  const collection = []
  for (const source of sources) {
    if (!addNullish && isNil(source)) {
      continue;
    }

    if (isArray(source)) {
      if (addFalsy) {
        Array.prototype.push.apply(collection, source)
      } else {
        Array.prototype.push.apply(collection, source.filter(x => !isNil(x)))
      }
    } else {
      collection.push(source)
    }
  }

  return collection
}
