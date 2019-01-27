import cleanAuthor from "lib/cleanAuthor"

export const apply = ({meta}) => {
  if (meta.author?.contributors?.length) {
    return meta.author.contributors.map(x => cleanAuthor(x))
  }
}