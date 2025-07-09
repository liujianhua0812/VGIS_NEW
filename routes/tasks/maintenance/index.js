const router = require('koa-router')()
const MaintenanceTaskController = require('../../../controllers').tasks.maintenance

router.get('/', MaintenanceTaskController.index)

router.get('/stat', MaintenanceTaskController.generalStat)

router.get('/stat/period', MaintenanceTaskController.periodStat)

router.get('/:taskId', MaintenanceTaskController.show)

router.post('/', MaintenanceTaskController.create)

router.put('/:taskId', MaintenanceTaskController.update)

router.delete('/:taskId', MaintenanceTaskController.destroy)

module.exports = router
