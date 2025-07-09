const router = require('koa-router')()
const FactorValueController = require('../../../controllers').factors.values

router.get('/', FactorValueController.index)

router.get('/current', FactorValueController.show)

router.post('/', FactorValueController.create)

router.put('/:recordId', FactorValueController.update)

router.delete('/:recordId', FactorValueController.destroy)

module.exports = router
