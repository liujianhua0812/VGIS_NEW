import request from './request'

//查看字段列表
export function getFieldList(tableId, params) {
  return request({
    url: `/tables/${tableId}/fields`,
    method: 'GET',
    params
  })
}

//查看字段详情
export function getFieldDetail(tableId) {
  return request({
    url: `/tables/${tableId}/fields`,
    method: 'GET'
  })
}

// 新增字段
export function createField(tableId, data) {
  return request({
    url: `/tables/${tableId}/fields`,
    method: 'POST',
    data,
  })
}

// 修改字段
export function updateField(tableId, fieldId, data) {
  return request({
    url: `/tables/${tableId}/fields/${fieldId}`,
    method: 'PUT',
    data,
  })
}

// 删除模型
export function deleteField(tableId, fieldId) {
  return request({
    url: `/tables/${tableId}/fields/${fieldId}`,
    method: 'DELETE',
  })
}
