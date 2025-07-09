const router = require('koa-router')()
const AlertTemplateController = require('../../../controllers').model.alert_templates

router.get('/', AlertTemplateController.index)

router.post('/', AlertTemplateController.create)

router.put('/:templateId', AlertTemplateController.update)

router.delete('/:templateId', AlertTemplateController.destroy)

module.exports = router
