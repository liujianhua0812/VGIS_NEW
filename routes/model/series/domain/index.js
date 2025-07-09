const router = require('koa-router')()
const DomainController = require('../../../../controllers').model.series.domain

router.get('/', DomainController.index)

module.exports = router
