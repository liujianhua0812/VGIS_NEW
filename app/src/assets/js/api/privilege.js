import request from './request'

//获取模块
export function getResources() {
  return request({
    url: `/role/resource`,
    method: 'get',
  })
}

//获取操作类型 /role/action
export function getActions() {
  return request({
    url: `/role/action`,
    method: 'get'
  })
}

//查看角色
export function getRole(params) {
  return request({
    url: `/role`,
    method: 'get',
    params
  })
}

//创建角色
export function addRole(data) {
  return request({
    url: `/role`,
    method: 'post',
    data,
  })
}

//修改角色
export function updateRole(roleId, data) {
  return request({
    url: `/role/${roleId}`,
    method: 'put',
    data,
  })
}

// 批量分配权限
export function assignRole(roleId, accountNos) {
  return request({
    url: `/role/${roleId}/account`,
    method: 'PUT',
    data: {
      accountNos
    }
  })
}

export function deleteRole(roleId) {
  return request({
    url: `/role/${roleId}`,
    method: 'delete',
  })
}
