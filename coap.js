const coap = require('coap')
const server = coap.createServer()
const compose = require('koa-compose')
const koaBody = require('koa-body');
const url = require('url')
const typeis = require('type-is')
const errorHandler = require('./libs/Error').handlerCOAP
const qs = require('querystring')
let Router = require('@koa/router')
let router = new Router()

router.post('/instance/:instanceId/data/attributes', require('./controllers/instance/data').attributesCoAP)

router.post('/instance/:instanceId/data/series', require('./controllers/instance/data').seriesCoAP)

router.use(async function (ctx, next) {
    ctx.res.end(JSON.stringify(ctx.body.data))
})

function createCtx (req, res) {
    let result = {
        req,
        res
    }
    Object.defineProperty(req, "query", {
        get () {
            const str = this.querystring || ""
            return qs.parse(str)
        }
    })
    let parsed = url.parse(req.url)
    req.headers['content-type'] = req.headers["Content-Type"]
    req.headers['content-length'] = req.payload.length
    result.querystring = req.querystring = parsed.query
    result.request = req
    result.response = res
    result.originalUrl = req.url
    result.path = parsed.pathname
    result.method = req.method
    result.set = function (name, value) {
        this.req.headers[name] = value
    }
    result.is = function (type, ...types) {
        return typeis(this.req, type, ...types)
    }
    return result
}

server.on('request', async (req, res) => {
    let middlewares = [
        errorHandler,
        koaBody({
            multipart: true,
            strict: false,
            formLimit: "50mb",
            jsonLimit: "50mb",
            textLimit: "50mb",
        }),
        router.routes(),
        router.allowedMethods()
    ]

    let fn = compose(middlewares)

    let ctx = createCtx(req, res)

    await fn(ctx)
})

module.exports = server