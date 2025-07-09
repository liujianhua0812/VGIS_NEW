import request from './request'

export function getGeneralStat () {
    return request({
        url: `/stat/general`,
        method: 'GET'
    })
}

export function getSeriesStat (params) {
    return request({
        url: `/stat/series`,
        method: 'GET',
        params
    })
}

export function getInstanceStat () {
    return request({
        url: `/stat/instance`,
        method: 'GET'
    })
}

export function getAlertStat () {
    return request({
        url: `/stat/alert`,
        method: 'GET'
    })
}