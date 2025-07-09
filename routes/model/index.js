const router = require('koa-router')()
const AttributeRouter = require('./attribute')
const SeriesRouter = require('./series')
const RelationRouter = require('./relation')
const InstanceRouter = require('./instance')
const TablesRouter = require('./tables')
const RuleChainRouter = require('./rule_chains')
const AlertRouter = require('./alerts')
const AlertTemplateRouter = require('./alert_templates')
const ThreeDRouter = require('./3d')
const ModelController = require('../../controllers').model

router.use('/:modelId/instance', InstanceRouter.routes(), InstanceRouter.allowedMethods())

router.use('/:modelId/rule_chains', RuleChainRouter.routes(), RuleChainRouter.allowedMethods())

router.use('/:modelId/alerts', AlertRouter.routes(), AlertRouter.allowedMethods())

router.use('/:modelId/alert_templates', AlertTemplateRouter.routes(), AlertTemplateRouter.allowedMethods())

router.use('/:modelId/attribute', AttributeRouter.routes(), AttributeRouter.allowedMethods())

router.use('/:modelId/series', SeriesRouter.routes(), SeriesRouter.allowedMethods())

router.use('/:modelId/relation', RelationRouter.routes(), RelationRouter.allowedMethods())

router.use('/:modelId/tables', TablesRouter.routes(), TablesRouter.allowedMethods())

router.use('/:modelId/3d', ThreeDRouter.routes(), ThreeDRouter.allowedMethods())

router.get('/', ModelController.index)

router.get('/:modelId', ModelController.show)

router.post('/', ModelController.create)

router.put('/:modelId', ModelController.update)

router.delete('/:modelId', ModelController.destroy)

module.exports = router
