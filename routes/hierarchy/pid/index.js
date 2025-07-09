const router = require('koa-router')()
const PIDController = require('../../../controllers').hierarchy.pids

router.get('/', PIDController.index)

router.get('/:pidId', PIDController.show)

module.exports = router
