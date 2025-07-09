const router = require('koa-router')()
const RelationController = require('../../../controllers').tables.relation

router.get('/', RelationController.showRelation)

router.post('/', RelationController.createRelation)

router.put('/:relationId', RelationController.updateRelation)

router.delete('/:relationId', RelationController.destroyRelation)

module.exports = router

