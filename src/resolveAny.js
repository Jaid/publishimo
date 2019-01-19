export default async (resolvee, ...args) => {
  if (typeof resolvee === "function") {
    const value = await resolvee(...args)
    return value
  }
  return resolvee
}