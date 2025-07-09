import request from './request'

//查看模型动态点位列表
export function getTimeSeriesList(modelId, params) {
  return request({
    url: `/model/${modelId}/series`,
    method: 'GET',
    params
  })
}

//查看模型动态点位值域列表
export function getSeriesDomain(modelId, seriesId, params) {
  return request({
    url: `/model/${modelId}/series/${seriesId}/domain`,
    method: 'GET',
    params
  })
}

// 新增模型动态点位
export function createTimeSeries(modelId, data) {
  return request({
    url: `/model/${modelId}/series`,
    method: 'POST',
    data
  })
}

// 修改模型动态点位
export function updateTimeSeries(modelId, seriesId, data) {
  return request({
    url: `/model/${modelId}/series/${seriesId}`,
    method: 'PUT',
    data,
  })
}

// 删除模型动态点位
export function deleteTimeSeries(modelId, seriesId) {
  return request({
    url: `/model/${modelId}/series/${seriesId}`,
    method: 'DELETE',
  })
}
