let nodemailer = require('nodemailer')
const RichText = require('../../../../Richtext')

module.exports =  async function (context, config, inputs, outputs) {
    let result = null, input = inputs[0], error = null
    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = input
    }
    if (!config.subject) {
        error = "EMPTY_SUBJECT"
    }
    else if (!config.template) {
        error = "EMPTY_CONTENT"
    }
    else if (!config.target || config.target.length === 0) {
        error = "NO_RECEIVER"
    }
    if (!error) {
        try {
            let transporter = nodemailer.createTransport({
                host: config.smtp,
                port: config.port,
                secure: config.ssl,
                auth: {
                    user: config.user,
                    pass: config.password,
                },
                connectionTimeout: 5000
            });
            result = await transporter.sendMail({
                from: config.user,
                to: config.target,
                subject: RichText.composeDefault(config.subject, context),
                html: RichText.composeDefault(config.template, context)
            })
        }
        catch(err) {
            console.log(err)
            if (err.message.indexOf("Missing credentials") !== -1) {
                error = "AUTH_FAILED"
            }
            else {
                error = "CONNECTION_FAILED"
            }
            return {
                input,
                result,
                canceled: false,
                error
            }
        }
    }
    return {
        input,
        result,
        canceled: false,
        error: error
    }
}