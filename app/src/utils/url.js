
function parseQuery(url) {
  return url.split('&').reduce((result, item) => {
    let query = item.split('=')
    result[query[0]] = query[1]
    return result
  }, {})
}

export default {
  parseQuery
}
