const router = require('koa-router')()
const PIDAnchorPointController = require('../../../controllers').pid.points

router.get('/', PIDAnchorPointController.index)

router.post('/:pointId/execute', PIDAnchorPointController.execute)

module.exports = router
