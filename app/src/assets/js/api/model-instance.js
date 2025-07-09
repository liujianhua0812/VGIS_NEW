import request from './request'

//查看模型分组列表
export function getModelInstanceList(modelId, params) {
  return request({
    url: `/model/${modelId}/instance`,
    method: 'GET',
    params
  })
}

//导出模型分组列表的excel
export function downloadModelInstanceList(modelId, params) {
  return request({
    url: `/model/${modelId}/instance/export`,
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

//查看模型分组列表
export function getModelInstanceDetail(instanceId) {
  return request({
    url: `/instance/${instanceId}`,
    method: 'GET'
  })
}

//查看模型图标
export function getModelInstanceIcon(instanceId) {
  return request({
    url: `/instance/${instanceId}/icon`,
    method: 'GET'
  })
}

// 新增模型分组
export function createModelInstance(modelId, data) {
  return request({
    url: `/model/${modelId}/instance`,
    method: 'POST',
    data,
  })
}

// 修改模型分组
export function updateModelInstance(modelId, instanceId, data) {
  return request({
    url: `/model/${modelId}/instance/${instanceId}`,
    method: 'PUT',
    data,
  })
}

// 删除模型分组
export function deleteModelInstance(modelId, instanceId) {
  return request({
    url: `/model/${modelId}/instance/${instanceId}`,
    method: 'DELETE',
  })
}
