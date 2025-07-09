const NodeMediaServer = require('node-media-server');
const streamInfo = require('./config').stream

let nms = new NodeMediaServer(streamInfo.config)
nms.run();
