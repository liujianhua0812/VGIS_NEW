const router = require('koa-router')()
const MalfunctionTaskController = require('../../../controllers').tasks.malfunction

router.get('/', MalfunctionTaskController.index)

router.get('/stat', MalfunctionTaskController.generalStat)

router.get('/stat/period', MalfunctionTaskController.periodStat)

router.get('/stat/level', MalfunctionTaskController.levelStat)

// router.get('/stat/module', MalfunctionTaskController.moduleStat)

router.get('/:taskId', MalfunctionTaskController.show)

router.put('/:taskId', MalfunctionTaskController.update)

router.delete('/:taskId', MalfunctionTaskController.destroy)

module.exports = router
