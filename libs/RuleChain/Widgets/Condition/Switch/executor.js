let { VM } = require("vm2")

module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    let result = null, error = null

    try {
        // console.log("Threshold Node Executing", config)
        let value = null
        if (!(config.values instanceof Array) || config.values.length === 0) {
            for(let i = 0; i < outputs.length; i++) {
                outputs[i].canceled = true
            }
            error = "INVALID_VALUES"
            return {
                input,
                result,
                canceled: true,
                error: error
            }
        }
        else if (config.custom) {
            const vm = new VM({
                timeout: 500,
                allowAsync: false,
                sandbox: {
                    context,
                    input
                },
                eval: false,
                wasm: false
            })
            value = vm.run(config.field)
        }
        else if (config.field === "attr_") {
            value = input[config._field.name]
        }
        else if (config.field[0] === "series_") {
            value = input.find(value => value.name === config._field.name)
            if (value) {
                value = value.value
            }
        }
        for(let i = 0; i < config.values.length; i++) {
            if(value === config.values[i]) {
                outputs[i].result = input
                result = i
            }
            else {
                outputs[i].canceled = true
            }
        }
        if (result === null) {
            error = "NO_MATCH"
        }
        return {
            input,
            result,
            canceled: !result,
            error
        }
    }
    catch(err) {
        for(let i = 0; i < outputs.length; i++) {
            outputs[i].canceled = true
        }
        error = "INVALID_INPUT"
        return {
            input,
            result,
            canceled: true,
            error: error
        }
    }
}