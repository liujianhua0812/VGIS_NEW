import request from './request'

//查看协议列表
export function getInstanceProtocolList(instanceId) {
  return request({
    url: `/instance/${instanceId}/protocol`,
    method: 'GET'
  })
}

//测试协议结果
export function testInstanceProtocol(instanceId, protocol = {}) {
  if (protocol instanceof Object) {
    return request({
      url: `/instance/${instanceId}/protocol/test`,
      method: 'POST',
      data: protocol,
    })
  }
  else {
    return request({
      url: `/instance/${instanceId}/protocol/${protocol}/test`,
      method: 'POST'
    })
  }
}

//查看协议列表
export function createInstanceProtocol(instanceId, data) {
  return request({
    url: `/instance/${instanceId}/protocol`,
    method: 'POST',
    data
  })
}

//查看协议列表
export function updateInstanceProtocol(instanceId, protocolId, data) {
  return request({
    url: `/instance/${instanceId}/protocol/${protocolId}`,
    method: 'PUT',
    data
  })
}

//查看协议列表
export function deleteInstanceProtocol(instanceId, protocolId) {
  return request({
    url: `/instance/${instanceId}/protocol/${protocolId}`,
    method: 'DELETE'
  })
}
