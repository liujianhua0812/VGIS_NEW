const router = require('koa-router')()
const AttributeController = require('../../../controllers').hierarchy.attributes

router.post('/', AttributeController.index)

module.exports = router
