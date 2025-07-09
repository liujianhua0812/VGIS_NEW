var dbconfig = require('./config').database.mysql;

var db = require('./database')(
    dbconfig.dbname,
    dbconfig.username,
    dbconfig.password,
    dbconfig.config).sync({
    force: false
}).then(function (db) {
    console.log('Sync successfully!');
    return require('./database/deploy/migrate')(db);
}).catch(function (err) {
    console.log(err);
});
