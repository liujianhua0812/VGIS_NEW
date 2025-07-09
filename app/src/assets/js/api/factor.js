
import request from "./request";
//获取所有模板信息
export function getConversionFactors (params) {
    return request({
        url: `/factors`,
        method: 'GET',
        params
    })
}

export function getFactorValues (params) {
    return request({
        url: `/factors/values`,
        method: 'GET',
        params
    })
}

export function getEffectiveFactorValues (params) {
    return request({
        url: `/factors/values/current`,
        method: 'GET',
        params
    })
}

export function createFactorValue (data) {
    return request({
        url: `/factors/values`,
        method: 'POST',
        data
    })
}

export function updateFactorValue (recordId, data) {
    return request({
        url: `/factors/values/${recordId}`,
        method: 'PUT',
        data
    })
}

export function deleteFactorValue (recordId) {
    return request({
        url: `/factors/values/${recordId}`,
        method: 'DELETE'
    })
}