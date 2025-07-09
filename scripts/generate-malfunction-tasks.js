
const ProtocolTemplate = require('../libs/ProtocolTemplate')
const fs = require('fs').promises
const path = require('path')
let config = require('../config')
const {Op} = require("sequelize");
let dbconfig = config.database.postgres;

async function execute () {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )

    global.db = db

    let AlertLevel = db.models.alert_level
    let Task = db.models.malfunction_task

    await Task.destroy({ where: {} })
    await AlertLevel.destroy({ where: {} })
    let levels = await AlertLevel.bulkCreate([{
        name: "较低",
        level: 1,
        color: "#88C800"
    }, {
        name: "一般",
        level: 2,
        color: "#FADB14"
    }, {
        name: "紧急",
        level: 3,
        color: "#FA8C16"
    }, {
        name: "危险",
        level: 4,
        color: "#F5222D"
    }])

    let records = []
    let startAt = new Date(2025, 0, 1)
    let endAt = new Date(2025, 11, 31)
    let devices = ["冷机", "空压机", "冷却水泵", "冷冻水泵"]
    let types = ["传感器故障", "机组导出故障", "需求不满足故障"]
    let modules = ["冷站", "空压站", "锅炉", "制氮机", "纯水机", "除湿机"]
    let status = ["pending", "undetermined", "solved"]
    let count = 0
    for(let i = new Date(startAt.getTime()); i < endAt; i.setHours(i.getHours() + 1)) {
        let time = new Date(i.getTime())
        let s = status[count % status.length]
        let m = modules[count % modules.length]
        let t = types[count % types.length]
        let l = levels[count % levels.length]
        records.push({
            description: "设备存在故障，请及时检修！",
            type: t,
            status: s,
            module: m,
            levelId: l.id,
            createdAt: time,
            handledAt: s !== "pending" ? time : null,
            solution: s !== "pending" ? "已按照任务描述处理" : null,
            solveTime: s !== "pending" ? 1.5 : null
        })
        count++
    }

    await Task.bulkCreate(records)
    console.log("Fake power-saving tasks generated.")
}

execute()
