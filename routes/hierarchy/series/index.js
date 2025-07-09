const router = require('koa-router')()
const SeriesController = require('../../../controllers').hierarchy.series

router.post('/', SeriesController.index)

router.post('/latest', SeriesController.show)

module.exports = router
