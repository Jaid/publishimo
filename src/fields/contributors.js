import cleanAuthor from "lib/cleanAuthor"

export const apply = ({configMeta}) => {
  if (configMeta.author ?.contributors ?.length) {
    return configMeta.author.contributors.map(x => cleanAuthor(x))
  }
}