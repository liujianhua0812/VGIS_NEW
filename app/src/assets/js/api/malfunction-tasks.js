
import request from './request'

export function getTaskList(params = {}) {
    return request({
        url: `/tasks/malfunction`,
        method: 'GET',
        params
    })
}

export function getGeneralTaskStat(params = {}) {
    return request({
        url: `/tasks/malfunction/stat`,
        method: 'GET',
        params
    })
}

export function getTaskStatByPeriod(params = {}) {
    return request({
        url: `/tasks/malfunction/stat/period`,
        method: 'GET',
        params
    })
}

export function getTaskStatByLevel(params = {}) {
    return request({
        url: `/tasks/malfunction/stat/level`,
        method: 'GET',
        params
    })
}


export function getTaskDetail(taskId, params = {}) {
    return request({
        url: `/tasks/malfunction/${taskId}`,
        method: 'GET',
        params
    })
}

export function createTask (data = {}) {
    return request({
        url: `/tasks/malfunction`,
        method: 'POST',
        data
    })
}

export function updateTask(taskId, data = {}) {
    return request({
        url: `/tasks/malfunction/${taskId}`,
        method: 'PUT',
        data
    })
}

export function deleteTask(taskId) {
    return request({
        url: `/tasks/malfunction/${taskId}`,
        method: 'DELETE'
    })
}