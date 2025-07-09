let AdmZip = require("adm-zip");
const path = require("path")

exports.show = async (ctx, next) => {
    let System = global.db.models.system
    let record = await System.findOne()
    let setting = {}
    try {
        setting = JSON.parse(record.setting)
    } catch (err) {
    }
    let result = {}
    let attributes = ["siteName", "language", "mqtt", "weather", "email", "alert", "scene"]
    for (let i = 0; i < attributes.length; i++) {
        result[attributes[i]] = setting[attributes[i]]
    }
    setting = result
    ctx.body = {
        data: setting
    }
}

exports.update = async (ctx, next) => {
    let System = global.db.models.system
    let Protocol = global.db.models.protocol
    let Instance = global.db.models.model_instance
    let record = await System.findOne()
    let setting = {}
    try {
        setting = JSON.parse(record.setting)
        // let result = {}
        // let attributes = ["language", "mqtt", "weather", "email", "alert"]
        // for(let i = 0; i < attributes.length; i++) {
        //     result[attributes[i]] = setting[attributes[i]]
        // }
        // setting = result
    } catch (err) {
    }

    ctx.request.body.setting = JSON.parse(ctx.request.body.setting)

    if (ctx.request.files.model) {
        let file = ctx.request.files.model
        let zip = new AdmZip(file.path);
        let entries = zip.getEntries()
        let config = entries.find(item => item.entryName === "config.json").getData().toString("utf-8")
        try {
            ctx.request.body.setting.scene = JSON.parse(config)
        } catch {
            ctx.request.body.setting.scene = {name: "Default Scene", main: "scene.gltf"}
        }
        zip.extractAllTo(/*target path*/ path.join(__dirname, "../../public/models"), /*overwrite*/ true)
    }
    record.setting = JSON.stringify(Object.assign(setting, ctx.request.body.setting))

    record = await record.save()
    setting = {}
    try {
        setting = JSON.parse(record.setting)
    } catch (err) {}
    if (setting.mqtt && setting.mqtt.baseUrl) {
        global.mqttmanager.restart().then(r => console.log("MQTT setting updated."))
    }
    else {
        //MQTT url is null
        global.mqttmanager.close()
    }
    ctx.body = {
        data: setting
    }
}