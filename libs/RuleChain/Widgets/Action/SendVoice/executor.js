
module.exports =  async function (context, config, inputs, outputs) {
    let result = null, input = inputs[0], error = null
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }
    return {
        input,
        result,
        canceled: false,
        error
    }
}