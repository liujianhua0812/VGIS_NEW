import request from './request'


export function getSeriesCustomization(modelId, instanceId, seriesId, params) {
  return request({
    url: `/instance/${instanceId}/series/${seriesId}/configuration`,
    method: 'GET',
    params
  })
}

export function updateSeriesCustomization(modelId, instanceId, seriesId, data) {
  return request({
    url: `/instance/${instanceId}/series/${seriesId}/configuration`,
    method: 'PUT',
    data
  })
}

export function clearSeriesCustomization(modelId, instanceId, seriesId) {
  return request({
    url: `/instance/${instanceId}/series/${seriesId}/configuration`,
    method: 'DELETE'
  })
}

//查看模型动态点位值域列表
export function getSeriesDomain(modelId, instanceId, seriesId, params) {
  return request({
    url: `/instance/${instanceId}/series/${seriesId}/domain`,
    method: 'GET',
    params
  })
}

//查看对象时序数据（列表形式）
export function getInstanceSeriesValueList(instanceId, params = {}) {
  return request({
    url: `/instance/${instanceId}/series`,
    method: 'GET',
    params
  })
}

//查看对象时序数据（卡片）
export function getInstanceSeriesLatestValue(instanceId, params = {}) {
  return request({
    url: `/instance/${instanceId}/series/latest`,
    method: 'GET',
    params
  })
}

//查看对象时序数据（列表形式）
export function getInstanceSingleSeriesValue(instanceId, seriesId, params = {}) {
  return request({
    url: `/instance/${instanceId}/series/${seriesId}`,
    method: 'GET',
    params
  })
}

//查看对象时序数据（列表形式）
export function getInstanceSingleSeriesImportTemplate(instanceId, seriesId) {
  return request({
    url: `/instance/${instanceId}/series/${seriesId}/import`,
    method: 'GET',
    responseType: "blob"
  })
}

//查看对象时序数据（列表形式）
export function importInstanceSeriesValue(instanceId, seriesId, file) {
  let formData = new FormData()
  formData.append('template', file)
  return request({
    url: `/instance/${instanceId}/series/${seriesId}/import`,
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: formData
  })
}

// 新增数据记录
export function createInstanceSeriesValue(instanceId, data) {
  return request({
    url: `/instance/${instanceId}/series`,
    method: 'POST',
    data,
  })
}

// 新增数据记录
export function updateInstanceSeriesValue(instanceId, data) {
  return request({
    url: `/instance/${instanceId}/series`,
    method: 'PUT',
    data,
  })
}

// 删除数据记录
export function deleteInstanceSeriesValue(instanceId, data) {
  return request({
    url: `/instance/${instanceId}/series`,
    method: 'DELETE',
    data
  })
}
