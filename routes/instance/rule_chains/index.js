const router = require('koa-router')()
const RuleChainController = require('../../../controllers').instance.rule_chains

router.get('/', RuleChainController.index)

module.exports = router