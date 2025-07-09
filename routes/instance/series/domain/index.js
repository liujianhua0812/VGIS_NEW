const router = require('koa-router')()
const DomainController = require('../../../../controllers').instance.series.domain

router.get('/', DomainController.index)

module.exports = router
