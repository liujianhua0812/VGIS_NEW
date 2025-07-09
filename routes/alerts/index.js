const router = require('koa-router')()
const AlertController = require('../../controllers').alert

router.get('/', AlertController.index)

router.get('/:alertId', AlertController.update)

module.exports = router
