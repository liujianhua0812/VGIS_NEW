const router = require('koa-router')()
const MediaController = require('../../controllers').media
const TypeRouter = require('./types')

router.use('/type', TypeRouter.routes(), TypeRouter.allowedMethods())

router.get('/', MediaController.index)

router.get('/:mediaId', MediaController.show)

router.post('/', MediaController.create)

router.delete('/:mediaId', MediaController.destroy)

module.exports = router
