
import request from "./request";

export function getAssetTypes (params) {
    return request({
        url: `/asset_types`,
        method: 'GET',
        params
    })
}

export function getAssetStat (params) {
    return request({
        url: `/carbon_assets/stat`,
        method: 'GET',
        params
    })
}

export function getCarbonAssetsList (params) {
    return request({
        url: `/carbon_assets`,
        method: 'GET',
        params
    })
}

export function createCarbonAsset (data) {
    return request({
        url: `/carbon_assets`,
        method: 'POST',
        data
    })
}

export function updateCarbonAsset (assetId, data) {
    return request({
        url: `/carbon_assets/${assetId}`,
        method: 'PUT',
        data
    })
}

export function deleteCarbonAsset (assetId) {
    return request({
        url: `/carbon_assets/${assetId}`,
        method: 'DELETE'
    })
}

export function bulkDeleteCarbonAsset (params) {
    return request({
        url: `/carbon_assets`,
        method: 'DELETE',
        params
    })
}