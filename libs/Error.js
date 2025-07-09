exports.messages = {
    database: {
        statistics: {
            INVALID_QUERY: "[400]database.statistics.INVALID_QUERY"
        },
        model_group: {
            DUPLICATE_GROUP: "[400]database.model_group.DUPLICATE_GROUP"
        },
        time_series: {
            DUPLICATE_SERIES: "[400]database.time_series.DUPLICATE_SERIES"
        },
        static_attribute: {
            DUPLICATE_ATTRIBUTE: "[400]database.static_attribute.DUPLICATE_ATTRIBUTE"
        }
    },
    controller: {
        statistics: {
            INVALID_QUERY: "[400]controller.statistics.INVALID_QUERY"
        },
        media: {
            NO_ATTACHMENT_FOUND: "[400]controller.media.NO_ATTACHMENT_FOUND"
        },
        session: {
            AUTH_FAILED: "[401]controller.session.AUTH_FAILED",
            NOT_AUTHORIZED: "[401]controller.session.NOT_AUTHORIZED"
        },
        model: {
            DELETION_RESTRICTION_FAILED: "[500]controller.model.DELETION_RESTRICTION_FAILED"
        },
        instance: {
            DATA_INTERFACE_ERROR: "[400]controller.instance.DATA_INTERFACE_ERROR",
            DELETION_RESTRICTION_FAILED: "[500]controller.instance.DELETION_RESTRICTION_FAILED"
        },
        pid: {
            INVALID_PASSWORD: "[401]controller.pid.INVALID_PASSWORD"
        },
        hierarchy: {
            DATA_INTERFACE_ERROR: "[400]controller.hierarchy.DATA_INTERFACE_ERROR"
        },
        table:{
            DATA_INTERFACE_ERROR: "[400]controller.table.DATA_INTERFACE_ERROR"
        },
        shared: {
            NOT_EXIST: "[404]controller.shared.NOT_EXIST"
        },
        factor: {
            DUPLICATE_FACTOR_VALUE: "[404]controller.factor.DUPLICATE_FACTOR_VALUE"
        },
        price: {
            DUPLICATE_PRICE: "[404]controller.price.DUPLICATE_PRICE"
        }
    }
};

exports.handler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err);
        if (err.name === "SequelizeValidationError") {
            ctx.response.status = 400;
            ctx.response.body = {
                message: err.message.split(",\n").map(msg => msg.match(/\[\d\d\d\].*/)[0].substr(5)).join(" / ")
            };
            return;
        }
        let code = parseInt(err.message.substr(1, 3));
        ctx.response.status = isNaN(code) ? 500 : code;
        ctx.response.body = {
            message: isNaN(code) ? err.message : global.i18n.__(err.message.substr(5))
        };
    }
};

exports.handlerCOAP = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        let res = ctx.response
        console.log(err);
        if (err.name === "SequelizeValidationError") {
            ctx.response.code = "4.00"
            return res.end(err.message.split(",\n").map(msg => msg.match(/\[\d\d\d\].*/)[0].substr(5)).join(" / "))
        }
        let code = parseInt(err.message.substr(1, 3));
        ctx.response.code = isNaN(code) ? "5.00" : (code / 100).toFixed(2);
        return res.end(isNaN(code) ? err.message : global.i18n.__(err.message.substr(5)))
    }
};
