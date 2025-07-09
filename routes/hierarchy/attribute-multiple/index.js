const router = require('koa-router')()
const AttributeController = require('../../../controllers').hierarchy.attribute_multiple

router.post('/', AttributeController.index)

module.exports = router
