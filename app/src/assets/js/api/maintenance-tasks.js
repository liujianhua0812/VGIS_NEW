
import request from './request'

export function getTaskList(params = {}) {
    return request({
        url: `/tasks/maintenance`,
        method: 'GET',
        params
    })
}

export function getGeneralTaskStat(params = {}) {
    return request({
        url: `/tasks/maintenance/stat`,
        method: 'GET',
        params
    })
}

export function getTaskStatByPeriod(params = {}) {
    return request({
        url: `/tasks/maintenance/stat/period`,
        method: 'GET',
        params
    })
}

export function getTaskDetail(taskId, params = {}) {
    return request({
        url: `/tasks/maintenance/${taskId}`,
        method: 'GET',
        params
    })
}

export function createTask (data = {}) {
    return request({
        url: `/tasks/maintenance`,
        method: 'POST',
        data
    })
}

export function updateTask(taskId, data = {}) {
    return request({
        url: `/tasks/maintenance/${taskId}`,
        method: 'PUT',
        data
    })
}

export function deleteTask(taskId) {
    return request({
        url: `/tasks/maintenance/${taskId}`,
        method: 'DELETE'
    })
}