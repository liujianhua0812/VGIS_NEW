
let opencc = require('node-opencc');

module.exports = async(ctx, next) => {
    if (ctx.request.query.query) {
        ctx.request.query.query = opencc.traditionalToSimplified(ctx.request.query.query);
    }
    await next();
};