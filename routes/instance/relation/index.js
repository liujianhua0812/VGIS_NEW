const router = require('koa-router')()
const RelationController = require('../../../controllers').instance.relation

router.get('/', RelationController.index)

router.post('/', RelationController.create)

router.delete('/:relationId', RelationController.destroy)

module.exports = router
