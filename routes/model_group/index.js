const router = require('koa-router')()
const ModelGroupController = require('../../controllers').model_group

router.post('/', ModelGroupController.create)

router.put('/:groupId', ModelGroupController.update)

router.delete('/:groupId', ModelGroupController.destroy)

module.exports = router
