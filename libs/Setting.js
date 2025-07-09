
module.exports = {
    async getSetting () {
        let System = global.db.models.system
        let setting = await System.findOne()
        try {
            setting = JSON.parse(setting.setting)
        }
        catch(err) {
            setting = {}
        }
        return setting
    },
    async getLocale () {
        let System = global.db.models.system
        let setting = await System.findOne()
        try {
            setting = JSON.parse(setting.setting)
        }
        catch(err) {
            setting = {}
        }
        return setting.language || "en"
    }
}