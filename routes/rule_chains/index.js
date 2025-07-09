const router = require('koa-router')()
const RuleChainController = require('../../controllers').rule_chains

router.get('/', RuleChainController.index)

router.get('/:chainId', RuleChainController.show)

router.post('/test', RuleChainController.test)

router.post('/', RuleChainController.create)

router.put('/:chainId', RuleChainController.update)

router.delete('/:chainId', RuleChainController.destroy)

module.exports = router