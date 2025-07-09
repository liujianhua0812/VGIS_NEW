
module.exports = async (ctx, next) => {
    let query = {}, body = {};
    for(let key in ctx.request.query) {
        if (key.indexOf("[]") !== -1) {
            if (ctx.request.query[key] instanceof Array) {
                query[key.replace("[]", "")] = ctx.request.query[key];
            }
            else {
                query[key.replace("[]", "")] = [ctx.request.query[key]];
            }
        }
        else if (ctx.request.query[key] !== "") {
            if (ctx.request.query[key] === 'null') {
                ctx.request.body[key] = null;
            }
            query[key] = ctx.request.query[key];
        }
    }
    for(let key in ctx.request.body) {
        if (key.indexOf("[]") !== -1) {
            if (ctx.request.body[key] instanceof Array) {
                body[key.replace("[]", "")] = ctx.request.body[key];
            }
            else {
                body[key.replace("[]", "")] = [ctx.request.body[key]];
            }
        }
        else if (ctx.request.body[key] !== "") {
            if (ctx.request.body[key] === 'null') {
                ctx.request.body[key] = null;
            }
            body[key] = ctx.request.body[key];
        }
    }
    ctx.request.query = query;
    ctx.request.body = body;
    await next();
};