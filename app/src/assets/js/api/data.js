import request from './request'
export function getWellPro(params) {
  return request({
    url: `/wells/production`,
    method: 'get',
    params
  })
}
export function getData(params) {
  return request({
    url: `/statistics`,
    method: 'get',
    params
  })
}

//获取时序序列
export function getTime(params) {
  return request({
    url: `/series/time`,
    method: 'get',
    params
  })
}

//获取井产量序列
export function getWells() {
  return request({
    url: `/series/wells`,
    method: 'get',
  })
}
//获取地层序列
export function getStrata(params) {
  return request({
    url: `/series/strata`,
    method: 'get',
    params
  })
}
// 获取生产井规划序列
export function getPlan() {
  return request({
    url: `/series/plan`,
    method: 'get',
  })
}
//获取井序列
export function getWellsLatest() {
  return request({
    url: `/series/well/latest`,
    method: 'get',
  })
}

//获取PID图
export function getPid(params) {
  return request({
    url: `/pid/${params.name}`,
    method: 'get'
  })
}
//CCTV
export function getTV() {
  return request({
    url: `/cctv`,
    method: 'get',
  })
}
//获取层级树
export function getHierarchy() {
  return request({
    url: `/hierarchy`,
    method: 'get',
  })
}

//获取兴趣点详情
export function getHierarchyInfo(params) {
  return request({
    url: `hierarchy/info`,
    method: 'get',
    params
  })
}
//获取cctv
export function getCctvInfo(params) {
  return request({
    url: `http://192.168.3.250:8090/iserver/services/data-vgis/rest/data/datasources/Majnoon/datasets/MJ_CCTV/features.json?fromIndex=1&toIndex=115`,
    method: 'get',
    params
  })
}
