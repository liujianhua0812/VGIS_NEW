const router = require('koa-router')()
const DashboardTemplateController = require('../../../controllers').dashboard.template

router.get('/', DashboardTemplateController.index)

router.get('/:templateId', DashboardTemplateController.show)

router.post('/', DashboardTemplateController.create)

router.put('/:templateId', DashboardTemplateController.update)

router.delete('/:templateId', DashboardTemplateController.destroy)

module.exports = router
