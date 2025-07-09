const router = require('koa-router')()
const AlertController = require('../../../controllers').instance.alerts

router.get('/', AlertController.index)

router.put('/:alertId/check', AlertController.update)

router.delete('/:alertId', AlertController.destroy)

module.exports = router
