const router = require('koa-router')()
const DashboardGroupController = require('../../controllers').dashboard_group

router.post('/', DashboardGroupController.create)

router.put('/:groupId', DashboardGroupController.update)

router.delete('/:groupId', DashboardGroupController.destroy)

module.exports = router
