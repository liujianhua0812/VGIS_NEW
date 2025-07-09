const router = require('koa-router')()
const ThreeDController = require('../../../controllers').model.threeD

router.put('/', ThreeDController.update)

module.exports = router
