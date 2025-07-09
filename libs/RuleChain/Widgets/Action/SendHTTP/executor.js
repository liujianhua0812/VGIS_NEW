let axios = require('axios')

module.exports = async function (context, config, inputs = [], outputs) {
    let input = inputs[0]

    let headers = config.headers.reduce((result, header) => {
        result[header.name] = header.value
        return result
    }, {})

    let params = config.query.reduce((result, query) => {
        result[query.name] = query.value
        return result
    }, {})

    let body = null

    switch(config.contentType) {
        case "multipart/form-data":
            body = config.body.reduce((result, item) => {
                result.append(item.name, item.value)
                return result
            }, new FormData())
            break
        case "application/x-www-form-urlencoded":
            body = config.body.reduce((result, item) => {
                if (result[item.name]) {
                    if (!(result[item.name] instanceof Array)) {
                        result[item.name] = [result[item.name]]
                    }
                    result[item.name].push(item.value)
                }
                else {
                    result[item.name] = item.value
                }
                return result
            }, {})
            break
        case "application/json":
        case "application/xml":
        case "text/plain":
        default:
            body = config.rawBody
            break
    }

    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }

    try {
        return {
            result: await axios({
                method: config.method,
                url: config.address,
                headers,
                params,
                data: body
            }),
            canceled: false
        }
    }
    catch(err) {
        return {
            canceled: false,
            error: err
        }
    }
}