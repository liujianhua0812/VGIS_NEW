const router = require('koa-router')()
const SessionController = require('../../../controllers').user.session

router.get('/', SessionController.show)

router.post('/', SessionController.create)

router.delete('/', SessionController.destroy)

module.exports = router
