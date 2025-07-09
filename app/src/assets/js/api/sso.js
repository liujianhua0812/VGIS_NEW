import request from './request'

export function getUserStatus () {
  return request({
    url: `/user/session`,
    method: 'GET'
  })
}

export function getUserInfo (params) {
  return request({
    url: `/user/info`,
    method: 'GET',
    params
  })
}

export function getApplication () {
  return request({
    url: `/application`,
    method: 'GET'
  })
}

export function getNews () {
  return request({
    url: `/news`,
    method: 'GET'
  })
}

export function getTodoList () {
  return request({
    url: `/todo`,
    method: 'GET'
  })
}

export function getSessionStatus () {
  return request({
    url: `/user/session`,
    method: 'GET'
  })
}

export function signIn (data) {
  return request({
    url: `/user/session`,
    method: 'POST',
    data
  })
}

export function signOut () {
  return request({
    url: `/user/session`,
    method: 'DELETE'
  })
}
