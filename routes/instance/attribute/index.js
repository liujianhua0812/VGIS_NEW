const router = require('koa-router')()
const AttributeValueController = require('../../../controllers').instance.attribute

router.get('/', AttributeValueController.index)

router.put('/:attributeId', AttributeValueController.update)

router.delete('/:attributeId', AttributeValueController.destroy)

module.exports = router
