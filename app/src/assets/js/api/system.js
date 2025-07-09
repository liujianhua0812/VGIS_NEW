import request from './request'

export function getSetting() {
  return request({
    url: `/system`,
    method: 'GET'
  })
}

export function updateSetting(data) {
  let formData = new FormData()
  formData.append("setting", JSON.stringify(data.setting))
  formData.append("model", data.model)
  return request({
    url: `/system`,
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}
