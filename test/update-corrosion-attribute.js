const axios = require('axios')
const FormData = require("form-data");
const {Op} = require("sequelize");
const Sequelize = require('sequelize')
let config = require('../config')
let dbconfig = config.database.postgres;

//批量更新HER和UT的Corrosion Allowance、Design Factor参数
async function execute() {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )
    const ModelInstance = db.models.model_instance
    let instances = await ModelInstance.findAll({
        where: {
            modelId: {
                [Op.in]: ["4cb63d61-607a-4afd-99d8-6d51c1feba31", "54619d4d-464c-487e-a0bb-f4680b6f6726"]
            }
        }
    })

    instances.map(instance => {
        console.log(instance.instanceId, "Updating...")
        let instanceId = instance.instanceId
        let host = 'http://192.168.1.33:3005'
        let path = '/instance/' + instanceId + '/data/attributes'

        let form = new FormData()
        form.append("Corrosion Allowance", "6")
        form.append("Design Factor", "0.8")

        axios.post(host + path, form, {
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + form.getBoundary()
            }
        })
            .then((response) =>
                console.log(response.data));
    })
}

execute()



