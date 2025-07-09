import request from './request'

//查看岗位列表
export function getJobList() {
  return request({
    url: `/user/job`,
    method: 'get',
  })
}

//查看组织列表
export function getOrgList() {
  return request({
    url: `/user/org`,
    method: 'get',
  })
}

//查看账号列表
export function getUserList(params) {
  return request({
    url: `/user`,
    method: 'get',
    params
  })
}

//创建账号
export function addUser(params) {
  return request({
    url: `/user`,
    method: 'post',
    data: params,
  })
}

//修改账号
export function editUser(params) {
  var accountNo = params.accountNo;
  delete params.accountNo;
  return request({
    url: `/user/${accountNo}`,
    method: 'put',
    data: params,
  })
}

export function getRoleResource() {
  return request({
    url: `/role/resource`,
    method: 'get',

  })
}

//获取操作类型 /role/action
export function getRoleAction() {
  return request({
    url: `/role/action`,
    method: 'get'
  })
}

//查看角色
export function getRole() {
  return request({
    url: `/role`,
    method: 'get',

  })
}

//创建角色
export function addRole(params) {
  return request({
    url: `/role`,
    method: 'post',
    data: params,
  })
}

//修改角色
export function editRole(params) {
  var roleId = params.id;
  delete params.id;
  return request({
    url: `/role/${roleId}`,
    method: 'put',
    data: params,
  })
}

export function uploadRoute(data) {
  let formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return request({
    url: `/roaming`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function deleteRole(roleId) {
  return request({
    url: `/role/${roleId}`,
    method: 'delete',
  })
}

export function updatePassword (data) {
  return request({
    url: `/user/password`,
    method: 'PUT',
    data
  })
}
