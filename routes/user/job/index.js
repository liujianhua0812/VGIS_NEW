const router = require('koa-router')()
const JobController = require('../../../controllers').user.job

router.get('/', JobController.index)

module.exports = router
