const router = require('koa-router')()
const IconController = require('../../../controllers').instance.icon

router.get('/', IconController.show)

module.exports = router
