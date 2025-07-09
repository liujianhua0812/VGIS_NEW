
module.exports =  async function (context = {}, config, inputs = [], outputs) {
    let input = inputs[0]
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }
    return {
        input,
        result: input,
        canceled: false,
        error: null
    }
}