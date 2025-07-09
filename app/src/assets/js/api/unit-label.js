import request from './request'

//查看单位列表
export function getUnitList(params = {}) {
  return request({
    url: `/unit`,
    method: 'GET',
    params
  })
}

//查看标签列表
export function getLabelList(params = {}) {
  return request({
    url: `/label`,
    method: 'GET',
    params
  })
}

// 新增单位
export function createUnit(data) {
  return request({
    url: `/unit`,
    method: 'POST',
    data,
  })
}

// 新增标签
export function createLabel(data) {
  return request({
    url: `/label`,
    method: 'POST',
    data,
  })
}
