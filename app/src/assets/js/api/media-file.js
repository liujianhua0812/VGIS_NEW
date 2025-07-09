import request from './request'

//查看文件列表
export function getFileTypes() {
  return request({
    url: `/media/type`,
    method: 'GET'
  })
}

//查看文件列表
export function getFileList(params) {
    return request({
        url: `/media`,
        method: 'GET',
        params
    })
}

//查看文件内容
export function getFile(id) {
  return request({
    url: `/media/${id}`,
    method: 'GET',
    responseType: 'blob'
  })
}

export function uploadFile(data){
  return request({
    url: `/media`,
    method: 'POST',
    data: data
  })
}

export function removeFile(id){
    return request({
        url: `/media/${id}`,
        method: 'DELETE'
    })
}
