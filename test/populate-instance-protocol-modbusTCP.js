require('../libs/Date')()
const Op = require('sequelize').Op
let config = require('../config')
let dbconfig = config.database.postgres;
const timeout = 3000
let db = null

const fs = require("fs");
const {parse} = require("csv-parse");

async function importData() {
    db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )
    let Instance = db.models.model_instance
    let Protocols = db.models.protocol

    let protocols = await Protocols.findAll({
        where: {
            protocolType: {
                [Op.in]: ["Modbus TCP"]
            }
        }
    })

    protocols.map(e => {
        console.log(e.instanceId, e.name)
    })

    let instances = await Instance.findAll({
        where: {
            modelId: ["54619d4d-464c-487e-a0bb-f4680b6f6726", "4cb63d61-607a-4afd-99d8-6d51c1feba31"]
        }
    })
    let instanceMap = {}
    instances.map(e => {
        instanceMap[e.name] = e.id
    })

    let devices = {}
    //model ID = 4cb63d61-607a-4afd-99d8-6d51c1feba31
    const seriesIdHERMap = {
        "Temperature": "e1855140-1257-4acc-870d-9d1c7e2ad1af",
        "Corrosion Rate": "285c99e4-e47e-493d-8f33-9d32839cabb5",
        "Metal Loss": "9d0f5579-9b04-4b53-ac83-a3233a4ea7d0"
    }

    //model ID = 54619d4d-464c-487e-a0bb-f4680b6f6726
    const seriesIdUTMap = {
        "Temperature": "115a6b93-8c80-4372-bbc4-f5737b04a962",
        "Corrosion Rate": "5c2ad6c7-a2f4-4d6d-b900-8afb48bcf395",
        "Thickness": "abfd0b70-4ee0-4d2f-a880-893eb68ce39a",
    }

    const dataTypeMap = {
        "Float": "FLOAT",
        "Float Swap": "FLOAT_SWAP",
        "Signed": "SIGNED"
    }
    await fs.createReadStream("./Slave2.csv")
        .pipe(parse({delimiter: ",", from_line: 2}))
        .on("data", function (row) {
            let registerAddr = row[0]
            let timeout = row[1]
            let invalidValue = row[2]
            let dataType = row[3]
            let point = row[4]
            let device = row[5]
            let plant = row[6]

            const ssdls = [
                "DS1-SSDL01",
                "DS2-SSDL04",
                "DS2-SSDL05",
                "DS2-SSDL06",
                "DS2-SSDL07",
                "DS2-SSDL08",
                "MJE20-SSDL09",
                "MJE20-SSDL10",
                "MJE22-SSDL11",
                "MJE22-SSDL12",
                "MJE24-SSDL13",
                "MJE24-SSDL14"
            ]
            if (ssdls.includes(plant)) {
                device = plant + "-" + device.toUpperCase()
                // console.log(device)
            }


            if (!(device in devices)) {
                devices[device] = {
                    "type": "unknown",
                    "data": [],
                    "plant": plant
                }
            }
            devices[device].data.push({
                "registerAddr": registerAddr,
                "dataType": dataType,
                "point": point
            })

            if (point == "Thickness") {
                devices[device].type = "UT"
            }
            if (point == "Metal Loss") {
                devices[device].type = "HER"
            }

        }).on("end", function () {

            // console.log(devices)
            let records = []
            for (let name in devices) {
                if (name in instanceMap) {
                    let instanceId = instanceMap[name]
                    let configurationStr = {
                        "method": "",
                        "address": "",
                        "ipAddress": "192.168.1.93",
                        "port": "502",
                        "headers": [
                            {
                                "name": "Content-Type",
                                "value": "application/json",
                                "description": "",
                                "disabled": true
                            }
                        ],
                        "query": [
                            {
                                "name": "",
                                "value": "",
                                "description": ""
                            }
                        ],
                        "body": [
                            {
                                "name": "",
                                "value": "",
                                "type": "Text",
                                "description": "",
                                "disabled": false
                            }
                        ],
                        "rawBody": "",
                        "com": "",
                        "baudRate": "",
                        "deviceAddress": "1",
                        "mapping": []
                    }

                    devices[name].data.map(e => {
                        if (devices[name].type == 'UT') {
                            configurationStr["mapping"].push({
                                "register": e.registerAddr,
                                "type": dataTypeMap[e.dataType],
                                "seriesId": seriesIdUTMap[e.point]
                            })
                        } else if (devices[name].type == 'HER') {
                            configurationStr["mapping"].push({
                                "register": e.registerAddr,
                                "type": dataTypeMap[e.dataType],
                                "seriesId": seriesIdHERMap[e.point]
                            })
                        } else {
                            console.log(name, devices[name])
                            throw err
                        }
                    })

                    // console.log(configurationStr)

                    records.push({
                        name: name,
                        sampleInterval: 10,
                        protocolType: 'Modbus TCP',
                        isInterface: false,
                        configurationStr: JSON.stringify(configurationStr),
                        isActive: false,
                        postAction: 'function (data) {\n    /* Write your code here */\n    return data;\n}',
                        instanceId: instanceId
                    })
                } else {
                    //in smartcorr, not found in vgis
                    console.log("not found in vgis:", name, devices[name].plant)
                }
            }


            console.log("----------------------------")
            for (let name in instanceMap) {
                if (name in devices) {

                } else {
                    console.log("not found in smartcorr:", name)
                }
            }

            // console.log(records)
            Protocols.bulkCreate(records).then(res=>{
                console.log("Finished...........")
            })
        })
}

async function populate() {
    // let Model = db.models.model
    // let Instance = db.models.model_instance
    // let TimeSeries = db.models.time_series
    // let SeriesValue = db.models.series_value
    // let models = await Model.findAll({
    //     where: {
    //         name: {
    //             [Op.in]: ["Tank", "Separator"]
    //         }
    //     }
    // })
    // let instances = await Instance.findAll({
    //     where: {
    //         modelId: {
    //             [Op.in]: models.map(item => item.id)
    //         }
    //     },
    //     include: [{
    //         model: Model,
    //         include: [TimeSeries]
    //     }]
    // })
    // let time = new Date(), data = []
    // for(let i = 0; i < instances.length; i++) {
    //     let instance = instances[i]
    //     for(let j = 0; j < instance.model.time_series.length; j++) {
    //         let series = instance.model.time_series[j]
    //         data.push({
    //             instanceId: instance.id,
    //             seriesId: series.id,
    //             time,
    //             value: (Math.random() * 100).toFixed(series.precision || 3)
    //         })
    //     }
    // }
    // await SeriesValue.bulkCreate(data)
}

console.log("Start populating data.")

importData().then(result => {
    console.log("Old data cleared.")
    // setInterval(function () {
    //     populate().then(result => {
    //         console.log(`Modbus TCP Protocol data populated at [${new Date().format('yyyy-MM-dd hh:mm:ss')}]`)
    //     })
    // }, timeout)
})
