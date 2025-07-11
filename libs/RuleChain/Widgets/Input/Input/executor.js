module.exports = async function (context = {}, config, inputs = [], outputs) {
    // 1. 取第一个输入数据（虽然 inputs 长度为 0，这里是兼容处理）
    let input = inputs[0];
    // 2. 将输入数据传递给所有输出节点（当前组件只有 1 个输出）
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input;
    }
    // 3. 返回执行结果（包含输入数据、状态等）
    return {
        input,          // 原始输入数据
        result: input,  // 输出结果（与输入一致）
        canceled: false,// 未取消执行
        error: null     // 无错误
    }
};