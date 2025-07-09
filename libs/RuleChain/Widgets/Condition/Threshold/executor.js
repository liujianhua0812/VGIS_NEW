const {VM} = require("vm2");

module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    let result = true, error = null
    let components = []

    // console.log("Threshold Check Node Executing", config)

    function isValid (threshold, isFirst) {
        if (threshold.custom && !threshold.field) return false
        else if (!threshold.custom && (!threshold._field || !threshold._field.name)) return false
        else if (["And", "Or"].includes(threshold.relation) && !isFirst) return false
        else {
            let min = parseFloat(threshold.min), max = parseFloat(threshold.max)
            if (isNaN(min) && isNaN(max)) {
                return false
            }
        }
        return true
    }

    function checkValue(value, min, max) {
        if(!isNaN(min) && !isNaN(max)) {
            return value >= min && value <= max
        }
        else if (isNaN(max)) {
            return value >= min
        }
        else if (isNaN(min)) {
            return value <= max
        }
        return false
    }

    function check(input, threshold) {
        let min = parseFloat(threshold.min), max = parseFloat(threshold.max)
        if (threshold.custom) {
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
            let value = vm.run(`${threshold.field}`)
            if (value || value === 0) {
                let check = checkValue(value, min, max)
                components.push({ value, result: check })
                return check
            }
            else {
                components.push({ value, result: false })
                return false
            }
        }
        else if (threshold.field[0] === "attr_") {
            let value = input[threshold._field.name]
            if (value || value === 0) {
                let check = checkValue(value, min, max)
                components.push({ value, result: check })
                return check
            }
            else {
                components.push({ value, result: false })
                return false
            }
        }
        else if (threshold.field[0] === "series_") {
            let value = input.find(value => value.name === threshold._field.name)
            if (value) {
                let check = checkValue(value.value, min, max)
                components.push({ value: value.value, result: check })
                return check
            }
            else {
                components.push({ value, result: false })
                return false
            }
        }
    }

    try {
        for(let i = 0; i < config.thresholds.length; i++) {
            let threshold = config.thresholds[i]
            if (isValid(threshold, i === 0)) {
                if (i === 0) {
                    result = check(input, threshold)
                }
                else if (threshold.relation === "AND") {
                    result = result && check(input, threshold)
                }
                else {
                    result = result || check(input, threshold)
                }
            }
        }
        outputs[result ? 0 : 1].result = input
        outputs[result ? 1 : 0].canceled = true
    }
    catch(err) {
        for(let i = 0; i < outputs.length; i++) {
            outputs[i].canceled = true
        }
        error = "INVALID_INPUT"
    }

    return {
        input,
        result: {
            overall: result,
            process: components
        },
        canceled: false,
        error: error
    }
}