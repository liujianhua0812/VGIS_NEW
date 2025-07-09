require('../libs/Date')()
const axios = require('axios')
const Op = require('sequelize').Op
const path = require('path')
let fs = require('fs').promises
let config = require('../config')
let dbconfig = config.database.postgres;
let client = axios.create({
    baseURL: config.ec.host,
})

const LABEL_NAMES = ['Equipment Number', 'Functional Tag']
const DATA_PATH = path.join(__dirname, '../', 'data', 'result.json')

function capitalize (string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
}

function extractAttr (record) {
    let EQUIP_ATTRIBUTE_NAMES = Object.entries(record.attributes.EQUIPMENT).map(item => ({
        name: item[0].split(' ').map(word => capitalize(word)).join(' '),
        value: item[1],
        label: ['Equipment Number']
    }))
    let TAG_ATTRIBUTE_NAMES = Object.entries(record.attributes.TAG).map(item => ({
        name: item[0].split(' ').map(word => capitalize(word)).join(' '),
        value: item[1],
        label: ['Functional Tag']
    }))
    let result = EQUIP_ATTRIBUTE_NAMES.reduce((result, item) => {
        result[item.name] = item
        return result
    }, {})
    result = TAG_ATTRIBUTE_NAMES.reduce((result, item) => {
        if (!result[item.name]) {
            result[item.name] = item
        }
        else {
            result[item.name].label = result[item.name].label.concat(item.label)
        }
        return result
    }, result)
    return result
}

async function execute () {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )
    let data = JSON.parse((await fs.readFile(DATA_PATH)).toString('utf-8'))
    let Label = db.models.label
    let Instance = db.models.model_instance
    let Model = db.models.model
    let Attribute = db.models.static_attribute
    let AttributeValue = db.models.attribute_value
    let Has = db.models.has
    let labels = {}
    for(let i = 0; i < LABEL_NAMES.length; i++) {
        let label = await Label.findOne({
            where: {
                name: LABEL_NAMES[i]
            }
        })
        if (!label) {
            label = await Label.create({
                name: LABEL_NAMES[i]
            })
        }
        labels[label.name] = label
    }
    let instances = await Instance.findAll({
        where: {
            instanceId: {
                [Op.in]: data.map(item => item.tag)
            }
        },
        include: [Model]
    })
    let instanceMap = instances.reduce((result, item) => {
        result[item.instanceId] = item
        return result
    }, {})
    for(let i = 0; i < data.length; i++) {
        let record = data[i]
        let attrData = extractAttr(record)
        // 针对每个Model，先检查Attribute有没有，如果没有则创建
        let attributes = await Attribute.findAll({
            where: {
                modelId: instanceMap[record.tag].modelId,
                name: Object.keys(attrData)
            }
        })
        let nonExistent = Object.assign({}, attrData)
        for(let i = 0; i < attributes.length; i++) {
            delete nonExistent[attributes[i].name]
        }
        nonExistent = Object.keys(nonExistent)
        await Attribute.bulkCreate(nonExistent.map(name => ({
            name,
            required: false,
            unique: false,
            dataType: 'String',
            modelId: instanceMap[record.tag].modelId,
            rank: 0
        })))
        attributes = await Attribute.findAll({
            where: {
                modelId: instanceMap[record.tag].modelId,
                name: Object.keys(attrData)
            }
        })
        // 然后针对每个Attribute，检查有没有和Label关联上，如果没有则创建关联
        await Has.destroy({
            where: {
                attributeId: attributes.map(item => item.id)
            }
        })
        let attrMap = attributes.reduce((result, item) => {
            result[item.name] = item
            return result
        }, {})
        await Has.bulkCreate(Object.values(attrData).reduce((result, record) => {
            result = result.concat(record.label.map(label => ({
                attributeId: attrMap[record.name].id,
                labelId: labels[label].id
            })))
            return result
        }, []))
        // 然后检查Instance有没有取值，如果没有取值，则创建，如果有则覆盖
        await AttributeValue.destroy({
            where: {
                instanceId: instanceMap[record.tag].id,
                attributeId: attributes.map(item => item.id)
            }
        })
        await AttributeValue.bulkCreate(Object.values(attrData).map(attr => ({
            instanceId: instanceMap[record.tag].id,
            attributeId: attrMap[attr.name].id,
            value: attr.value
        })))
    }
    console.log("Update Equipment Attribute Finished.")
}

execute()
