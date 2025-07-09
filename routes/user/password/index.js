const router = require('koa-router')()
const PasswordController = require('../../../controllers').user.password

router.put('/', PasswordController.update)

module.exports = router
