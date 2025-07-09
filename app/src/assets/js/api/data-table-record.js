import request from './request'

//查看记录列表
export function getRecordList(tableId, params, data) {
  return request({
    url: `/tables/${tableId}/records/list`,
    method: 'POST',
    params,
    data
  })
}

export function getRecordListFromModel(modelId, tableId, params, data) {
  return request({
    url: `/model/${modelId}/tables/${tableId}/records`,
    method: 'POST',
    params,
    data
  })
}

export function getRecordListFromInstance(instanceId, tableId, params, data) {
  return request({
    url: `/instance/${instanceId}/tables/${tableId}/records`,
    method: 'POST',
    params,
    data
  })
}

//查看记录
export function getRecordDetail(tableId) {
  return request({
    url: `/tables/${tableId}/records`,
    method: 'GET'
  })
}

// 新增记录
export function createRecord(tableId, data) {
  return request({
    url: `/tables/${tableId}/records`,
    method: 'POST',
    data,
  })
}

// 修改记录
export function updateRecord(tableId, recordId, data) {
  return request({
    url: `/tables/${tableId}/records/${recordId}`,
    method: 'PUT',
    data,
  })
}

// 删除记录
export function deleteRecord(tableId, recordId) {
  return request({
    url: `/tables/${tableId}/records/${recordId}`,
    method: 'DELETE',
  })
}
