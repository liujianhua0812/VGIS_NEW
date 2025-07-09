const router = require('koa-router')()
const RelationController = require('../../../controllers').model.relation

router.get('/', RelationController.index)

router.post('/', RelationController.create)

router.put('/:relationId', RelationController.update)

router.delete('/:relationId', RelationController.destroy)

module.exports = router
