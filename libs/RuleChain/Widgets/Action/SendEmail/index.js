
module.exports =  {
    name: "send email",
    label: "dict.ruleChain.widgets.sendEmail.label",
    description: "dict.ruleChain.widgets.sendEmail.description",
    type: "",
    inputs: 1,
    outputs: 1,
    executor: require('./executor'),
    locale: {
        cn: {
            NO_RECEIVER: "未指定收件人！",
            AUTH_FAILED: "认证失败，请检查用户名和密码是否正确！",
            INVALID_RECEIVER: "邮箱格式错误，无法发送！",
            EMPTY_CONTENT: "邮件内容为空！",
            EMPTY_SUBJECT: "邮件主题为空！",
            CONNECTION_FAILED: "邮件服务器连接失败！",
        },
        en: {
            NO_RECEIVER: "You haven't specify any receivers!",
            AUTH_FAILED: "Auth failed, please verify your auth info!",
            INVALID_RECEIVER: "Receiver has invalid address!",
            EMPTY_CONTENT: "Empty content for your email!",
            EMPTY_SUBJECT: "Empty subject for your email!",
            CONNECTION_FAILED: "Cannot connect to SMTP server!",
        }
    }
}