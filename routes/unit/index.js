const router = require('koa-router')()
const UnitController = require('../../controllers').unit

router.get('/', UnitController.index)

module.exports = router
