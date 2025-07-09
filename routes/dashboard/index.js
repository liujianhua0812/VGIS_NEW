const router = require('koa-router')()
const DashboardTemplateRouter = require('./template')
const DashboardController = require('../../controllers').dashboard

router.use('/template', DashboardTemplateRouter.routes(), DashboardTemplateRouter.allowedMethods())

router.get('/', DashboardController.index)

router.get('/:dashboardId', DashboardController.show)

router.post('/', DashboardController.create)

router.put('/:dashboardId', DashboardController.update)

router.delete('/:dashboardId', DashboardController.destroy)

module.exports = router
