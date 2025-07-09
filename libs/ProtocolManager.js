"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return { "default": mod }
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VgisPeripheral = exports.VgisSlave = exports.VgisMaster = exports.ModbusRegister = exports.ModbusDatatype = exports.ModbusProtocolType = exports.VgisModbusEvent = exports.VgisEvent = exports.VgisError = exports.VgisProbe = exports.VgisProbeType = void 0;
const crypto_1 = __importDefault(require("crypto"));
const serialport_1 = __importDefault(require("serialport"));
var ByteLength = serialport_1.default.ByteLengthParser;
var SPort = serialport_1.default.SerialPort;
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('smartcorr');
const axios = require('axios');
const FormData = require("form-data");
const ModbusRTU = require('modbus-serial');
var VgisProbeType;
(function (VgisProbeType) {
    VgisProbeType[VgisProbeType["HER"] = 1] = "HER";
    VgisProbeType[VgisProbeType["LPR"] = 2] = "LPR";
})(VgisProbeType = exports.VgisProbeType || (exports.VgisProbeType = {}));

class VgisProbe {
    constructor(id, type, config, interval) {
        this._intervalId = null;
        this.id = id;
        this.type = type;
        this.addr = config.addr;
        this.interval = interval;
        this.com = config.com;
        this.baudrate = config.baudrate;
    }
}

exports.VgisProbe = VgisProbe;
var VgisError;
(function (VgisError) {
    VgisError[VgisError["OK"] = 0] = "OK";
    VgisError[VgisError["SerialPortOpenError"] = 1] = "SerialPortOpenError";
    VgisError[VgisError["SerialPortTimeout"] = 2] = "SerialPortTimeout";
    VgisError[VgisError["SerialPortDataError"] = 3] = "SerialPortDataError";
    VgisError[VgisError["StartUpCondition"] = 4] = "StartUpCondition";
    VgisError[VgisError["ProbeConnectionFault"] = 5] = "ProbeConnectionFault";
    VgisError[VgisError["AutoRanging"] = 6] = "AutoRanging";
    VgisError[VgisError["ModbusError"] = 7] = "ModbusError";
    VgisError[VgisError["SlaveSerialPortOpenError"] = 8] = "SlaveSerialPortOpenError";
    VgisError[VgisError["Other"] = 9] = "Other";
    VgisError[VgisError["HTTPError"] = 10] = "HTTPError";
    VgisError[VgisError["HTTPPostActionError"] = 11] = "HTTPPostActionError";
    VgisError[VgisError["HTTPResponseInvalid"] = 12] = "HTTPResponseInvalid";
    VgisError[VgisError["SeriesNameInvalid"] = 13] = "SeriesNameInvalid";
})(VgisError = exports.VgisError || (exports.VgisError = {}));

class VgisEvent {
    constructor(id, data, err) {
        this.id = id;
        this.data = data;
        this.err = err;
    }
}

exports.VgisEvent = VgisEvent;

class VgisModbusEvent {
    constructor(id, pointId, data, err) {
        this.id = id;
        this.pointId = pointId;
        this.data = data;
        this.err = err;
    }
}

exports.VgisModbusEvent = VgisModbusEvent;
var ModbusProtocolType;
(function (ModbusProtocolType) {
    ModbusProtocolType[ModbusProtocolType["ModbusTCP"] = 4] = "ModbusTCP";
    ModbusProtocolType[ModbusProtocolType["ModbusSerial"] = 8] = "ModbusSerial";
    ModbusProtocolType[ModbusProtocolType["HTTP"] = 12] = "HTTP";
})(ModbusProtocolType = exports.ModbusProtocolType || (exports.ModbusProtocolType = {}));
var ModbusDatatype;
(function (ModbusDatatype) {
    ModbusDatatype[ModbusDatatype["SIGNED"] = 0] = "SIGNED";
    ModbusDatatype[ModbusDatatype["SIGNED_SWAP"] = 1] = "SIGNED_SWAP";
    ModbusDatatype[ModbusDatatype["FLOAT"] = 2] = "FLOAT";
    ModbusDatatype[ModbusDatatype["FLOAT_SWAP"] = 3] = "FLOAT_SWAP";
    ModbusDatatype[ModbusDatatype["STRING"] = 4] = "STRING";
    ModbusDatatype[ModbusDatatype["SHORT"] = 5] = "SHORT";
    ModbusDatatype[ModbusDatatype["SHORT_SWAP"] = 6] = "SHORT_SWAP";
    ModbusDatatype[ModbusDatatype["FLOAT_LE"] = 7] = "FLOAT_LE";
    ModbusDatatype[ModbusDatatype["FLOAT_LE_SWAP"] = 8] = "FLOAT_LE_SWAP";
})(ModbusDatatype = exports.ModbusDatatype || (exports.ModbusDatatype = {}));

class ModbusRegister {
}

exports.ModbusRegister = ModbusRegister;

class VgisMaster {
    constructor(id, type, config, mapping, interval) {
        this._intervalId = null;
        this.id = id;
        this.type = type;
        this.addr = config.addr;
        this.interval = interval;
        if (type === ModbusProtocolType.ModbusTCP) {
            this.ip = config.ip;
            this.port = config.port;
            this.regs = mapping;
        }
        else if (type === ModbusProtocolType.ModbusSerial) {
            this.com = config.com;
            this.baudrate = config.baudrate;
            this.regs = mapping;
        }
        else {
            throw Error();
        }
    }
}

exports.VgisMaster = VgisMaster;

class VgisSlave {
    constructor(id, type, config, mapping) {
        this.baudrate = 0;
        this.tcpServer = null;
        this.serialPort = null;
        this.id = id;
        this.type = type;
        this.addr = config.addr;
        let realMapping = new Map();
        mapping.forEach((value, key) => {
            realMapping.set(key, value);
            realMapping.set(key + 1, key);
        });
        this.mapping = realMapping;
        if (type === ModbusProtocolType.ModbusTCP) {
            this.port = config.port;
        }
        else if (type === ModbusProtocolType.ModbusSerial) {
            this.com = config.com;
            this.baudrate = config.baudrate;
        }
        else {
            throw Error();
        }
    }
}

exports.VgisSlave = VgisSlave;

class VgisPeripheral {
    constructor(probeCallback, modbusCallback, httpCallback, fetchData) {
        this.probeDigest = "";
        this.masterDigest = "";
        this.slaveDigest = "";
        this.isConsuming = false;
        this.isRunning = false;
        this.probes = [];
        this.masters = [];
        this.slaves = [];
        this.queue = [];
        this.modbusClient = new ModbusRTU();
        this.httpClient = axios;
        this.httpCallback = httpCallback
        this.probeCallback = probeCallback;
        this.modbusCallback = modbusCallback;
        this.fetchData = fetchData;
        this.isRunning = true;
    }

    testConnection(type, config) {
        return new Promise(resolve => {
            if (type === VgisProbeType.HER || type === VgisProbeType.LPR) {
                const port = new SPort({ path: `COM${config.com}`, autoOpen: false, baudRate: config.baudrate });
                const parser = port.pipe(new ByteLength({ length: type === VgisProbeType.HER ? 7 : 15 }));
                port.open(err => {
                    if (err) {
                        resolve([false, '']);
                        return;
                    }
                    port.write([config.addr]);
                    const timeoutId = setTimeout(() => {
                        port.close();
                        resolve([false, '']);
                    }, 1000);
                    parser.on('data', (data) => {
                        clearTimeout(timeoutId);
                        port.close();
                        resolve([true, data.toString()]);
                    });
                });
            }
            else if (type === ModbusProtocolType.ModbusTCP) {
                this.modbusClient.connectRTU(`COM${config.com}`, { baudRate: config.baudrate }).then(() => {
                    this.modbusClient.setID(config.addr);
                    if (config.addr > 30000 && config.addr < 40000) {
                        this.modbusClient.readInputRegisters(config.addr - 30001, 2).then((result) => {
                            this.modbusClient.close();
                            // const value = (result.data[0] << 16) | result.data[1];
                            resolve([true, '0']);
                        });
                    }
                    else if (config.addr > 40000 && config.addr < 50000) {
                        this.modbusClient.readHoldingRegisters(config.addr - 40001, 2).then((result) => {
                            this.modbusClient.close();
                            // const value = (result.data[0] << 16) | result.data[1];
                            resolve([true, '0']);
                        });
                    }
                }, (reason) => {
                    this.modbusClient.close();
                    debug(reason);
                    resolve([false, '']);
                });
            }
            else if (type === ModbusProtocolType.ModbusSerial) {
                this.modbusClient.connectTCP(config.ip, { port: config.port }).then(() => {
                    this.modbusClient.setID(config.addr);
                    if (config.addr > 30000 && config.addr < 40000) {
                        this.modbusClient.readInputRegisters(config.addr - 30001, 2).then((result) => {
                            this.modbusClient.close();
                            // const value = (result.data[0] << 16) | result.data[1];
                            resolve([true, '0']);
                        });
                    }
                    else if (config.addr > 40000 && config.addr < 50000) {
                        this.modbusClient.readHoldingRegisters(config.addr - 40001, 2).then((result) => {
                            this.modbusClient.close();
                            // const value = (result.data[0] << 16) | result.data[1];
                            resolve([true, '0']);
                        });
                    }
                }, (reason) => {
                    this.modbusClient.close();
                    debug(reason);
                    resolve([false, '']);
                });
            }
            else if (type === ModbusProtocolType.HTTP) {
                // TODO: 添加HTTP测试的数据
                let body
                switch (config.headers[0].value) {
                    case "application/json":
                    case "application/xml":
                    case "text/plain":
                        body = config.rawBody
                        break;
                    case "application/x-www-form-urlencoded":
                        body = config.body
                        break;
                    case "multipart/form-data":
                        // pack form-data
                        let params = new FormData()
                        config.body.map(obj => {
                            if (obj.type === 'Text') {
                                params.append(obj.name, obj.value)
                            } else if (obj.type === 'File') {
                                console.log("Append File...NOT implemented")
                            }
                        })
                        break;
                    default:
                        body = config.body
                }
                this.httpClient({
                    method: config.method,
                    url: config.address,
                    params: Object.assign({}, ...config.query.map((x) => ({[x.name]: x.value}))),
                    headers: Object.assign({}, config.headers),
                    data: body
                }).then(function (response) {
                    // TODO: 返回 headers和body两部分，用Object来返回
                    resolve({headers: response.headers, body: response.data});
                }).catch(err => {
                    console.error(err);
                    // TODO: 返回 headers和body两部分，用Object来返回
                    resolve({headers: err.response.headers, body: err.response.data});
                })
            } else {
                throw Error();
            }
        });
    }

    setProbes(items) {
        const data = JSON.stringify(items);
        const newDigest = crypto_1.default.createHash('md5').update(data).digest('hex');
        if (newDigest === this.probeDigest)
            return;
        this.probeDigest = newDigest;
        // clear old intervals
        this.probes.forEach((probe) => {
            if (probe._intervalId)
                clearInterval(probe._intervalId);
        });
        this.queue.length = 0;
        this.probes = [...items]; // set new probes
        items.forEach((probe) => {
            probe._intervalId = setInterval(() => {
                if (!this.isRunning)
                    return;
                this.queue.push(probe);
                this.notify();
            }, probe.interval * 1000);
        });
    }

    setMasters(items) {
        const data = JSON.stringify(items);
        const newDigest = crypto_1.default.createHash('md5').update(data).digest('hex');
        if (newDigest === this.masterDigest)
            return;
        this.masterDigest = newDigest;
        // clear old intervals
        this.masters.forEach((master) => {
            if (master._intervalId)
                clearInterval(master._intervalId);
        });
        this.queue.length = 0;
        this.masters = [...items]; // set new masters
        items.forEach((master) => {
            master._intervalId = setInterval(() => {
                if (!this.isRunning)
                    return;
                this.queue.push(master);
                this.notify();
            }, master.interval * 1000);
        });
    }

    async setSlaves(items) {
        const data = JSON.stringify(items, (key, value) => {
            const originalObject = value;
            if (originalObject instanceof Map) {
                return {
                    dataType: 'Map',
                    value: Array.from(originalObject.entries()),
                };
            }
            else {
                return value;
            }
        });
        const newDigest = crypto_1.default.createHash('md5').update(data).digest('hex');
        if (newDigest === this.slaveDigest)
            return;
        this.slaveDigest = newDigest;
        if (this.isRunning)
            await this.stopSlaves();
        this.slaves = [...items];
        if (this.isRunning)
            await this.startSlaves();
    }

    async stopSlaves() {
        for (let slave of this.slaves) {
            if (slave.type === ModbusProtocolType.ModbusSerial) {
                if (slave.serialPort) {
                    if (slave.serialPort.isOpen) {
                        try {
                            await Promise.race([
                                this.wait(5000),
                                new Promise((resolve, reject) => {
                                    var _a;
                                    (_a = slave.serialPort) === null || _a === void 0 ? void 0 : _a.close(resolve);
                                })
                            ]);
                        }
                        catch (e) {
                            debug("port close error, 333", e);
                        }
                    }
                    else {
                        debug("port is not open, 336");
                    }
                }
            }
            else {
                if (slave.tcpServer) {
                    try {
                        await Promise.race([
                            this.wait(5000),
                            new Promise((resolve, reject) => {
                                slave.tcpServer.close(resolve);
                            })
                        ]);
                    }
                    catch (e) {
                        debug("port close error, 349", e);
                    }
                }
            }
        }
    }
    startSlaves() {
        this.slaves.forEach((slave) => {
            if (slave.type === ModbusProtocolType.ModbusSerial) {
                this.startSerialSlave(slave);
            }
            else {
                const vector = {
                    getHoldingRegister: (reg) => this.readMappedReg(slave, reg + 40001, true).then(buf => buf.readUInt16BE((reg & 1) ? 2 : 0)),
                    getInputRegister: (reg) => this.readMappedReg(slave, reg + 30001, true).then(buf => buf.readUInt16BE((reg & 1) ? 2 : 0))
                };
                slave.tcpServer = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: slave.port, unitID: slave.addr });
            }
        });
    }
    start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.startSlaves();
    }
    async stop() {
        this.isRunning = false;
        this.queue.length = 0;
        await this.stopSlaves();
    }
    listPorts() {
        return SPort.list();
    }

    startSerialSlave(slave) {
        const port = new SPort({ path: `COM${slave.com}`, autoOpen: false, baudRate: slave.baudrate });
        const parser = port.pipe(new ByteLength({ length: 8 }));
        port.open(err => {
            if (err) {
                this.fetchData(slave.id, VgisError.SlaveSerialPortOpenError);
                setTimeout(() => {
                    this.startSerialSlave(slave);
                }, 30000);
                return;
            }
            parser.on('data', async (data) => {
                const crcIn = data.readUInt16LE(data.length - 2);
                if (crcIn !== VgisPeripheral.crc16(data.slice(0, -2))) {
                    debug('wrong crc data received');
                    return;
                }
                const address = data.readUInt8(0);
                const code = data.readUInt8(1);
                if (address !== slave.addr || (code !== 3 && code !== 4))
                    return;
                const startReg = data.readUInt16BE(2) + (code === 3 ? 40001 : 30001);
                const counter = data.readUInt16BE(4);
                const codeLength = 3 + 2 * counter;
                const buf = Buffer.alloc(codeLength + 2); // add 2 crc bytes
                buf.writeUInt8(address, 0);
                buf.writeUInt8(code, 1);
                buf.writeUInt8(2 * counter, 2);
                for (let i = 0; i < counter / 2; ++i) {
                    const val = await this.readMappedReg(slave, startReg + i * 2, false);
                    val.copy(buf, 3 + i * 4);
                }
                buf.writeUInt16LE(VgisPeripheral.crc16(buf.slice(0, -2)), codeLength);
                port.write(buf);
            });
        });
        slave.serialPort = port;
    }
    async readMappedReg(slave, reg, isTCP) {
        let id;
        if (!slave.mapping.has(reg))
            return Buffer.alloc(4);
        const idOrReg = slave.mapping.get(reg);
        if (idOrReg === undefined)
            return Buffer.alloc(4);
        if (typeof idOrReg === 'number')
            id = slave.mapping.get(idOrReg);
        else
            id = idOrReg;
        const data = await this.fetchData(id, VgisError.OK);
        const val = data[0];
        const type = data[1];
        return dataToBuffer(val, type, isTCP);
    }
    closeSerialPort(port) {
        try {
            port.close();
        }
        catch (e) {
            debug(e);
            debug('SerialPort close error');
        }
    }
    readSerialData(probe) {
        return new Promise((resolve, reject) => {
            const port = new SPort({ path: `COM${probe.com}`, autoOpen: false, baudRate: probe.baudrate });
            const length = probe.type === VgisProbeType.HER ? 7 : 15;
            const parser = port.pipe(new ByteLength({ length: length }));
            parser.on('error', (err) => {
                this.probeCallback(new VgisEvent(probe.id, [0], VgisError.SerialPortOpenError));
                resolve();
            });
            port.open(err => {
                if (err) {
                    this.probeCallback(new VgisEvent(probe.id, [0], VgisError.SerialPortOpenError));
                    resolve();
                    return;
                }
                port.write([probe.addr || 83]);
                const timeoutId = setTimeout(() => {
                    this.probeCallback(new VgisEvent(probe.id, [0], VgisError.SerialPortTimeout));
                    this.closeSerialPort(port);
                    resolve();
                }, 1000);
                parser.on('data', (data) => {
                    clearTimeout(timeoutId);
                    this.closeSerialPort(port);
                    const rawData = data.toString();
                    const rawValue = rawData.split(',')[0];
                    const rawRate = rawData.split(',')[1];
                    try {
                        const value = parseInt(rawValue);
                        const rate = parseInt(rawRate);
                        if (value === -999999 || rate === -999999)
                            this.probeCallback(new VgisEvent(probe.id, probe.type === VgisProbeType.HER ? [value] : [value, rate], VgisError.StartUpCondition));
                        else if (value === -999998 || rate === -999998 || value === -999997 || rate === -999997)
                            this.probeCallback(new VgisEvent(probe.id, probe.type === VgisProbeType.HER ? [value] : [value, rate], VgisError.ProbeConnectionFault));
                        else if (value === -999996 || rate === -999996)
                            this.probeCallback(new VgisEvent(probe.id, probe.type === VgisProbeType.HER ? [value] : [value, rate], VgisError.AutoRanging));
                        else if (value < 0)
                            this.probeCallback(new VgisEvent(probe.id, probe.type === VgisProbeType.HER ? [value] : [value, rate], VgisError.Other));
                        else {
                            this.probeCallback(new VgisEvent(probe.id, probe.type === VgisProbeType.HER ? [value] : [value, rate], VgisError.OK));
                        }
                        resolve();
                    }
                    catch (e) {
                        debug(e);
                        this.probeCallback(new VgisEvent(probe.id, [0, 0], VgisError.SerialPortDataError));
                        resolve();
                    }
                });
            });
        });
    }

    readHTTPData(master) {
        // TODO: 读取HTTP的数据，包括postAction的处理也在这里进行
        // 处理结果传给this.httpCallback，这方法在构造函数里传进去
        let body, result, resultEvent = []
        switch (master.configuration.headers[0].value) {
            case "application/json":
            case "application/xml":
            case "text/plain":
                body = master.configuration.rawBody
                break;
            case "application/x-www-form-urlencoded":
                body = master.configuration.body
                break;
            case "multipart/form-data":
                // pack form-data
                let params = new FormData()
                master.configuration.body.map(obj => {
                    if (obj.type === 'Text') {
                        params.append(obj.name, obj.value)
                    } else if (obj.type === 'File') {
                        console.log("Append File...NOT implemented")
                    }
                })
                break;
            default:
                body = master.configuration.body
        }
        this.httpClient({
            method: master.configuration.method,
            url: master.configuration.address,
            params: Object.assign({}, ...master.configuration.query.map((x) => ({[x.name]: x.value}))),
            headers: Object.assign({}, master.configuration.headers),
            data: body
        }).then(function (response) {
            result = response
            return global.db.models.model_instance.findByPk(master.instanceId)
        }).then(modelInstance => {
            return global.db.models.time_series.findAll({where: {modelId: modelInstance.modelId}})
        }).then(timeSeries => {
            let validTimeSeriesMap = {}
            timeSeries.map(e => {
                validTimeSeriesMap[e.name] = e.id
            })
            try {
                let postFunction = new Function("return " + master.postAction)
                let resultValue = postFunction()(result.data);
                resultValue.data.map(nValue => {
                    if ((nValue.time instanceof Date) &&
                        (typeof nValue.name == "string") &&
                        (typeof nValue.value == "string" || typeof nValue.value == "number")) {
                        if (nValue.name in validTimeSeriesMap) {
                            const seriesId = validTimeSeriesMap[nValue.name]
                            resultEvent.push(new VgisModbusEvent(master.id, `${seriesId}/${master.instanceId}`, nValue.value, VgisError.OK))
                        } else {
                            console.log("Series Name Not Found")
                            resultEvent.push(new VgisModbusEvent(master.id, '', [0], VgisError.SeriesNameInvalid))
                        }
                    } else {
                        console.log("INVALID RESPONSE!")
                        resultEvent.push(new VgisModbusEvent(master.id, '', [0], VgisError.HTTPResponseInvalid))
                    }
                })
                this.httpCallback(resultEvent);
            } catch (e) {
                console.log("Post Action Execution Failed!\n", e);
                this.httpCallback([new VgisModbusEvent(master.id, '', [0], VgisError.HTTPPostActionError)]);
            }
        }).catch(err => {
            console.log(err)
            this.httpCallback([new VgisModbusEvent(master.id, '', [0], VgisError.HTTPError)]);
        });
    }

    async readModbusTCPData(master) {
        await this.readModbusData(master, async () => {
            await this.modbusClient.connectTCP(master.ip || '127.0.0.1', { port: master.port });
        });
    }
    async readModbusSerialData(master) {
        await this.readModbusData(master, async () => {
            await this.modbusClient.connectRTUBuffered(`COM${master.com}`, { baudRate: master.baudrate });
        });
    }
    async readModbusData(master, createClient) {
        this.modbusClient.setTimeout(5000);
        this.modbusClient.setID(master.addr || 0);
        try {
            debug(master.ip, master.port, master.regs.length, 'start');
            for (let reg of master.regs) {
                if (!this.modbusClient.isOpen) {
                    await createClient();
                }
                let length = 2;
                if (reg.dataType === ModbusDatatype.SHORT || reg.dataType === ModbusDatatype.SHORT_SWAP) {
                    length = 1;
                }
                else if (reg.dataType === ModbusDatatype.STRING) {
                    length = reg.length;
                }
                if (reg.addr !== undefined) {
                    if (reg.addr > 30000 && reg.addr < 40000) {
                        const result = await this.modbusClient.readInputRegisters(reg.addr - 30001, length);
                        const value = bufferToData(result.buffer, reg.dataType);
                        this.modbusCallback(new VgisModbusEvent(master.id, reg.id || '', value, VgisError.OK));
                    }
                    else if (reg.addr > 40000 && reg.addr < 50000) {
                        const result = await this.modbusClient.readHoldingRegisters(reg.addr - 40001, length);
                        const value = bufferToData(result.buffer, reg.dataType);
                        this.modbusCallback(new VgisModbusEvent(master.id, reg.id || '', value, VgisError.OK));
                    }
                }
                debug(reg.addr, 'success');
            }
            await this.closeClient();
            debug('closed');
        }
        catch (e) {
            debug(e);
            try {
                await this.closeClient();
            }
            catch (e) {
            }
            this.modbusCallback(new VgisModbusEvent(master.id, '', [0], VgisError.ModbusError));
        }
    }
    async closeClient() {
        debug('try closing...');
        if (this.modbusClient.isOpen) {
            return Promise.race([this.wait(5000), new Promise((resolve, reject) => {
                this.modbusClient.close(resolve);
            })]);
        }
        else {
            debug('port not open');
        }
    }

    static crc16(buffer) {
        let crc = 0xFFFF;
        let odd;
        for (let i = 0; i < buffer.length; i++) {
            crc = crc ^ buffer[i];
            for (let j = 0; j < 8; j++) {
                odd = crc & 0x0001;
                crc = crc >> 1;
                if (odd) {
                    crc = crc ^ 0xA001;
                }
            }
        }
        return crc;
    }
    notify() {
        if (this.isConsuming)
            return;
        this.consumeNext();
    }
    wait(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('timeout succeeded ' + ms)), ms);
        });
    }
    async consumeNext() {
        this.isConsuming = true;
        if (this.queue.length > 0) {
            try {
                await this.consume(this.queue.shift());
            }
            catch (e) {
                debug(e);
            }
            try {
                await this.wait(500);
            }
            catch (e) {
            }
            await this.consumeNext();
        }
        else {
            this.isConsuming = false;
        }
    }
    async consume(probe) {
        if (probe.type === VgisProbeType.HER || probe.type === VgisProbeType.LPR) {
            await this.readSerialData(probe);
        }
        else if (probe.type === ModbusProtocolType.ModbusTCP) {
            await this.readModbusTCPData(probe);
        }
        else if (probe.type === ModbusProtocolType.ModbusSerial) {
            await this.readModbusSerialData(probe);
        }
        else if(probe.type === ModbusProtocolType.HTTP){
            await this.readHTTPData(probe)
        }
    }
}

exports.VgisPeripheral = VgisPeripheral;

function bufferToData(buf, type) {
    if (type === ModbusDatatype.SIGNED) {
        return buf.readInt32BE();
    }
    else if (type === ModbusDatatype.SIGNED_SWAP) {
        swapBuffer(buf);
        return buf.readInt32BE();
    }
    else if (type === ModbusDatatype.FLOAT) {
        return buf.readFloatBE();
    }
    else if (type === ModbusDatatype.FLOAT_SWAP) {
        swapBuffer(buf);
        return buf.readFloatBE();
    }
    else if (type === ModbusDatatype.STRING) {
        return buf.toString();
    }
    else if (type === ModbusDatatype.SHORT) {
        return buf.readInt16BE();
    }
    else if (type === ModbusDatatype.SHORT_SWAP) {
        swapBuffer(buf);
        return buf.readInt16BE();
    }
    else if (type === ModbusDatatype.FLOAT_LE) {
        return buf.readFloatLE();
    }
    else if (type === ModbusDatatype.FLOAT_LE_SWAP) {
        swapBuffer(buf);
        return buf.readFloatLE();
    }
    else {
        return undefined;
    }
}

function dataToBuffer(data, type, isTCP) {
    let buf = Buffer.alloc(4);
    if (type === ModbusDatatype.SIGNED) {
        buf.writeInt32BE(data);
    }
    else if (type === ModbusDatatype.SIGNED_SWAP) {
        buf.writeInt32BE(data);
        swapBuffer(buf);
    }
    else if (type === ModbusDatatype.FLOAT) {
        if (isTCP) {
            buf.writeFloatBE(data);
            swapBuffer(buf);
        }
        else {
            buf.writeFloatBE(data);
        }
    }
    else if (type === ModbusDatatype.FLOAT_SWAP) {
        if (isTCP) {
            buf.writeFloatLE(data);
        }
        else {
            buf.writeFloatLE(data);
            swapBuffer(buf);
        }
    }
    else if (type === ModbusDatatype.STRING) {
        buf = Buffer.alloc(data.length);
        buf.write(data);
    }
    else if (type === ModbusDatatype.FLOAT_LE) {
        if (isTCP) {
            buf.writeFloatLE(data);
            swapBuffer(buf);
        }
        else {
            buf.writeFloatLE(data);
        }
    }
    else if (type === ModbusDatatype.FLOAT_LE_SWAP) {
        if (isTCP) {
            buf.writeFloatBE(data);
        }
        else {
            buf.writeFloatBE(data);
            swapBuffer(buf);
        }
    }
    return buf;
}

function swapBuffer(buf) {
    let tmp = buf[0];
    buf[0] = buf[2];
    buf[2] = tmp;
    tmp = buf[1];
    buf[1] = buf[3];
    buf[3] = tmp;
}

//# sourceMappingURL=smart-corr-pheripheral.js.map
