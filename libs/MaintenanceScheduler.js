const {Op} = require("sequelize");
const Scheduler = require('node-schedule');
const cronstrue = require('cronstrue/i18n');

class MaintenanceScheduler {

    constructor(db) {
        this.db = db
        this.scheduleMap = {}
    }

    async loadSchedule () {
        let Schedule = global.db.models.maintenance_schedule
        let PersonRelation = global.db.models.person_relation
        let DeviceRelation = global.db.models.device_relation
        let User = global.db.models.user
        let schedules = await Schedule.findAll({
            where: {
                enabled: true,
                [Op.or]: [{
                    periodical: true,
                    endAt: null
                }, {
                    periodical: true,
                    endAt: {
                        [Op.gt]: new Date()
                    }
                }, {
                    periodical: false,
                    scheduledAt: {
                        [Op.gt]: new Date()
                    }
                }]
            },
            include: [PersonRelation, DeviceRelation],
        })
        this.scheduleMap = {}
        for(let i = 0; i < schedules.length; i++) {
            this.addSchedule(schedules[i])
        }
    }

    addSchedule (schedule) {
        if (this.scheduleMap[schedule.id]) {
            this.updateSchedule(schedule)
        }
        else {
            this.scheduleMap[schedule.id] = this.setJobAccordingToSchedule(schedule)
        }
    }

    updateSchedule (schedule) {
        this.removeSchedule(schedule)
        this.addSchedule(schedule)
    }

    removeSchedule (schedule) {
        if (this.scheduleMap[schedule.id]) {
            this.stopJobForSchedule(schedule.id)
        }
        delete this.scheduleMap[schedule.id]
    }

    bulkRemoveSchedule (scheduleIds = []) {
        for(let i = 0; i < scheduleIds.length; i++) {
            let scheduleId = scheduleIds[i]
            if (this.scheduleMap[scheduleId]) {
                this.stopJobForSchedule(scheduleId)
            }
            delete this.scheduleMap[scheduleId]
        }
    }

    translateSchedule (schedule) {
        if (schedule.periodical) {
            return cronstrue.toString(schedule.period, { locale: "zh_CN" })
        }
        else {
            return schedule.scheduledAt
        }
    }

    stopJobForSchedule (scheduleId) {
        let jobs = this.scheduleMap[scheduleId] || []
        for(let i = 0; i < jobs.length; i++) {
            jobs[i].cancel()
        }
    }

    getPresetTaskJobFromSchedule (schedule) {
        let that = this
        return async function () {
            that.scheduleMap[schedule.id].push(Scheduler.scheduleJob(schedule.period, that.getCreateTaskJobFromSchedule(schedule)))
        }
    }

    getStopTaskJobFromSchedule (schedule) {
        let that = this
        return async function () {
            that.stopJobForSchedule(schedule.id)
        }
    }

    getCreateTaskJobFromSchedule (schedule) {
        return async function () {
            let Task = global.db.models.maintenance_task
            let PersonRelation = global.db.models.person_relation
            let DeviceRelation = global.db.models.device_relation
            let Instance = global.db.models.model_instance

            let transaction = await global.db.transaction()
            let record = await Task.create({
                description: schedule.description,
                status: "pending"
            }, {
                transaction
            })
            if (schedule.person_relations.length > 0) {
                await PersonRelation.bulkCreate(schedule.person_relations.map(item => ({
                    userId: item.userId,
                    mTaskId: record.id
                })), {
                    transaction
                })
            }
            if (schedule.device_relations.length > 0) {
                await DeviceRelation.bulkCreate(schedule.device_relations.map(item => ({
                    instanceId: item.instanceId,
                    mTaskId: record.id
                })), {
                    transaction
                })
            }
            try {
                await transaction.commit()
            }
            catch (err) {
                await transaction.rollback()
            }
        }
    }

    setJobAccordingToSchedule(schedule) {
        let result = []
        let now = new Date()
        if (schedule.periodical) {
            console.log("Periodical task scheduled!")
            if (schedule.startAt > now) {
                result.push(Scheduler.scheduleJob(schedule.startAt, this.getPresetTaskJobFromSchedule(schedule)))
            }
            else {
                result.push(Scheduler.scheduleJob(schedule.period, this.getCreateTaskJobFromSchedule(schedule)))
            }
            if (schedule.endAt && schedule.endAt > now) {
                result.push(Scheduler.scheduleJob(schedule.endAt, this.getStopTaskJobFromSchedule(schedule)))
            }
        }
        else {
            console.log("Irregular task scheduled!")
            result.push(Scheduler.scheduleJob(schedule.scheduledAt, this.getCreateTaskJobFromSchedule(schedule)))
        }
        return result
    }
}

module.exports = MaintenanceScheduler