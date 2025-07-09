import request from './request'

//查看模型静态属性列表
export function getStaticAttributeList(modelId, params) {
  return request({
    url: `/model/${modelId}/attribute`,
    method: 'GET',
    params
  })
}

// 新增模型静态属性
export function createStaticAttribute(modelId, data) {
  return request({
    url: `/model/${modelId}/attribute`,
    method: 'POST',
    data
  })
}

// 修改模型静态属性
export function updateStaticAttribute(modelId, attributeId, data) {
  return request({
    url: `/model/${modelId}/attribute/${attributeId}`,
    method: 'PUT',
    data,
  })
}

// 删除模型静态属性
export function deleteStaticAttribute(modelId, attributeId) {
  return request({
    url: `/model/${modelId}/attribute/${attributeId}`,
    method: 'DELETE',
  })
}
