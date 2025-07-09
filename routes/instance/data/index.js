const router = require('koa-router')()
const DataController = require('../../../controllers').instance.data

router.post('/attributes', DataController.attributesHTTP)

router.post('/series', DataController.seriesHTTP)

module.exports = router
