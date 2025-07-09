import request from './request'

export function getMonthlyReports(params) {
  return request({
    url: `/report/monthly`,
    method: 'get',
    params
  })
}

export function getMonthlyReport(date) {
  return request({
    url: `/report/monthly/${date.format('yyyy-MM-dd')}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function uploadMonthlyReport(data) {
  let formData = new FormData();
  for(let key in data) {
    formData.append(key, data[key]);
  }
  return request({
    url: `/report/monthly`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function removeMonthlyReport(date) {
  return request({
    url: `/report/monthly/${date.format('yyyy-MM-dd')}`,
    method: 'delete'
  })
}
