const router = require('koa-router')()
const AlertLevelController = require('../../controllers').alert_level

router.get('/', AlertLevelController.index)

module.exports = router