let redis = require('koa-redis')

class DataCache {

    constructor() {
        this.cache = {}
    }

    setCache(key, value, expiredIn = 60 * 5 * 1000) {
        let now = new Date(new Date().getTime() + expiredIn)

        this.cache[key] = {
            data: value,
            expiredAt: now
        }
    }

    getCache(key) {
        let now = new Date()
        return this.cache[key] && this.cache[key].expiredAt >= now ? this.cache[key].data : null
    }
}

module.exports = DataCache