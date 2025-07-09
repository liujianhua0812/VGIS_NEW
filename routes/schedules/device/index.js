const router = require('koa-router')()
const DeviceScheduleController = require('../../../controllers').schedules.device

router.get('/', DeviceScheduleController.index)

router.get('/calendar', DeviceScheduleController.calendar)

router.post('/', DeviceScheduleController.create)

router.put('/:scheduleId', DeviceScheduleController.update)

router.delete('/:scheduleId', DeviceScheduleController.destroy)

router.delete('/', DeviceScheduleController.bulkDestroy)

module.exports = router
