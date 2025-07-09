const router = require('koa-router')()
const InstanceController = require('../../../controllers').model.instance

router.get('/', InstanceController.index)

router.get('/export', InstanceController.export)

router.post('/', InstanceController.create)

router.put('/:instanceId', InstanceController.update)

router.delete('/:instanceId', InstanceController.destroy)

module.exports = router
