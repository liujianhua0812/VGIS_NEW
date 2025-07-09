const router = require('koa-router')()
const PIDAnchorPointRouter = require('./point')
const PIDController = require('../../controllers').pid
const authentication = require('../../middlewares/authentication')

router.use('/:diagramId/points', PIDAnchorPointRouter.routes(), PIDAnchorPointRouter.allowedMethods())

router.get('/', PIDController.index)

router.get('/:diagramId', PIDController.show)

router.post('/', authentication.privileges("Data", "Admin"), PIDController.create)

router.put('/:diagramId', authentication.privileges("Data", "Admin"), PIDController.update)

router.delete('/:diagramId', authentication.privileges("Data", "Admin"), PIDController.destroy)

module.exports = router