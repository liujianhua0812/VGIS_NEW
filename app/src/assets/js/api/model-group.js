import request from './request'

//查看模型分组列表
export function getModelGroupList(params) {
  return request({
    url: `/model_group`,
    method: 'GET',
    params
  })
}

// 新增模型分组
export function createModelGroup(data) {
  return request({
    url: `/model_group`,
    method: 'POST',
    data,
  })
}

// 修改模型分组
export function updateModelGroup(id, data) {
  return request({
    url: `/model_group/${id}`,
    method: 'PUT',
    data,
  })
}

// 删除模型分组
export function deleteModelGroup(id) {
  return request({
    url: `/model_group/${id}`,
    method: 'DELETE',
  })
}
