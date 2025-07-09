const router = require('koa-router')()
const LabelController = require('../../controllers').label

router.get('/', LabelController.index)

module.exports = router
