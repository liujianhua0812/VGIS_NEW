import request from './request'

export function getDiagrams(params) {
  return request({
    url: `/pid`,
    method: 'get',
    params
  })
}

export function getDiagram(diagramId) {
  return request({
    url: `/pid/${diagramId}`,
    method: 'get',
  })
}

export function uploadPID(data) {
  let formData = new FormData();
  for(let key in data) {
    formData.append(key, data[key]);
  }
  return request({
    url: `/pid`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function updateDiagram(diagramId, data) {
  return request({
    url: `/pid/${diagramId}`,
    method: 'PUT',
    data
  })
}

export function removeDiagram(diagramId) {
  return request({
    url: `/pid/${diagramId}`,
    method: 'DELETE'
  })
}

export function getDiagramPoints (diagramId) {
  return request({
    url: `/pid/${diagramId}/points`,
    method: 'GET'
  })
}

export function executeDiagramPoint (diagramId, pointId, data) {
  return request({
    url: `/pid/${diagramId}/points/${pointId}/execute`,
    method: 'POST',
    data
  })
}