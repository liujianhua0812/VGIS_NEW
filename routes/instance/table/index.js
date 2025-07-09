const router = require('koa-router')()
const TableController = require('../../../controllers').instance.table

router.get('/', TableController.index)

router.post('/:tableId/records', TableController.records)

module.exports = router
