import {isNil} from "lodash"
import normalizeUrl from "normalize-url"

const githubUrl = "https://github.com"

export default (name, githubValue) => {
  if (isNil(githubValue)) {
    return
  }
  if (githubValue === true) { // github: true
    return `${githubUrl}/${name.replace(" ", "")}`
  } else if (githubValue.contains("/")) { // github: "https://github.com/Jaid"
    return githubValue |> normalizeUrl
  } else {
    return `${githubUrl}/${githubValue}` // github: "Jaid"
  }
}
