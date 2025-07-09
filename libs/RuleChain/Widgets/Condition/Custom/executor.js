let { VM } = require("vm2")

module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    let result = null, error = null

    try {
        const vm = new VM({
            timeout: 1000,
            allowAsync: false,
            sandbox: {
                context,
                input
            },
            eval: false,
            wasm: false
        })

        result = vm.run(`(${config.action})(context, input)`)
        if (![true, false].includes(result)) {
            error = "INVALID_RETURN"
            result = null
            for(let i = 0; i < outputs.length; i++) {
                outputs[i].canceled = true
            }
        }
        else {
            outputs[result ? 0 : 1].result = input
            outputs[result ? 1 : 0].canceled = true
        }
    }
    catch(err) {
        for(let i = 0; i < outputs.length; i++) {
            outputs[i].canceled = true
        }
        error = "INVALID_CHECKER"
    }
    return {
        input,
        result,
        canceled: !!error,
        error
    }
}