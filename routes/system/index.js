const router = require('koa-router')()
const SystemController = require('../../controllers').system

router.get('/', SystemController.show)

router.put('/', SystemController.update)

module.exports = router
