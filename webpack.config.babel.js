import {configureLib} from "webpack-config-jaid"

export default configureLib({
  publishimo: {fetchGithub: true},
  documentation: {babel: true},
})