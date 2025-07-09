const router = require('koa-router')()
const RecordRouter = require('./record')
const FieldRouter = require('./field')
const RelationRouter = require('./relation')
const TablesController = require('../../controllers').tables

router.use('/:tableId/records', RecordRouter.routes(), RecordRouter.allowedMethods())

router.use('/:tableId/fields', FieldRouter.routes(), FieldRouter.allowedMethods())

router.use('/:tableId/relations', RelationRouter.routes(), RelationRouter.allowedMethods())

router.get('/', TablesController.index)

router.get('/:tableId', TablesController.show)

router.post('/', TablesController.create)

router.put('/:tableId', TablesController.update)

router.delete('/:tableId', TablesController.destroy)

module.exports = router
