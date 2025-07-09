const router = require('koa-router')()
const AttributeController = require('../../../controllers').model.attribute

router.get('/', AttributeController.index)

router.post('/', AttributeController.create)

router.put('/:attributeId', AttributeController.update)

router.delete('/:attributeId', AttributeController.destroy)

module.exports = router
