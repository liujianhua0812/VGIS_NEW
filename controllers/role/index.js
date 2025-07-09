const User = require('../../database/models/User')

let Op = require('sequelize').Op


/**
 * 查看角色：显示角色的名称、包含用户的数量和权限；
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.index = async (ctx, next) => {
    const User = ctx.app.db.models.user
    const Role = ctx.app.db.models.role
    const Privilege = ctx.app.db.models.privilege
    const Resource = ctx.app.db.models.resources
    const Action = ctx.app.db.models.action

    let query = {}
    if (ctx.request.query.query) {
        query = {
            name: {
                [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
            }
        }
    }

    let roleData = await Role.findAll({
        where: query,
        attributes: ['id', 'name', 'defaultEntry'],
        include: [{
            model: Privilege,
            attributes: ['id'],
            include: [{
                model: Resource,
                attribute: ['id', 'name']
            }, {
                model: Action,
                attribute: ['id', 'name']
            }]
        }]
    })

    // for(let i=0; i<roleData.length; i++){
    //     let role = roleData[i]
    //     role.dataValues.userCount = await User.count({where: {roleId: role.id}})
    // }

    ctx.body = {
        data: roleData
    }
}

/**
 * 创建角色：需要提供角色的名称和权限信息；
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.create = async (ctx, next) => {
    const Role = ctx.app.db.models.role
    const Privilege = ctx.app.db.models.privilege
    const Resource = ctx.app.db.models.resources
    const Action = ctx.app.db.models.action

    let transaction = await ctx.app.db.transaction()

    let name = ctx.request.body.name
    let defaultEntry = ctx.request.body.defaultEntry
    let role = await Role.create({
        name: name,
        defaultEntry: defaultEntry || null
    }, {
        transaction
    })

    let privilege = ctx.request.body.privilege
    if (privilege) {
        await Privilege.bulkCreate(privilege.map(item => ({
            resourceId: item.resourceId,
            actionId: item.actionId,
            roleId: role.id
        })), {
            transaction
        })
    }

    try {
        await transaction.commit()
        ctx.body = {}
    } catch (err) {
        throw err
    }
}

/**
 * 修改角色：需要修改角色的名称和权限信息；
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.update = async (ctx, next) => {
    const Role = ctx.app.db.models.role
    const Privilege = ctx.app.db.models.privilege
    const Resource = ctx.app.db.models.resources
    const Action = ctx.app.db.models.action

    let transaction = await ctx.app.db.transaction()

    let roleId = ctx.params.roleId
    let defaultEntry = ctx.request.body.defaultEntry
    let name = ctx.request.body.name
    let privilege = ctx.request.body.privilege

    let role = await Role.findOne({
        where: {
            id: roleId
        },
        transaction
    })

    if (name) {
        role.name = name
    }
    if (defaultEntry) {
        role.defaultEntry = defaultEntry
    }
    await role.save({ transaction })

    if (privilege) {
        await Privilege.destroy({ where: { roleId: roleId }, transaction })
        await Privilege.bulkCreate(privilege.map(item => ({
            resourceId: item.resourceId,
            actionId: item.actionId,
            roleId: roleId
        })), {
            transaction
        })
    }

    try {
        await transaction.commit()
        ctx.body = {}
    } catch (err) {
        throw err
    }
}

/**
 * 删除角色：只有不包含用户的角色才可以被删除，否则要给出错误提示；
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */

exports.destroy = async (ctx, next) => {
    const User = ctx.app.db.models.user
    const Role = ctx.app.db.models.role
    let roleId = ctx.params.roleId

    // const count = await User.count({ where: { roleId: roleId } })

    // if (count === 0) {
    //     console.log("get zero count")
    await Role.destroy({ where: { id: roleId } })
    // }

    // else {
    //     //TODO
    // }
    ctx.body = {}
}

/**
 * 获取所有资源
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.resource = async (ctx, next) => {
    const Resource = ctx.app.db.models.resources
    ctx.body = await Resource.findAll({})
}

/**
 * 获取所有行为
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.action = async (ctx, next) => {
    const Action = ctx.app.db.models.action
    ctx.body = await Action.findAll({})
}

/**
 * 获取所有权限
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.privilege = async (ctx, next) => {
    const Privilege = ctx.app.db.models.privilege
    ctx.body = await Privilege.findAll({})
}

/**
 * 批量分配权限
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.account = async (ctx, next) => {
    let Account = global.db.models.account
    let accountNos = ctx.request.body.accountNos || []
    if (!(accountNos instanceof Array)) {
        accountNos = [ accountNos ]
    }
    await Account.update({
        roleId: ctx.params.roleId
    }, {
        where: {
            accountNo: {
                [Op.in]: accountNos
            }
        }
    })
    ctx.body = {}
}
