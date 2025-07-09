import request from './request'

//查看岗位列表
export function getAlertTemplateList(params = {}) {
    return request({
        url: `/alert_template`,
        method: 'GET',
        params
    })
}