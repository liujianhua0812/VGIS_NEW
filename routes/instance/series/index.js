const router = require('koa-router')()
const SeriesValueRouter = require('./value')
const SeriesDomainRouter = require('./domain')
const SeriesConfigurationRouter = require('./configure')
const SeriesValueController = require('../../../controllers').instance.series

router.use('/:seriesId/configuration', SeriesConfigurationRouter.routes(), SeriesConfigurationRouter.allowedMethods())

router.use('/:seriesId/value', SeriesValueRouter.routes(), SeriesValueRouter.allowedMethods())

router.use('/:seriesId/domain', SeriesDomainRouter.routes(), SeriesDomainRouter.allowedMethods())

router.get('/', SeriesValueController.index)

router.get('/latest', SeriesValueController.latest)

router.get('/:seriesId/import', SeriesValueController.importTemplate)

router.get('/:seriesId', SeriesValueController.show)

router.post('/', SeriesValueController.create)

router.post('/:seriesId/import', SeriesValueController.import)

router.put('/', SeriesValueController.update)

router.delete('/', SeriesValueController.destroy)

module.exports = router
