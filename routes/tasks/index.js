const router = require('koa-router')()
const PowerTaskRouter = require('./power')
const MaintenanceTaskRouter = require('./maintenance')
const MalfunctionTaskRouter = require('./malfunction')

router.use('/power', PowerTaskRouter.routes(), PowerTaskRouter.allowedMethods())

router.use('/maintenance', MaintenanceTaskRouter.routes(), MaintenanceTaskRouter.allowedMethods())

router.use('/malfunction', MalfunctionTaskRouter.routes(), MalfunctionTaskRouter.allowedMethods())

module.exports = router
