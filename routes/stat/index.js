const router = require('koa-router')()
const StatController = require('../../controllers').stat

router.get('/general', StatController.general)

router.get('/series', StatController.series)

router.get('/instance', StatController.instance)

router.get('/alert', StatController.alert)

module.exports = router
