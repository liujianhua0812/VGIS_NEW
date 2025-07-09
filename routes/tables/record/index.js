const router = require('koa-router')()
const RecordController = require('../../../controllers').tables.record

router.post('/list', RecordController.showRecord)

router.post('/', RecordController.createRecord)

router.put('/:recordId', RecordController.updateRecord)

router.delete('/:recordId', RecordController.destroyRecord)

module.exports = router
