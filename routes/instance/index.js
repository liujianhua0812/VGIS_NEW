const router = require('koa-router')()
const AttributeRouter = require('./attribute')
const SeriesRouter = require('./series')
const ProtocolRouter = require('./protocol')
const DataRouter = require('./data')
const RelationRouter = require('./relation')
const TableRouter = require('./table')
const IconRouter = require('./icon')
const PIDRouter = require('./pid')
const RuleChainRouter = require('./rule_chains')
const AlertRouter = require('./alerts')
const InstanceController = require('../../controllers').instance
const authentication = require('../../middlewares/authentication')

router.use('/:instanceId/data', DataRouter.routes(), DataRouter.allowedMethods())

router.use(authentication.is_user)

router.use(authentication.privileges('Data'))

router.use('/:instanceId/alerts', AlertRouter.routes(), AlertRouter.allowedMethods())

router.use('/:instanceId/rule_chains', RuleChainRouter.routes(), RuleChainRouter.allowedMethods())

router.use('/:instanceId/icon', IconRouter.routes(), IconRouter.allowedMethods())

router.use('/:instanceId/pid', PIDRouter.routes(), PIDRouter.allowedMethods())

router.use('/:instanceId/series', SeriesRouter.routes(), SeriesRouter.allowedMethods())

router.use('/:instanceId/attribute', AttributeRouter.routes(), AttributeRouter.allowedMethods())

router.use('/:instanceId/protocol', ProtocolRouter.routes(), ProtocolRouter.allowedMethods())

router.use('/:instanceId/relation', RelationRouter.routes(), RelationRouter.allowedMethods())

router.use('/:instanceId/tables', TableRouter.routes(), TableRouter.allowedMethods())

router.get('/', InstanceController.index)

router.get('/:instanceId', InstanceController.show)

module.exports = router
