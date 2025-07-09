const Koa = require('koa');
const app = new Koa();
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const config = require('./config');
const paramFilter = require('./middlewares/filterParams');
const router = require('./routes');
const handler = require('./libs/Error').handler;
const DataCache = require('./libs/cache')
const schedule = require('node-schedule')
require('./libs/Date')()
const db = require('./database')(
    config.database.postgres.dbname,
    config.database.postgres.username,
    config.database.postgres.password,
    config.database.postgres.config,
);
const jobs = require('./jobs')
const {PeripheralManager} = require("./libs/PeripheralManager");
const {MQTTManager} = require("./libs/MQTTManager");
const MaintenanceScheduler = require("./libs/MaintenanceScheduler")
const AutomationScheduler = require("./libs/AutomationScheduler")

app.config = config
app.cctvManager = {}
app.dataCache = new DataCache()

app.use(handler);

// middlewares
app.use(koaBody({
    multipart: true,
    strict: false,
    formidable: {
        maxFileSize: 5 * 1024 * 1024 * 1024
    },
    formLimit: "500mb",
    jsonLimit: "500mb",
    textLimit: "500mb",
}));

let corsOptions = {
    origin: function (ctx) {
        return ctx.request.header.origin;
        // if (whitelist.indexOf(ctx.request.header.origin) !== -1) {
        //     return ctx.request.header.origin;
        // } else {
        //     return ""
        // }
    },
    credentials: true
}

app.use(cors(corsOptions))
app.use(paramFilter)

app.keys = ["vgis"]
app.use(session({
    rolling: true,
    store: redisStore(config.redis)
}));

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// routes
app.use(router.routes(), router.allowedMethods());

app.use(require('koa-static')(__dirname + '/public'));

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.startAllJobs = function () {
    for (let jName in jobs) {
        schedule.scheduleJob(jobs[jName].timer, jobs[jName].handler)
        jobs[jName].handler()
    }

    //peripheral - modbus tcp, modbus serial, http
    global.peripheralManager = new PeripheralManager();
    global.peripheralManager.PeripheralMastersUpdate().then(() => console.log("Peripheral Masters Init finished"))

    global.maintenance_scheduler = new MaintenanceScheduler(global.db)
    global.maintenance_scheduler.loadSchedule().then(() => {
        console.log("Maintenance Scheduler Ready.")
    })

    global.automation_scheduler = new AutomationScheduler(global.db)
    global.automation_scheduler.loadSchedule().then(() => {
        console.log("Device Automation Scheduler Ready.")
    })

    global.db.models.system.findOne().then(record => {
        let setting = {}
        try {
            setting = JSON.parse(record.setting).mqtt
        }
        catch (err) {}
        //MQTT
        global.mqttmanager = new MQTTManager({
            baseUrl: setting.baseUrl,
            options: {
                clientId: setting.clientId,
                username: setting.username,
                password: setting.password,
            }
        });

        if (setting.baseUrl) {
            global.mqttmanager.start().then(() => console.log("MQTT Init finished"));
        }
        //End of MQTT
    })
}

module.exports = app;
