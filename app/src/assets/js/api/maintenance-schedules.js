
import request from './request'

export function getScheduleList(params = {}) {
    return request({
        url: `/schedules/maintenance`,
        method: 'GET',
        params
    })
}

export function getScheduleCalendar(params = {}) {
    return request({
        url: `/schedules/maintenance/calendar`,
        method: 'GET',
        params
    })
}

export function createSchedule (data = {}) {
    return request({
        url: `/schedules/maintenance`,
        method: 'POST',
        data
    })
}

export function updateSchedule (scheduleId, data = {}) {
    return request({
        url: `/schedules/maintenance/${scheduleId}`,
        method: 'PUT',
        data
    })
}

export function deleteSchedule (scheduleId) {
    return request({
        url: `/schedules/maintenance/${scheduleId}`,
        method: 'DELETE'
    })
}

export function bulkDeleteSchedule (params) {
    return request({
        url: `/schedules/maintenance`,
        method: 'DELETE',
        params
    })
}