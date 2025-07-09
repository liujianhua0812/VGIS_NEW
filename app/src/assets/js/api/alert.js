import request from './request'

//查看岗位列表
export function getAlertList(params = {}) {
    return request({
        url: `/alert`,
        method: 'GET',
        params
    })
}