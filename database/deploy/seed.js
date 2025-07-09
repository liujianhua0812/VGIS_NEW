let xlsx = require('node-xlsx')
const path = require('path')
const fs = require('fs')

module.exports = async function (db) {
    let PID = db.models.pid
    let Account = db.models.account
    let User = db.models.user
    let Resource = db.models.resources
    let Action = db.models.action
    let System = db.models.system
    let Unit = db.models.unit
    let ConversionFactor = db.models.conversion_factor
    let AssetType = db.models.asset_type

    let setting = await System.create({
        setting: JSON.stringify({
            language: "cn",
            siteName: global.config.name,
            mqtt: {}
        })
    })

    let SuperAdmin = await User.create({
        realName: '系统管理员'
    })

    let adminAccount = await Account.create({
        uid: SuperAdmin.id,
        accountName: 'Administrator',
        appPwd: "MJNVGISAdmin2021",
        status: "activated",
        isInternal: true,
        isSuper: true
    })

    let actions = await Action.bulkCreate([{
        name: "Browse"
    }, {
        name: "Admin"
    }])

    let Modules = await Resource.bulkCreate([{
        id: '38ebe6e8-4c20-4286-95d4-e4a1319ff795',
        name: 'Access Security'
    }, {
        id: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Data'
    }, {
        id: 'e629ced8-1dd1-4852-aab6-787919773f01',
        name: 'Dashboard'
    }, {
        id: 'f41d18ab-dd5d-4694-b501-d6cb1b6d45fd',
        name: 'Map Tool'
    }])

    let SubModules = await Resource.bulkCreate([{
        id: '0f225461-26e4-4707-b891-db0142e388f4',
        parentId: '38ebe6e8-4c20-4286-95d4-e4a1319ff795',
        name: 'Account'
    }, {
        id: '7707a246-4b3b-4ab2-ada8-0d284d21a11f',
        parentId: '38ebe6e8-4c20-4286-95d4-e4a1319ff795',
        name: 'Privilege'
    }, {
        id: '7fcca79a-a3a8-4a94-b5a4-eb265887818e',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'General Statistics'
    }, {
        id: '9e06b583-68a2-4385-95cb-38222282173d',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Process Diagram'
    }, {
        id: 'facc241a-3157-4de2-bc56-48f89aa98351',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Roaming Path'
    }, {
        id: '6e99f2ab-c78e-423a-9213-15077f0f5d81',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Daily Report'
    }, {
        id: '852ce43f-18ee-42da-b8f4-717d17aa4410',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Monthly Report'
    }, {
        id: '6e3d9e9b-5bb6-4b16-a914-c1e4cffb5006',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Security Incident'
    }, {
        id: 'c7b3abf0-5e54-45d7-950d-0a78ae10c84b',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Model'
    }, {
        id: 'a5759ae1-70c0-4520-802a-372cbeb2d2d7',
        parentId: '979f01fb-54d1-44aa-8d66-0fbf040eb95e',
        name: 'Model Instance'
    }, {
        id: 'c292f719-c105-4e3a-8fa7-350e39a426f9',
        parentId: 'e629ced8-1dd1-4852-aab6-787919773f01',
        name: 'Overview'
    }, {
        id: 'f1740057-a338-4b72-aac3-35159041381d',
        parentId: 'e629ced8-1dd1-4852-aab6-787919773f01',
        name: 'Production'
    }, {
        id: '26cbca9f-89db-425e-b79f-bc2257aaea2b',
        parentId: 'e629ced8-1dd1-4852-aab6-787919773f01',
        name: 'HSSE'
    }, {
        id: '154fe12f-0a76-4bbd-87b7-5aba67015f4a',
        parentId: 'e629ced8-1dd1-4852-aab6-787919773f01',
        name: 'PID'
    }])

    let units = await Unit.bulkCreate([{
        name: "kgCO₂/kWh"
    }, {
        name: "kgCO₂/t"
    }, {
        name: "kgCO₂/m³"
    }, {
        name: "kgCO₂/GJ"
    }])

    let unitMap = units.reduce((result, item) => {
        result[item.name] = item.id
        return result
    }, {})

    let factors = await ConversionFactor.bulkCreate([{
        name: "水",
        unitId: unitMap["kgCO₂/t"]
    }, {
        name: "电",
        unitId: unitMap["kgCO₂/kWh"]
    }, {
        name: "天然气",
        unitId: unitMap["kgCO₂/m³"]
    }, {
        name: "蒸汽",
        unitId: unitMap["kgCO₂/GJ"]
    }])

    let assetTypes = await AssetType.bulkCreate([{
        name: "开发绿证绿电",
        type: "买入"
    }, {
        name: "买入绿证绿电",
        type: "买入"
    }, {
        name: "开发CCER",
        type: "买入"
    }, {
        name: "买入CCER",
        type: "买入"
    }, {
        name: "发放配额",
        type: "买入"
    }, {
        name: "卖出绿证绿电",
        type: "卖出"
    }, {
        name: "卖出CCER",
        type: "卖出"
    }, {
        name: "卖出配额",
        type: "卖出"
    }])

    console.log("initialization finished");
};
