import {isNil, isObject} from "lodash"
import gitInfo from "hosted-git-info"

export default field => {
  if (field |> isNil) {
    return null
  }

  if (!isObject(field)) {
    const info = gitInfo.fromUrl(field)
    field = {
      type: info.type,
      url: ""
    }
  }

  if (field |> isObject) {
    return field
  }
}
