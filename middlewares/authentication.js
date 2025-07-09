const url = require('url')
const crypto = require('crypto')
let messages = require('../libs/Error').messages;

exports.check_origin = async (ctx, next) => {
    let origin = url.parse(ctx.request.origin)
    let target = url.parse(ctx.request.href)
    if (origin.hostname !== target.hostname) {
        throw new Error(messages.controller.session.NOT_AUTHORIZED)
    }
    return next()
}

exports.verifyToken = async (ctx, next) => {
    crypto.createHmac()
}

exports.is_admin = async (ctx, next) => {
    if (ctx.session.current_admin) {
        await next();
    }
    else {
        throw new Error(messages.controller.session.NOT_AUTHORIZED);
    }
};

exports.is_user = async (ctx, next) => {
    return next()
    if (ctx.session.current_user) {
        await next();
    }
    else {
        throw new Error(messages.controller.session.NOT_AUTHORIZED);
    }
};

exports.is_logged_in = async (ctx, next) => {
    if (ctx.session.current_user || ctx.session.current_admin) {
        await next();
    }
    else {
        throw new Error(messages.controller.session.NOT_AUTHORIZED);
    }
};

exports.privileges = function (resources, action, superOnly) {
    return async (ctx, next) => {
        let user = ctx.session.current_user
        if (superOnly) {
            if (user && user.isSuper) {
                return next()
            }
            else {
                return ctx.body = {
                    code: 401,
                    msg: "You are not authorized to access the system!"
                }
            }
        }
        else if (action) {
            if (user && ( user.isSuper || user.role.privileges.filter(privilege => privilege.action.name === action && privilege.resource.name === resources).length !== 0 )) {
                return next()
            }
            else {
                return ctx.body = {
                    code: 401,
                    msg: "You are not authorized to access the system!"
                }
            }
        }
        else if (resources) {
            if (user && ( user.isSuper || user.role.privileges.filter(privilege => privilege.resource.name === resources).length !== 0 )) {
                return next()
            }
            else {
                return ctx.body = {
                    code: 401,
                    msg: "You are not authorized to access the system!"
                }
            }
        }
        else {
            return next()
        }
    }
}