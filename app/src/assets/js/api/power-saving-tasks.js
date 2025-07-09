
import request from './request'

export function getTaskList(params = {}) {
    return request({
        url: `/tasks/power`,
        method: 'GET',
        params
    })
}

export function getGeneralTaskStat(params = {}) {
    return request({
        url: `/tasks/power/stat`,
        method: 'GET',
        params
    })
}

export function getTaskStatByPeriod(params = {}) {
    return request({
        url: `/tasks/power/stat/period`,
        method: 'GET',
        params
    })
}

export function getTaskStatByModule(params = {}) {
    return request({
        url: `/tasks/power/stat/module`,
        method: 'GET',
        params
    })
}

export function getTaskDetail(taskId, params = {}) {
    return request({
        url: `/tasks/power/${taskId}`,
        method: 'GET',
        params
    })
}

export function createTask (data = {}) {
    return request({
        url: `/tasks/power`,
        method: 'POST',
        data
    })
}

export function updateTask(taskId, data = {}) {
    return request({
        url: `/tasks/power/${taskId}`,
        method: 'PUT',
        data
    })
}

export function deleteTask(taskId) {
    return request({
        url: `/tasks/power/${taskId}`,
        method: 'DELETE'
    })
}