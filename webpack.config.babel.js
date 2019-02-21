import {configureNodeLib} from "webpack-config-jaid"

export default configureNodeLib({
  documentation: {babel: true},
  publishimo: {fetchGithub: true},
})