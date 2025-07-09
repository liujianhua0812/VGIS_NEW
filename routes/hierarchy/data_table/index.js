const router = require('koa-router')()
const TableController = require('../../../controllers').hierarchy.data_tables

// router.get('/', TableController.index)

router.get('/:instanceId', TableController.index)

router.post('/:tableId/records', TableController.records)

module.exports = router
