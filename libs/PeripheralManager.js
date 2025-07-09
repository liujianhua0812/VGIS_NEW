const {ModbusProtocolType, VgisMaster, ModbusDatatype, VgisPeripheral, VgisError} = require("./ProtocolManager");
const {Op} = require("sequelize");
const {updateSeries} = require("../controllers/instance/data");

class PeripheralManager {

    constructor() {
        this.peripheral = new VgisPeripheral(() => {
        }, (event) => {
            //console.log("modebus.callback", event)
            this.processEvent(event)
        }, (events) => {
            //console.log("HTTP.callback", events)
            events.map(event => {
                this.processEvent(event)
            })
        })
    }

    processEvent(event){
        if (event.err === VgisError.OK) {
            const protocolId = event.id
            let [seriesId, instanceId] = event.pointId.split('/')
            updateSeries(instanceId, seriesId, event.data, protocolId).then()
        }
    }

    async PeripheralMastersUpdate(){
        let protocols = await global.db.models.protocol.findAll(
            {
                where: {
                    [Op.and]: [
                        {
                            isActive: true
                        },
                        {
                            protocolType: ["HTTP", "Modbus Serial", "Modbus TCP"]
                        },
                        {
                            isInterface: false
                        }
                    ]
                }
            })
        const ProtocolTypeMap = {
            "HTTP": ModbusProtocolType.HTTP,
            "Modbus TCP": ModbusProtocolType.ModbusTCP,
            "Modbus Serial": ModbusProtocolType.ModbusSerial
        }
        this.peripheral.setMasters(protocols.map(protocol =>
            new VgisMaster(
                protocol.id,
                ProtocolTypeMap[protocol.protocolType],
                {
                    "addr": protocol.configuration.deviceAddress,
                    "ip": protocol.configuration.ipAddress,
                    "port": protocol.configuration.port,
                    "baudRate": protocol.configuration.baudRate,
                    "com": protocol.configuration.com,
                    "instanceId": protocol.instanceId,
                    "configuration": protocol.configuration,
                    "postAction": protocol.postAction
                },
                protocol.configuration.mapping.map(mapping => ({
                    "addr": parseInt(mapping.register),
                    "dataType": ModbusDatatype[mapping.type],
                    "id": `${mapping.seriesId}/${protocol.instanceId}`
                })),
                protocol.sampleInterval
            )
        ))
    }

    testConnection(type, config) {
        return this.peripheral.testConnection(type, config)
    }
}

exports.PeripheralManager = PeripheralManager;