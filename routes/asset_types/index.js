const router = require('koa-router')()
const AssetTypeController = require('../../controllers').asset_types

router.get('/', AssetTypeController.index)

module.exports = router
