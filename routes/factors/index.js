const router = require('koa-router')()
const FactorValueRouter = require('./values')

const FactorController = require('../../controllers').factors

router.use('/values', FactorValueRouter.routes(), FactorValueRouter.allowedMethods())

router.get('/', FactorController.index)

module.exports = router
