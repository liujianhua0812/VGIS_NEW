const router = require('koa-router')()
const OrgController = require('../../../controllers').user.org

router.get('/', OrgController.index)

module.exports = router
