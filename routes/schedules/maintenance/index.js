const router = require('koa-router')()
const MaintenanceScheduleController = require('../../../controllers').schedules.maintenance

router.get('/', MaintenanceScheduleController.index)

router.get('/calendar', MaintenanceScheduleController.calendar)

router.post('/', MaintenanceScheduleController.create)

router.put('/:scheduleId', MaintenanceScheduleController.update)

router.delete('/:scheduleId', MaintenanceScheduleController.destroy)

router.delete('/', MaintenanceScheduleController.bulkDestroy)

module.exports = router
