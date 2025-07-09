const router = require('koa-router')()
const RoleController = require('../../controllers').role

router.get('/', RoleController.index)

router.get('/resource', RoleController.resource)

router.get('/action', RoleController.action)

router.post('/', RoleController.create)

router.put('/:roleId', RoleController.update)

router.put('/:roleId/account', RoleController.account)

router.delete('/:roleId', RoleController.destroy)

module.exports = router
