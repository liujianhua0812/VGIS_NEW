const router = require('koa-router')()
const tableRouter = require('./data_table')
const attributeRouter = require('./attribute')
const seriesRouter = require('./series')
const pidRouter = require('./pid')
const multipleSeriesRouter = require('./series-multiple')
const multipleAttributeRouter = require('./attribute-multiple')
const HierarchyController = require('../../controllers').hierarchy

router.get('/', HierarchyController.index)

router.get('/group', HierarchyController.group)

router.use('/tables', tableRouter.routes(), tableRouter.allowedMethods())

router.use('/:instanceId/pid', pidRouter.routes(), pidRouter.allowedMethods())

router.get('/:instanceId', HierarchyController.show)

router.get('/:instanceId/parent', HierarchyController.parent)

router.get('/:instanceId/children', HierarchyController.children)

router.get('/:instanceId/metadata', HierarchyController.metadata)

router.use('/:instanceId/attributes', attributeRouter.routes(), attributeRouter.allowedMethods())

router.use('/:instanceId/series', seriesRouter.routes(), seriesRouter.allowedMethods())

router.use('/series', multipleSeriesRouter.routes(), multipleSeriesRouter.allowedMethods())

router.use('/attributes', multipleAttributeRouter.routes(), multipleAttributeRouter.allowedMethods())

// router.post('/seriesAll', HierarchyController.seriesAll)

module.exports = router
