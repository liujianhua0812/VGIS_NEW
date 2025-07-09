import request from './request'

//查看模型列表
export function getTableList(params) {
  return request({
    url: `/tables`,
    method: 'GET',
    params
  })
}

//查看模型列表
export function getTableDetail(id) {
  return request({
    url: `/tables/${id}`,
    method: 'GET'
  })
}

// 新增模型
export function createTable(data) {
  return request({
    url: `/tables`,
    method: 'POST',
    data,
  })
}

// 修改模型
export function updateTable(id, data) {
  return request({
    url: `/tables/${id}`,
    method: 'PUT',
    data,
  })
}

// 删除模型
export function deleteTable(id) {
  return request({
    url: `/tables/${id}`,
    method: 'DELETE',
  })
}
