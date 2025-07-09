let { VM } = require("vm2")

module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    let result = null, error = null

    try {
        let data = JSON.parse(JSON.stringify(input))
        const vm = new VM({
            timeout: 1000,
            allowAsync: false,
            sandbox: {
                context,
                input: data
            },
            eval: false,
            wasm: false
        })
        result = vm.run(`(${config.action})(context, input)`)
        for(let i = 0; i < outputs.length; i++) {
            outputs[i].result = result
        }
    }
    catch(err) {
        result = null
        for(let i = 0; i < outputs.length; i++) {
            outputs[i].result = input
        }
        error = "INVALID_EXECUTOR"
    }
    return {
        input,
        result,
        canceled: false,
        error
    }
}