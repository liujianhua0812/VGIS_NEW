import request from './request'

// 查看告警模板列表
export function getAlertTemplateList(modelId, params) {
    return request({
        url: `/model/${modelId}/alert_templates`,
        method: 'GET',
        params
    })
}

// 创建告警模板
export function createAlertTemplate(modelId, data) {
    return request({
        url: `/model/${modelId}/alert_templates`,
        method: 'POST',
        data
    })
}

// 更新告警模板
export function updateAlertTemplate(modelId, templateId, data) {
    return request({
        url: `/model/${modelId}/alert_templates/${templateId}`,
        method: 'PUT',
        data
    })
}

// 删除告警模板
export function removeAlertTemplate(modelId, templateId) {
    return request({
        url: `/model/${modelId}/alert_templates/${templateId}`,
        method: 'DELETE'
    })
}