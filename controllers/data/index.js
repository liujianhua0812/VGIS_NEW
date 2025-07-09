const {Client} = require('pg');

exports.query = async (ctx, next) => {
    const query = ctx.request.body.query
    if(sqlSecurityCheck(query)){
        const pgClient = new Client(`postgres://${config.database.postgres.username}:${config.database.postgres.password}@${config.database.postgres.config.host}/${config.database.postgres.dbname}`)
        try {
            await pgClient.connect()
            const result = await pgClient.query({
                text: query,
                values: ctx.request.body.params || [],
            });

            // ctx.body = {
            //     data: result.rows
            // }
            ctx.body = result.rows

            return next()
        } catch (err){
            console.log(err)
            ctx.body = {
                error: err
            }
            return next()
        }
        finally {
            await pgClient.end()
        }
    }else{
        ctx.body = {
            error: "sql statement contains invalid operations"
        }
        return next()
    }
}

const sqlSecurityCheck = (queryStr) => {
    let query = queryStr.toLowerCase()
    const blacklist = [
        "insert","update", "delete", "set", //DML
        "create", "alter", "drop", "truncate", "grant", "revoke", "table", "comment", //DDL
        "commit", "rollback", "transaction"//DCL
    ]
    for(const word of blacklist){
        if(wordInString(query, word))
            return false
    }

    return wordInString(query, "select");
}

const wordInString = (s, word) => new RegExp('\\b' + word + '\\b', 'i').test(s);
