require('../libs/Date')()
const Op = require('sequelize').Op
let config = require('../config')
let dbconfig = config.database.postgres;

async function execute () {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )
    let Model = db.models.model
    let Instance = db.models.model_instance
    let Attribute = db.models.static_attribute
    let AttributeValue = db.models.attribute_value
    let models = await Model.findAll({})

    let attributes = ["厂家", "质保状态", "联系人", "联系电话"]

    await Attribute.destroy({
        where: {
            name: {
                [Op.in]: attributes
            }
        }
    })

    let data = []
    for(let i = 0; i < models.length; i++) {
        data = data.concat(attributes.map((name, index) => ({
            name,
            modelId: models[i].id,
            rank: index + 1,
            dataType: "String",
            required: false,
            unique: false
        })))
    }

    await Attribute.bulkCreate(data)
}

execute().then(result => {
    console.log("Attribute Data Initialized.")
})
