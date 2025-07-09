const router = require('koa-router')()
const AlertController = require('../../../controllers').model.alerts

router.get('/', AlertController.index)

module.exports = router
