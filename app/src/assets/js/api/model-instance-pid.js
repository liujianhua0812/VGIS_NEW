import request from './request'

export function getPIDList(instanceId) {
  return request({
    url: `/instance/${instanceId}/pid`,
    method: 'get',
  })
}

export function getPID(instanceId, pidId) {
  return request({
    url: `/instance/${instanceId}/pid/${pidId}`,
    method: 'get',
  })
}

export function createPID(instanceId, data) {
  let formData = new FormData();
  for(let key in data) {
    formData.append(key, data[key]);
  }
  return request({
    url: `/instance/${instanceId}/pid`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function updatePID(instanceId, pidId, data) {
  let formData = new FormData();
  for(let key in data) {
    formData.append(key, data[key]);
  }
  return request({
    url: `/instance/${instanceId}/pid/${pidId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function deletePID(instanceId, pidId) {
  return request({
    url: `/instance/${instanceId}/pid/${pidId}`,
    method: 'DELETE'
  })
}
