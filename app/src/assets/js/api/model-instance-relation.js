import request from './request'

//查看模型实例的关系列表
export function getInstanceRelationList(instanceId) {
  return request({
    url: `/instance/${instanceId}/relation`,
    method: 'GET'
  })
}

//添加模型实例间的关系
export function createInstanceRelation(instanceId, data) {
  return request({
    url: `/instance/${instanceId}/relation`,
    method: 'POST',
    data
  })
}

//删除模型实例间的关系
export function deleteInstanceRelation(instanceId, relationId) {
  return request({
    url: `/instance/${instanceId}/relation/${relationId}`,
    method: 'DELETE'
  })
}
