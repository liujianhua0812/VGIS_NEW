let axios = require('axios')
let encrypt = require('../libs/encrypt')
let config = require('../config')
require('../libs/Date')()

exports.syncUser = async (db) => {
    const Account = db.models.account
    const User = db.models.user
    const UserJob = db.models.user_job

    let transaction = await db.transaction()

    let secret = `${config.iam.appId}:${config.iam.appSecret}`
    let token = Buffer.from(secret).toString('base64')

    // console.log(`User`)
    // console.log(`Basic ${token}`)
    // console.log(`Bearer ${encrypt.generateJWT({}, config.iam.appId, config.iam.appSecret)}`)

    let client = axios.create({
        baseURL: config.iam.host,
        headers: {
            'content-type': 'application/json',
            'Authorization': `Basic ${token}`
            // 'Authorization': `Bearer ${encrypt.generateJWT({}, config.iam.appId, config.iam.appSecret)}`
        }
    })

    let result = await client.post("/esc-idm/api/v1/account/list", {
        size: 10000,
        page: 1,
        startTime: new Date(0).getTime()
    })

    if (result.data.code === '0' && result.data.data && result.data.data.list) {
        let users = result.data.data.list
        let exists = await User.findAll({
            transaction
        })
        let userMap = exists.reduce((result, user) => {
            result[user.uid] = user
            return result
        }, {})
        let newUsers = users.filter(user => !userMap[user.idt_user__user_uid])
        let changedUsers = users.filter(user => userMap[user.idt_user__user_uid] && user.idt_user__email !== userMap[user.idt_user__user_uid].email)
        console.log(`new = ${newUsers.length}, changed = ${changedUsers.length}`)
        // 如果重复而且需要更新才更新
        for(let i = 0; i < changedUsers.length; i++) {
            let user = changedUsers[i]
            await User.update({
                email: user.idt_user__email
            }, {
                where: {
                    uid: user.idt_user__user_uid
                },
                transaction
            })
        }
        let _users = Object.values(newUsers.reduce((result, user) => {
            result[user.idt_user__user_uid] = {
                uid: user.idt_user__user_uid,
                email: user.idt_user__email
            }
            return result
        }, {}))
        await User.bulkCreate(_users, {
            updateOnDuplicate: ["email"],
            transaction
        })
        await UserJob.destroy({
            where: {},
            transaction
        })
        // await UserJob.bulkCreate(users.reduce((result, user) => {
        //     return result.concat(user.jobs.map(record => ({
        //         uid: user.idt_user__user_uid,
        //         orgId: null,
        //         jobId: record.idt_job__code
        //     })))
        // }, []), {
        //     transaction
        // })
        // await UserJob.bulkCreate(users.reduce((result, user) => {
        //     return result.concat(user.orgs.map(record => ({
        //         uid: user.idt_user__user_uid,
        //         orgId: record.idt_org__org_code,
        //         jobId: null
        //     })))
        // }, []), {
        //     transaction
        // })
        // 取得所有的account账号
        exists = await Account.findAll({
            transaction
        })
        userMap = exists.reduce((result, user) => {
            result[user.accountNo] = user
            return result
        }, {})
        newUsers = users.filter(user => !userMap[user.app_account__account_no])
        changedUsers = users.filter(user => userMap[user.app_account__account_no] && user.idt_user__user_name !== userMap[user.app_account__account_no].accountName)
        console.log(`new = ${newUsers.length}, changed = ${changedUsers.length}`)
        // 如果重复而且需要更新才更新
        for(let i = 0; i < changedUsers.length; i++) {
            let user = changedUsers[i]
            await Account.update({
                accountName: user.idt_user__user_name
            }, {
                where: {
                    accountNo: user.app_account__account_no
                },
                transaction
            })
        }
        _users = Object.values(newUsers.reduce((result, user) => {
            result[user.app_account__account_no] = {
                accountNo: user.app_account__account_no,
                accountName: user.idt_user__user_name,
                uid: user.idt_user__user_uid,
                isInternal: false,
                appPwd: null
            }
            return result
        }, {}))
        await Account.bulkCreate(_users, {
            transaction
        })
        try {
            await transaction.commit()
            console.log("User and account sync succeed.")
        }
        catch (err) {
            await transaction.rollback()
            console.log(err)
        }
    }
    else if (result.data.code === '200') {
        console.log("User and account sync succeed.")
    }
    else {
        console.log(result.data)
    }
}

exports.syncOrg = async (db) => {
    const Org = db.models.org

    let secret = `${config.iam.appId}:${config.iam.appSecret}`
    let token = Buffer.from(secret).toString('base64')

    // console.log(`Org`)
    // console.log(`Basic ${token}`)
    // console.log(`Bearer ${encrypt.generateJWT({}, config.iam.appId, config.iam.appSecret)}`)

    let client = axios.create({
        baseURL: config.iam.host,
        headers: {
            'content-type': 'application/json',
            'Authorization': `Basic ${token}`
            // 'Authorization': `Bearer ${encrypt.generateJWT({}, config.iam.appId, config.iam.appSecret)}`
        }
    })

    let result = await client.post("/esc-idm/api/v1/org/list", {
        size: 10000,
        page: 1,
        startTime: new Date(0).getTime()
    })

    if (result.data.code === '0') {
        let data = Object.values(result.data.data.list.reduce((result, item) => {
            for(let key in item) {
                if (item[key] === '') {
                    item[key] = null
                }
            }
            result[item.idt_org__org_code] = {
                prId: item.idt_org__org_code,
                prOrgcode: item.idt_org__org_code,
                prName: item.idt_org__name_en,
                prParentid: item.idt_org__sup_org_code,
            }
            return result
        }, {}))

        await Org.bulkCreate(data, {
            updateOnDuplicate: ['prOrgcode', 'prName', 'prParentid']
        })

        console.log("Org sync succeed.")
    }
}

exports.syncJob = async (db) => {
    const Job = db.models.job

    let secret = `${config.iam.appId}:${config.iam.appSecret}`
    let token = Buffer.from(secret).toString('base64')

    // console.log(`Job`)
    // console.log(`Basic ${token}`)
    // console.log(`Bearer ${encrypt.generateJWT({}, config.iam.appId, config.iam.appSecret)}`)

    let client = axios.create({
        baseURL: config.iam.host,
        headers: {
            'content-type': 'application/json',
            'Authorization': `Basic ${token}`
            // 'Authorization': `Bearer ${encrypt.generateJWT({}, config.iam.appId, config.iam.appSecret)}`
        }
    })

    let result = await client.post("/esc-idm/api/v1/job/list", {
        size: 10000,
        page: 1,
        startTime: new Date(0).getTime()
    })

    if (result.data.code === '0') {
        let data = Object.values(result.data.data.list.reduce((result, item) => {
            for(let key in item) {
                if (item[key] === '') {
                    item[key] = null
                }
            }
            result[item.idt_job__code] = {
                prId: item.idt_job__code,
                prCode: item.idt_job__code,
                prName: item.idt_job__name,
                prStatus: item.idt_job__status
            }
            return result
        }, {}))

        await Job.bulkCreate(data, {
            updateOnDuplicate: ['prCode', 'prName', 'prStatus']
        })

        console.log("Job sync succeed.")
    }
}

const db = require('../database')(
    config.database.postgres.dbname,
    config.database.postgres.username,
    config.database.postgres.password,
    config.database.postgres.config
);

exports.sync = async (db) => {
    await exports.syncOrg(db)
    await exports.syncJob(db)
    await exports.syncUser(db)
    console.log("sync finished")
}

// exports.syncOrg(db)
// exports.syncJob(db)
// exports.syncUser(db)
// exports.sync(db)
