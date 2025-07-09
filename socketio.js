const {Server} = require("socket.io");
const {Client} = require('pg');

const pgClientListenSeries = (io) => {
    try {
        //start of pg listen notify
        const pgClient = new Client(`postgres://${config.database.postgres.username}:${config.database.postgres.password}@${config.database.postgres.config.host}/${config.database.postgres.dbname}`)
        pgClient.connect()
        pgClient.query('LISTEN new_series_valuesevent')
        pgClient.on('notification', async (data) => {
            const payload = JSON.parse(data.payload)
            const instanceId = payload.instanceId
            const seriesId = payload.seriesId
            //const timestamp = payload.time
            //const seriesValue = payload.value

            const ctx = {
                params: {
                    instanceId: instanceId
                },
                request: {
                    body: {
                        seriesNames: [
                            seriesId
                        ]
                    }
                }
            }

            const SeriesController = require('./controllers').hierarchy.series
            await SeriesController.show(ctx)
            const response = ctx.body

            // return all Socket instances of the main namespace
            const sockets = await io.fetchSockets();
            //通知所有socket有新的series values更新
            for (const socket of sockets) {
                //console.log(`response to socket-${socket.id}`, response)
                socket.emit(`new-series-${instanceId}`, response)
            }
        })
        //end of pg listen notify
    } catch (e) {
        console.log(err)
    }
}

const serverSocketIO = function (httpServer) {
    // 使用 Koa 启动SocketIO
    const io = new Server(httpServer, {
        allowEIO3: true, //是否启用与 Socket.IO v2 客户端的兼容性。
        transports: ['websocket', 'polling'],
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    pgClientListenSeries(io)

    io.on("connection", (socket) => {
        console.log('Connection established!', socket.id, new Date());

        // socket.on('message', (message) => { //监听start事件，web端会触发这个函数
        //     console.log('Received message from client:', message);
        //     socket.emit('message-ack', "Hello client, I've got your message!");  //触发web端的message事件
        // });

        socket.on('instance-latest-series', async (args) => {
            try {
                let ctx = {
                    params: {
                        instanceId: ""
                    },
                    request: {
                        body: {}
                    }
                }
                ctx.request.body = args.body
                ctx.params.instanceId = args.params.instanceId
                const SeriesController = require('./controllers').hierarchy.series
                await SeriesController.show(ctx)
                const response = ctx.body
                socket.emit(`instance-latest-series-${ctx.params.instanceId}`, response)
            } catch (err) {
                console.error(err)
            }
        })

        socket.on('instance-attributes', async (args) => {
            try {
                let ctx = {
                    params: {
                        instanceId: ""
                    },
                    request: {
                        body: {}
                    }
                }
                ctx.request.body = args.body
                ctx.params.instanceId = args.params.instanceId
                const AttributeController = require('./controllers').hierarchy.attributes
                await AttributeController.index(ctx)
                const response = ctx.body
                socket.emit(`instance-attributes-${ctx.params.instanceId}`, response)
            } catch (err) {
                console.error(err)
            }
        })
    });
}

module.exports = serverSocketIO;