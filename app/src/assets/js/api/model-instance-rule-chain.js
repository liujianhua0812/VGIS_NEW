import request from './request'

//查看模型的规则链
export function getRuleChainListForModel(modelId) {
    return request({
        url: `/model/${modelId}/rule_chains`,
        method: 'GET'
    })
}

//查看模型实例的规则链
export function getRuleChainListForInstance(instanceId) {
    return request({
        url: `/instance/${instanceId}/rule_chains`,
        method: 'GET'
    })
}

//查看模型实例的规则链
export function getRuleChainDetail(chainId) {
    return request({
        url: `/rule_chains/${chainId}`,
        method: 'GET'
    })
}

// 创建规则链
export function addRuleChain(data) {
    return request({
        url: `/rule_chains`,
        method: 'POST',
        data
    })
}

// 创建规则链
export function testRuleChain(chain, data) {
    return request({
        url: `/rule_chains/test`,
        method: 'POST',
        data: {
            chain,
            data
        }
    })
}

// 更新规则链
export function updateRuleChain(chainId, data) {
    return request({
        url: `/rule_chains/${chainId}`,
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        data
    })
}

// 删除规则链
export function removeRuleChain(chainId) {
    return request({
        url: `/rule_chains/${chainId}`,
        method: 'DELETE'
    })
}