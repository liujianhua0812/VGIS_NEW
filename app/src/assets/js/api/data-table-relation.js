import request from './request'

//查看关系列表
export function getRelationList(tableId, params) {
  return request({
    url: `/tables/${tableId}/relations`,
    method: 'GET',
    params
  })
}

//查看关系详情
export function getRelationDetail(tableId) {
  return request({
    url: `/tables/${tableId}/relations`,
    method: 'GET'
  })
}

// 新增关系
export function createRelation(tableId, data) {
  return request({
    url: `/tables/${tableId}/relations`,
    method: 'POST',
    data,
  })
}

// 修改关系
export function updateRelation(tableId, fieldId, data) {
  return request({
    url: `/tables/${tableId}/relations/${fieldId}`,
    method: 'PUT',
    data,
  })
}

// 删除模型
export function deleteRelation(tableId, fieldId) {
  return request({
    url: `/tables/${tableId}/relations/${fieldId}`,
    method: 'DELETE',
  })
}
