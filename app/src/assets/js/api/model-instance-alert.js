import request from './request'

export function getAlertList(instanceId, params) {
  return request({
    url: `/instance/${instanceId}/alerts`,
    method: 'GET',
    params
  })
}

export function checkAlert(instanceId, alertId) {
  return request({
    url: `/instance/${instanceId}/alerts/${alertId}/check`,
    method: 'PUT'
  })
}

export function removeAlert(instanceId, alertId) {
  return request({
    url: `/instance/${instanceId}/alerts/${alertId}`,
    method: 'DELETE'
  })
}
