import request from './request'

//查看岗位列表
export function getAlertLevelList(params = {}) {
    return request({
        url: `/alert_level`,
        method: 'GET',
        params
    })
}