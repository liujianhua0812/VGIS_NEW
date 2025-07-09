
class SeriesDataWriter {

    constructor(database, config = { interval: 3000 }) {
        this.database = database
        this.config = config
        this.cache = []
        // TODO: 实现明白了再搞这块
        // setInterval(this.flushRecords.bind(this), this.config.interval || 3000)
    }

    addRecords (records) {
        this.cache = this.cache.concat(records)
    }

    async flushRecords () {
        if (this.cache.length === 0) {
            return
        }
        await this.database.models.series_value.bulkCreate(this.cache)
        this.cache = []
    }
}

module.exports = SeriesDataWriter