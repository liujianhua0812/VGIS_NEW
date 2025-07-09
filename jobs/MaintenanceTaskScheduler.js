
class MaintenanceTaskScheduler {

    constructor(db) {
        this.db = db
    }

    getCrontabInfo (record) {
        if (!record.periodical) {

        }
    }

    async loadAll () {
        let Schedule = this.db.models.maintenance_schedule
        let records = await Schedule.findAll({
            where: {
                enabled: true
            }
        })

    }

}