const router = require('koa-router')()
const PowerTaskController = require('../../../controllers').tasks.power

router.get('/', PowerTaskController.index)

router.get('/stat', PowerTaskController.generalStat)

router.get('/stat/period', PowerTaskController.periodStat)

router.get('/stat/module', PowerTaskController.moduleStat)

router.get('/:taskId', PowerTaskController.show)

router.post('/', PowerTaskController.create)

router.put('/:taskId', PowerTaskController.update)

router.delete('/:taskId', PowerTaskController.destroy)

module.exports = router
