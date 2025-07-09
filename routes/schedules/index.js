const router = require('koa-router')()
const MaintenanceScheduleRouter = require('./maintenance')
const DeviceScheduleRouter = require('./device')

router.use('/maintenance', MaintenanceScheduleRouter.routes(), MaintenanceScheduleRouter.allowedMethods())

router.use('/device', DeviceScheduleRouter.routes(), DeviceScheduleRouter.allowedMethods())

module.exports = router
