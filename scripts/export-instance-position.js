const fs = require('fs').promises
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

  let instances = await Instance.findAll()

  let data = instances.map(item => ({
    instanceId: item.instanceId,
    position: item.threeDViewPointStr
  }))

  await fs.writeFile("position.json", JSON.stringify(data))

  console.log("Instance location exported.")
}

execute()

