const router = require('koa-router')()
const ProtocolController = require('../../../controllers').instance.protocol

router.get('/', ProtocolController.index)

router.post('/test', ProtocolController.test)

router.post('/', ProtocolController.create)

router.post('/:protocolId/test', ProtocolController.test)

router.put('/:protocolId', ProtocolController.update)

router.delete('/:protocolId', ProtocolController.destroy)

module.exports = router
