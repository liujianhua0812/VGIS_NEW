const router = require('koa-router')()
const DomainRouter = require('./domain')
const SeriesController = require('../../../controllers').model.series

router.use('/:seriesId/domain', DomainRouter.routes(), DomainRouter.allowedMethods())

router.get('/', SeriesController.index)

router.post('/', SeriesController.create)

router.put('/:seriesId', SeriesController.update)

router.delete('/:seriesId', SeriesController.destroy)

module.exports = router
