export default {
  name: "EcoCtrl易控",
  backend: {
    host: 'http://localhost:3005/',
    socket: 'ws://localhost:3005/',
    // socket: 'ws://101.200.39.197:3005/',
    // host: 'http://101.200.39.197:3005/',
  },
  pc: {
    host: 'http://127.0.0.1:8081',
  },
  edw: {
    host: "http://192.168.170.68"
  },
  sso: {
    enabled: false,
    host: 'http://192.168.170.26',
    appID: '60a4fbdcffab4746',
    appSecret: '7d8ce50475844ab591738916503f72ee',
    sign: '93b599864ef9d02dd79c1a6cd0255cd8',
    callback: 'http://127.0.0.1:8080/'
  },
  general: {
    date: new Date(2022, 11, 27)
  }
}
