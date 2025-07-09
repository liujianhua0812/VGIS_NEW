
exports.composeDefault = (template = "", context) => {
    let pattern = /\{\{(.*?)}}/, result = `${template}`
    let instance = context.instance, data = context.data, extra = context.extra
    while(true) {
        let match = result.match(pattern)
        if (!match) {
            break
        }
        // TODO: NEED BETTER WAY THAN EVAL!!!!!!!!!!
        let value = eval(match[1])
        if (value !== null && value !== undefined) {
            result = result.replace(pattern, value)
        }
        else {
            result = result.replace(pattern, match[1])
        }
    }
    return result
}