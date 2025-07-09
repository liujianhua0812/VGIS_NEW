const router = require('koa-router')()
const SeriesValueController = require('../../../../controllers').instance.series.value

router.get('/', SeriesValueController.index)

router.put('/:valueId', SeriesValueController.update)

router.delete('/:valueId', SeriesValueController.destroy)

module.exports = router
