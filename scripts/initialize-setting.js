
const Op = require('sequelize').Op
let dbconfig = require('../config').database.postgres;

async function execute () {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )

    let System = db.models.system
    await System.destroy({
        where: {
            id: {
                [Op.ne]: null
            }
        }
    })
    let setting = System.create({
        setting: JSON.stringify({
            language: "cn"
        })
    })
    console.log(`System setting initialized`)
}

execute().catch(err => console.log(err))