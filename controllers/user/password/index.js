
exports.update = async (ctx, next) => {
    let current_user = ctx.session.current_user
    let Account = ctx.app.db.models.account
    let account = await Account.findByPk(current_user.accountNo)
    if (account && account.isInternal) {
        let confirm = Account.confirmPassword(ctx.request.body.newPassword, ctx.request.body.confirmPassword)
        let valid = Account.validatePassword(account.appPwd, ctx.request.body.password)
        if (confirm && valid) {
            account.appPwd = ctx.request.body.newPassword
            await account.save()
        }
        else if (!valid) {
            throw new Error("Incorrect Password!")
        }
        else {
            throw new Error("Password Mismatch!")
        }
    }
    ctx.body = {}
}
