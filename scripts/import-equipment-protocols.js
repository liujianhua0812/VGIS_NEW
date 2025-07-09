
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

    let Model = db.models.model
    let Instance = db.models.model_instance
    let Protocol = db.models.protocol

    let MODEL_NAMES = [
        "FanCoilUnit",
        "AirConditionSensor",
        "AirHandlingUnit",
        "Elevator",
        "ExhaustAirFan",
        "HotwaterPumpGroup",
        "HotwaterPump",
        "JSJ",
        "SewerPump",
        "PreCoolingAirUnit",
        "SupplyAirFan",
        "WSJWS"
    ]

    let models = await Model.findAll({
        where: {
            modelId: {
                [Op.in]: MODEL_NAMES
            }
        }
    })

    let instances = await Instance.findAll({
        where: {
            modelId: {
                [Op.in]: models.map(item => item.id)
            }
        }
    })

    await Protocol.destroy({
        where: {
            instanceId: {
                [Op.in]: instances.map(item => item.id)
            }
        }
    })

    let protocols = []
    for(let i = 0; i < instances.length; i++) {
        let instance = instances[i]
        protocols = protocols.concat((await ProtocolTemplate.generateFull(instance)).map(item => Object.assign({}, item, {instanceId: instance.id, isActive: true})))
    }

    await Protocol.bulkCreate(protocols)
    console.log("Stadium equipment protocols loaded.")
}

execute()
