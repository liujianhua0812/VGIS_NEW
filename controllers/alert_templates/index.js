const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.index = async (ctx, next) => {
    let AlertTemplate = global.db.models.alert_template
    let templates = await AlertTemplate.findAll({})
    ctx.body = {
        data: templates
    }
}