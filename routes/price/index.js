const router = require('koa-router')()
const GeneralPriceRouter = require('./general')
const ElectricityPriceRouter = require('./electricity')

router.use('/general', GeneralPriceRouter.routes(), GeneralPriceRouter.allowedMethods())

router.use('/electricity', ElectricityPriceRouter.routes(), ElectricityPriceRouter.allowedMethods())

module.exports = router
