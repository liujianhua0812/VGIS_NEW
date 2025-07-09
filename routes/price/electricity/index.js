const router = require('koa-router')()
const ElectricityPriceController = require('../../../controllers').price.electricity

router.get('/', ElectricityPriceController.index)

router.put('/', ElectricityPriceController.update)

router.delete('/:recordId', ElectricityPriceController.destroy)

module.exports = router
