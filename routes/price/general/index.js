const router = require('koa-router')()
const GeneralPriceController = require('../../../controllers').price.general

router.get('/', GeneralPriceController.index)

router.post('/', GeneralPriceController.create)

router.put('/:recordId', GeneralPriceController.update)

router.delete('/:recordId', GeneralPriceController.destroy)

module.exports = router
