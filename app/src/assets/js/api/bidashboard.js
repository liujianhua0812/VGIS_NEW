import request from './request'

// 获取所有数据面板
export function getDashboardList(param) {
  return request({
    url: `/dashboard`,
    method: 'get',
    params: param
  })
}

// 获取某个数据面板的详情
export function getDashboardDetail(param){
  let dashboardId = param.id
  return request({
    url: `/dashboard/${dashboardId}`,
    method: 'get',
  })
}

// 添加新面板
export function addNewDashboard(data){
  return request({
    url: `/dashboard`,
    method: 'post',
    data: data
  })
}

// 更新面板信息
export function updateDashboardDetail(param){
  return request({
    url: `/dashboard/${param.id}`,
    method: 'put',
    data: param
  })
}

// 删除面板
export function delDashboard(param){
  let dashboardId = param.id
  return request({
    url: `/dashboard/${dashboardId}`,
    method: 'delete'
  })
}

// 添加分组
export function addDashboardGroup(data){
  return request({
    url: `/dashboard_group`,
    method: 'post',
    data: data
  })
}

// 修改分组
export function updateDashboardGroup(param){
  return request({
    url: `/dashboard_group/${param.id}`,
    method: 'put',
    data: param
  })
}

// 删除分组
export function delDashboardGroup(param){
  let dashboardId = param.id
  return request({
    url: `/dashboard_group/${dashboardId}`,
    method: 'delete'
  })
}


