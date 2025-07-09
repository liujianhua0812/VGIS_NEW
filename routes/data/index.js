const router = require('koa-router')()
const DataController = require('../../controllers').data

router.post('/query', DataController.query)

module.exports = router