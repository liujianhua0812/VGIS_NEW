const router = require('koa-router')()
const PowerAdviceController = require('../../controllers').power

router.get('/', PowerAdviceController.index)

module.exports = router
