const Op = require('sequelize').Op
const encrypt = require('../../../libs/encrypt')
let axios = require('axios')
let messages = require('../../../libs/Error').messages

exports.show = async (ctx, next) => {
    let current_user = ctx.session.current_user

    // console.log(current_user)

    return ctx.body = {
        code: 200,
        data: current_user
    }
}

exports.create = async (ctx, next) => {
    let Account = global.db.models.account
    let User = global.db.models.user
    let Org = global.db.models.org
    let Job = global.db.models.job
    let UserJob = global.db.models.user_job
    let Role = global.db.models.role
    let Action = global.db.models.action
    let Privilege = global.db.models.privilege
    let Resources = global.db.models.resources

    let account = await Account.findOne({
        where: {
            accountName: ctx.request.body.username
        },
        attributes: ['accountNo', 'accountName', 'uid', 'status', 'isSuper', 'isInternal', 'encryptedPassword', 'appPwd'],
        include: [{
            model: User,
            include: [{
                model: UserJob,
                include: [Job, Org]
            }]
        }, {
            model: Role,
            include: [{
                model: Privilege,
                include: [Action, Resources]
            }]
        }]
    })

    if (account && account.status === 'activated' && encrypt.validatePassword(account.appPwd, ctx.request.body.password)) {
        delete account.dataValues.encryptedPassword
        delete account.dataValues.appPwd
        ctx.session.current_user = account

        return ctx.body = {
            code: 200,
            data: account
        }
    }
    else {
        throw new Error(messages.controller.session.AUTH_FAILED)
    }

}

exports.destroy = async (ctx, next) => {
    let current_user = ctx.session.current_user
    delete ctx.session.current_user
    return ctx.body = {
        code: 200,
        data: {
            internal: current_user.internal
        }
    }
}
