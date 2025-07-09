const fs = require('fs').promises
const path = require('path')
let config = require('../config')
let dbconfig = config.database.postgres;

let db = require('../database')(
  dbconfig.dbname,
  dbconfig.username,
  dbconfig.password,
  dbconfig.config
)

async function execute () {
  let Instance = db.models.model_instance

  let data = JSON.parse((await fs.readFile(path.join(__dirname, "../", "data", "position.json"))).toString())

  for(let i = 0; i < data.length; i++) {
    let item = data[i]
    let instance = await Instance.findOne({ where: { instanceId: item.instanceId } })
    if (instance) {
      instance.threeDViewPointStr = data[i].position
      await instance.save()
    }
  }

  console.log("Instance location imported.")
}

execute()
