const path = require('path');

module.exports = {
    name: "EcoCtrl易控",
    i18n: {
        locales: ["en", "cn"],
        directory: path.join(__dirname, "i18n"),
        objectNotation: true
    },
    server: {
        protocol: 'http',
        host: '127.0.0.1',
        port: 3005,
        public: 'http://127.0.0.1:3005',
    },
    coap: {
        port: 5683
    },
    sso: {
        host: 'http://192.168.170.26',
        appID: 'ccd551302f444608',
        appSecret: 'd96c3b779ca54e2ab9fbc77605aa9a9d',
        sign: '93b599864ef9d02dd79c1a6cd0255cd8',
        callback: 'http://127.0.0.1:8080/'
    },
    mail: {
        imap: '',
        smtp: '',
        username: '',
        password: ''
    },
    iam: {
        host: 'http://192.168.170.26',
        appId: 'e66495e7086044e5',
        appSecret: 'bf2a659475034ae28f9261068e8fc1e4'
    },
    ec: {
        host: 'http://192.168.3.181:8090'
    },
    oa: {
        host: 'http://192.168.170.94'
    },
    database: {
        mysql: {
            dbname: "vgis",
            username: "root",
            password: "swb",
            config: {
                host: "localhost",
                dialect: "mysql",
                port: 3306,
                timezone: "+08:00",
                pool: {
                    max: 20,
                    min: 0,
                    idle: 10000,
                    acquire: 30000
                },
                logging: null
                // logging: console.log
            }
        },
        postgres: {
            dbname: "vgis",
            username: "postgres",
            password: "admin123",
            config: {
                host: "localhost",
                dialect: "mysql",
                port: 3306,
                timezone: "+08:00",
                pool: {
                    max: 20,
                    min: 0,
                    idle: 10000,
                    acquire: 30000
                },
                logging: null
                // logging: console.log
            }
        }
    },
    redis: {
        host: "127.0.0.1",
        port: 6379
    },
    ews: {
        username: 'demo@majnoon-ifms.com',
        password: 'demo',
        host: 'https://demo.majnoon-ifms.com',
        auth: 'basic',
        dailyReport: {
            Id: '',
            ChangeKey: ''
        },
        allocationReport: {
            Id: '',
            ChangeKey: ''
        }
    },
};
