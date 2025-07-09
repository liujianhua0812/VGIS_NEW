import request from './request'

//查看模型实例的静态属性数值列表
export function getInstanceAttributeList(instanceId) {
  return request({
    url: `/instance/${instanceId}/attribute`,
    method: 'GET'
  })
}

//更新模型实例的静态属性数值
export function updateInstanceAttribute(instanceId, attributeId, data) {
  return request({
    url: `/instance/${instanceId}/attribute/${attributeId}`,
    method: 'PUT',
    data
  })
}

//清空模型实例的静态属性数值
export function deleteInstanceAttribute(instanceId, attributeId, data) {
  return request({
    url: `/instance/${instanceId}/attribute/${attributeId}`,
    method: 'DELETE'
  })
}
