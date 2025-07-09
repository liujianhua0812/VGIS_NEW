const router = require('koa-router')()
const SeriesController = require('../../controllers').series

router.get('/', SeriesController.index)

module.exports = router
