const Core = require('@alicloud/pop-core');
const { Op } = require('sequelize')

module.exports =  async function (context, config, inputs, outputs) {
    let result = null, input = inputs[0], error = null
    let Account = global.db.models.account
    let User = global.db.models.user

    let client = new Core({
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    });

    let requestOption = {
        method: 'POST',
        formatParams: false,
    };
    let accounts = await Account.findAll({
        where: {
            accountNo: {
                [Op.in]: config.users
            },
            status: "activated"
        },
        include: [{
            model: User,
            where: {
                phone: {
                    [Op.ne]: null
                }
            }
        }]
    })

    for(let i = 0; i < accounts.length; i += 100) {
        let batch = accounts.slice(i, i + 100)
        let smsParams = JSON.parse(config.params)
        let params = {
            TemplateCode: config.TemplateCode,
            SignNameJson: JSON.stringify(batch.map(item => config.SignName)),
            PhoneNumberJson: JSON.stringify(batch.map(item => item.user.phone)),
            TemplateParamJson: JSON.stringify(batch.map(item => smsParams)),
        }
        try {
            let response = await client.request('SendBatchSms', params, requestOption)
        }
        catch (err) {
            console.log(err)
            error = err
        }
    }
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }
    return {
        input,
        result,
        canceled: false,
        error
    }
}