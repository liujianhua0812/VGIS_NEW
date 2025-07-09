const router = require('koa-router')()
const SessionRouter = require('./session')
const OrgRouter = require('./org')
const JobRouter = require('./job')
const PasswordRouter = require('./password')
const UserController = require('../../controllers').user

router.use('/session', SessionRouter.routes(), SessionRouter.allowedMethods())

router.use('/password', PasswordRouter.routes(), PasswordRouter.allowedMethods())

router.use('/job', JobRouter.routes(), JobRouter.allowedMethods())

router.use('/org', OrgRouter.routes(), OrgRouter.allowedMethods())

router.get('/', UserController.index)

router.get('/info', UserController.show)

router.post('/', UserController.create)

router.put('/:accountId', UserController.update)

module.exports = router
