import request from './request'

//查看模型列表
export function getModelList(params) {
  return request({
    url: `/model`,
    method: 'GET',
    params
  })
}

//查看模型列表
export function getModelDetail(id) {
  return request({
    url: `/model/${id}`,
    method: 'GET'
  })
}

//上传模型的3D资源文件
export function updateModel3D(id, file) {
  let data = new FormData()
  data.append("model", file)
  return request({
    url: `/model/${id}/3d`,
    method: 'PUT',
    data
  })
}

//查看模型列表
export function getModelTables(id) {
  return request({
    url: `/model/${id}/tables`,
    method: 'GET'
  })
}

// 新增模型
export function createModel(data) {
  return request({
    url: `/model`,
    method: 'POST',
    data,
  })
}

// 修改模型
export function updateModel(id, data) {
  return request({
    url: `/model/${id}`,
    method: 'PUT',
    data,
  })
}

// 删除模型
export function deleteModel(id) {
  return request({
    url: `/model/${id}`,
    method: 'DELETE',
  })
}
