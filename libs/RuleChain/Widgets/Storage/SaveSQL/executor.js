let Sequelize = require('sequelize')
const RichText = require('../../../../Richtext')

module.exports = async function (context, config, inputs = [], outputs) {
    let input = inputs[0]
    let result = null, error = null

    let dbconfig = {
        dialect: config.dialect,
        dialectOptions: {}
    }

    if (dbconfig.dialect === "sqlite") {
        dbconfig.storage = config.dbname
    }
    for(let i = 0; i < config.config.length; i++) {
        let conf = config.config[i]
        if (conf.name) {
            dbconfig.dialectOptions[conf.name] = conf.value
        }
    }

    const sequelize = new Sequelize(config.dbname, config.username, config.password, dbconfig)

    let command = RichText.composeDefault(config.sql, context)

    try {
        result = await sequelize.query(command)
    }
    catch(err) {
        result = command
        error = "SQL_FAILED"
    }

    for(let i = 0; i < outputs.length; i++) {
        outputs[i].result = true
    }
    return {
        input,
        result,
        canceled: false,
        error: error
    }
}