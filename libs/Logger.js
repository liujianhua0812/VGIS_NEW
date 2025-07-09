
class Logger {

    constructor(db) {
        this.db = db
    }

    async writeLog(actor, ip, data, model, instanceId) {
        let Log = this.db.models.log
        let log = new Log({
            actor: actor.id,
            ip,
            data,
            model,
            instanceId
        })
        await log.save()
    }

}

module.exports = Logger