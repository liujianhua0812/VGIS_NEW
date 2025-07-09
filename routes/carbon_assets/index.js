const router = require('koa-router')()
const CarbonAssetController = require('../../controllers').carbon_assets

router.get('/', CarbonAssetController.index)

router.get('/stat', CarbonAssetController.stat)

router.post('/', CarbonAssetController.create)

router.put('/:assetId', CarbonAssetController.update)

router.delete('/:assetId', CarbonAssetController.destroy)

router.delete('/', CarbonAssetController.bulkDestroy)

module.exports = router
