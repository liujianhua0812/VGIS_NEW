export default {
  map: {
    base: {
      host: "https://t0.tianditu.gov.cn/img_w/wmts",
      key: "90c4716a7cc7aa23bc1e2136d69c2868"
    },
    source: {
      host: 'http://192.168.3.250:8090/',
      path: 'iserver/services/map-vgis/rest/maps',
      data: 'iserver/services/data-vgis/rest/data',
      plotPath: 'iserver/services/plot-jingyong/rest/plot',
      threeDPath: 'iserver/services/3D-vgis/rest/realspace'
    },
    mapName: 'Majnoon',
    center: {
      x: 5301031.1057765,
      y: 3641126.8708234,
      scale: 12
    },
  },
  cctv: {
    host: 'wx://127.0.0.1:8000',
  },
  backend: {
    // host: 'http://192.168.3.250:13002/',
    host: 'http://192.168.3.229:3001/',
  },
  sso: {
    host: 'http://192.168.170.24:8089',
    appID: 'FMD5YAe4Vu',
    appSecret: 'a6539b6f-eec3-4d4f-94f9-966408b4b0c7',
    sign: '93b599864ef9d02dd79c1a6cd0255cd8',
    callback: 'http://127.0.0.1:8080/'
  },
  general: {
    date: new Date(2022, 11, 27)
  }
}
