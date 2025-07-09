const router = require('koa-router')()
const PIDController = require('../../../controllers').instance.pid

router.get('/', PIDController.index)

router.get('/:pidId', PIDController.show)

router.post('/', PIDController.create)

router.put('/:pidId', PIDController.update)

router.delete('/:pidId', PIDController.destroy)

module.exports = router
