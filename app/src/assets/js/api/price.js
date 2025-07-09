
import request from "./request";
//获取所有模板信息

export function getGeneralPrice (params) {
    return request({
        url: `/price/general`,
        method: 'GET',
        params
    })
}

export function createPriceRecord (data) {
    return request({
        url: `/price/general`,
        method: 'POST',
        data
    })
}

export function updatePriceRecord (recordId, data) {
    return request({
        url: `/price/general/${recordId}`,
        method: 'PUT',
        data
    })
}

export function deletePriceRecord (recordId) {
    return request({
        url: `/price/general/${recordId}`,
        method: 'DELETE'
    })
}

export function getElectricityPrice (params) {
    return request({
        url: `/price/electricity`,
        method: 'GET',
        params
    })
}

export function updateElectricityPriceRecord (data) {
    return request({
        url: `/price/electricity`,
        method: 'PUT',
        data
    })
}

export function deleteElectricityPriceRecord (recordId) {
    return request({
        url: `/price/electricity/${recordId}`,
        method: 'DELETE'
    })
}