export function withResolvers() {
  let resolve
  let reject

  const promise = new Promise((resolver, rejector) => {
    resolve = resolver
    reject = rejector
  })

  return {
    promise,
    resolve,
    reject,
  }
}

Promise.withResolvers = Promise.withResolvers ?? withResolvers
