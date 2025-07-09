let dbconfig = require('./config').database.postgres;

async function execute () {
    let config = dbconfig.config
    config.first = true
    let db = await require('./database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        config
    )
    db = await db.sync({ force: true })
    await require('./database/deploy/seed')(db)
    console.log('Sync successfully!');
}

execute().then(() => {})