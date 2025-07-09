const router = require('koa-router')()
const ConfigurationController = require('../../../../controllers').instance.series.configure

router.get('/', ConfigurationController.show)

router.put('/', ConfigurationController.update)

router.delete('/', ConfigurationController.destroy)

module.exports = router
