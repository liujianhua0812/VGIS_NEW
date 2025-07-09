const router = require('koa-router')()
const TablesController = require('../../../controllers').model.tables

router.get('/', TablesController.showTables)

router.post('/:tableId/records', TablesController.showTableRecords)

module.exports = router