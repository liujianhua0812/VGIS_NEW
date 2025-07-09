
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

    let Task = db.models.power_saving_task

    await Task.destroy({ where: {} })

    let records = []
    let now = new Date().getTime()
    let devices = ["冷机", "空压机", "冷却水泵", "冷冻水泵"]
    let modules = ["冷机", "空压站", "冷却水系统", "冷冻水系统"]
    let status = ["pending", "undetermined", "solved"]
    for (let i = 0; i < 60; i++) {
        let time = new Date(now)
        time.setMinutes(i * 6)
        let s = status[i % status.length]
        let m = modules[i % modules.length]
        records.push({
            description: "设备有不必要的超额能耗，请在不需要使用时及时停机",
            status: s,
            module: m,
            handledAt: s !== "pending" ? time : null,
            solution: s !== "pending" ? "已按照任务描述处理" : null,
            solveTime: s !== "pending" ? 1.5 : null
        })
    }

    await Task.bulkCreate(records)
    console.log("Fake power-saving tasks generated.")
}

execute()
