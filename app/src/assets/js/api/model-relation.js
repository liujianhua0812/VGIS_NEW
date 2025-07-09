import request from './request'

//查看模型动态点位列表
export function getModelRelationList(modelId, params) {
  return request({
    url: `/model/${modelId}/relation`,
    method: 'GET',
    params
  })
}

// 新增模型动态点位
export function createModelRelation(modelId, data) {
  return request({
    url: `/model/${modelId}/relation`,
    method: 'POST',
    data
  })
}

// 修改模型动态点位
export function updateModelRelation(modelId, relationId, data) {
  return request({
    url: `/model/${modelId}/relation/${relationId}`,
    method: 'PUT',
    data,
  })
}

// 删除模型动态点位
export function deleteModelRelation(modelId, relationId) {
  return request({
    url: `/model/${modelId}/relation/${relationId}`,
    method: 'DELETE',
  })
}
