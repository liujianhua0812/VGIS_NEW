const router = require('koa-router')()
const FieldController = require('../../../controllers').tables.field

router.get('/', FieldController.showField)

router.post('/', FieldController.createField)

router.put('/:fieldId', FieldController.updateField)

router.delete('/:fieldId', FieldController.destroyField)

module.exports = router

