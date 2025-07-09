const router = require('koa-router')()
const AlertTemplateController = require('../../controllers').alert_template

router.get('/', AlertTemplateController.index)

module.exports = router
