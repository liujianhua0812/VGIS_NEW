let synchronizer = require('../libs/sync')

module.exports = {
    handler: async () => {
        console.log(`Start Sync at [${new Date()}]`)
        // await synchronizer.sync(global.db)
    },
    timer: '0 0 * * * *'
}
