let config = require('../../config')
const Op = require('sequelize').Op
let crypto = require('crypto')
let encrypt = require('../../libs/encrypt')
let axios = require('axios')

exports.show = async (ctx, next) => {
    let Account = global.db.models.account
    let User = global.db.models.user
    let Org = global.db.models.org
    let Job = global.db.models.job
    let UserJob = global.db.models.user_job
    let Role = global.db.models.role
    let Action = global.db.models.action
    let Privilege = global.db.models.privilege
    let Resources = global.db.models.resources

    let code = ctx.request.query.code ? ctx.request.query.code : ''
    let redirect_uri = ctx.request.query.redirect_uri ? ctx.request.query.redirect_uri : "http://192.168.170.28/"
    let config = ctx.app.config.sso
    let oaConfig = ctx.app.config.oa
    let client_id = config.appID
    let client_secret = config.appSecret
    let oauth_timestamp = new Date().getTime()
    let grant_type = "authorization_code"
    let appkey = config.sign
    let nonce_str = encrypt.generateNoncestr(20)

    let accessTokenData = {
        grant_type,
        oauth_timestamp,
        client_id,
        client_secret,
        // nonce_str,
        code,
        redirect_uri
    }

    // accessTokenData.sign = encrypt.generateSignature(accessTokenData, appkey, client_secret)

    let client = axios.create({
        baseURL: config.host,
        // headers: {
        //     'content-type': 'application/x-www-form-urlencoded'
        // }
    })

    let result = (await client({
        url: `/esc-sso/oauth2.0/accessToken?${Object.entries(accessTokenData).map(item => item.join('=')).join('&')}`,
        method: 'POST',
        // params: accessTokenData
    })).data

    let access_token = result.access_token
    oauth_timestamp = new Date().getTime()
    nonce_str = encrypt.generateNoncestr(20)

    let getInfoData = {
        // client_id,
        // client_secret,
        access_token,
        // oauth_timestamp,
        // nonce_str
    }

    // getInfoData.sign = encrypt.generateSignature(getInfoData, appkey, client_secret)

    result = (await client({
        url: `/esc-sso/oauth2.0/profile`,
        method: 'GET',
        params: getInfoData
    })).data

    // console.log(result)

    if (result.id) {
        let account = await Account.findByPk(result.attributes.account_no, {
            attributes: ['accountNo', 'accountName', 'uid', 'status'],
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

        // console.log(account.dataValues)

        if (account && account.status === 'activated') {

            // if (!account.isInternal) {
            //     let client = axios.create({
            //         baseURL: oaConfig.host,
            //         headers: {
            //             'content-type': 'multipart/form-data',
            //             username: oaConfig.appId,
            //             password: oaConfig.appSecret,
            //             uid: account.uid
            //         }
            //     })
            //     result = (await client.post('/api/userinfo/get')).data
            //     account.fullInfo = result.api_status ? result.api_datas : {}
            //
            //     account.dataValues.internal = false
            // }
            // else {
            //     account.dataValues.internal = true
            // }

            account.dataValues.internal = false

            // console.log(account)

            ctx.session.current_user = account
            return ctx.body = {
                code: 200,
                data: account
            }
        }
        else {
            return ctx.body = {
                code: 401,
                msg: "You are not authorized to visit this site!"
            }
        }
    }
    else {
        return ctx.body = {
            code: 500,
            msg: result.msg
        }
    }

}

exports.index = async (ctx, next) => {
    let User = ctx.app.db.models.user
    let Account = ctx.app.db.models.account
    let UserJob = ctx.app.db.models.user_job
    let Job = ctx.app.db.models.job
    let Org = ctx.app.db.models.org
    let Role = ctx.app.db.models.role

    let queryStr = ctx.request.query.query
    let page = parseInt(ctx.request.query.page)
    let pagination = parseInt(ctx.request.query.pagination)
    page = isNaN(page) ? 1 : page
    pagination = isNaN(pagination) ? 10 : pagination

    let jobId = ctx.request.query.jobId || []
    let orgId = ctx.request.query.orgId || []

    if (!(jobId instanceof Array)) jobId = [jobId]
    if (!(orgId instanceof Array)) orgId = [orgId]

    let filter = {
        isSuper: false,
        accountNo: {
            [Op.ne]: ctx.session.current_user.accountNo
        }
    }

    if (jobId.length > 0 || orgId.length > 0) {
        let jobOrgFilter = {}
        if (jobId.length > 0) {
            jobOrgFilter.jobId = {
                [Op.in]: jobId
            }
        }
        if (orgId.length > 0) {
            jobOrgFilter.orgId = {
                [Op.in]: orgId
            }
        }
        let uids = (await UserJob.findAll({
            where: jobOrgFilter
        })).map(item => item.uid)
        filter.uid = {
            [Op.in]: uids
        }
    }

    if (queryStr) {
        filter.accountName = {
            [Op.iLike]: `%${queryStr.split('').join('%')}%`
        }
    }

    let userQuery = {}
    if (ctx.request.query.validPhoneOnly) {
        userQuery = {
            phone: {
                [Op.ne]: null
            }
        }
    }
    if (ctx.request.query.status) {
        filter.status = ctx.request.query.status
    }

    let query = {
        where: filter,
        attributes: ["accountNo", "accountName", "status", "lastSignInAt", "roleId", "isInternal", "isSuper"],
        include: [{
            model: User,
            include: [{
                model: UserJob,
                include: [Job, Org]
            }],
            where: userQuery
        }, Role],
        order: [['accountName', 'ASC']],
        offset: (page - 1) * pagination,
        limit: pagination
    }

    let accounts = await Account.findAll(query)
    delete query.offset
    delete query.limit
    delete query.attributes
    let total = await Account.count(query)

    ctx.body = {
        data: accounts,
        pagination: {
            page,
            pagination,
            total,
            total_page: Math.ceil(total / pagination)
        }
    }
}

exports.create = async (ctx, next) => {
    let User = ctx.app.db.models.user
    let Account = ctx.app.db.models.account
    let transaction = await ctx.app.db.transaction()
    let user = await User.create({
        realName: ctx.request.body.realName,
        gender: ctx.request.body.gender,
        username: ctx.request.body.accountName,
        email: ctx.request.body.email,
        phone: ctx.request.body.phone,
    }, { transaction })
    let account = await Account.create({
        accountName: ctx.request.body.accountName,
        appPwd: ctx.request.body.password,
        roleId: ctx.request.body.roleId,
        isSuper: ctx.request.body.isSuper,
        isInternal: true,
        uid: user.id
    }, { transaction })
    try {
        await transaction.commit()
        ctx.body = {}
    }
    catch(err) {
        await transaction.rollback()
        throw err
    }
}

exports.update = async (ctx, next) => {
    let Account = ctx.app.db.models.account
    let User = ctx.app.db.models.user
    let account = await Account.findByPk(ctx.params.accountId)
    let user = await account.getUser()
    if (ctx.request.body.password) {
        account.appPwd = ctx.request.body.password
    }
    if (ctx.request.body.status) {
        account.status = ctx.request.body.status
    }
    if (ctx.request.body.accountName) {
        account.accountName = ctx.request.body.accountName
    }
    if (ctx.request.body.roleId) {
        account.roleId = ctx.request.body.roleId
    }
    if (ctx.request.body.isSuper || ctx.request.body.isSuper === false) {
        account.isSuper = ctx.request.body.isSuper
    }
    if (ctx.request.body.email) {
        user.email = ctx.request.body.email
    }
    if (ctx.request.body.phone) {
        user.phone = ctx.request.body.phone
    }
    if (ctx.request.body.realName) {
        user.realName = ctx.request.body.realName
    }
    if (ctx.request.body.gender) {
        user.gender = ctx.request.body.gender
    }
    account = await account.save()
    user = await user.save()
    ctx.body = {}
}

exports.session = require('./session')

exports.job = require('./job')

exports.org = require('./org')

exports.password = require('./password')
