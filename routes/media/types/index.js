const router = require('koa-router')()
const TypeController = require('../../../controllers').media.types

router.get('/', TypeController.index)

module.exports = router
