# VGIS

### 开发环境
IDE: Webstorm
语言环境：NodeJS(JavaScript)
数据库：TimescaleDB(Postgresql)
前端框架：Vue 2.x
后端框架：Koa
ORM: Sequelize 5.x

### 地图服务器地址

测试服务器：http://192.168.3.250:8090
生产服务器：http://192.168.170.63.:8090（要开VPN）
2D地图服务路径: 'iserver/services/map-vgis/rest/maps',
数据服务路径: 'iserver/services/data-vgis/rest/data',
绘图服务路径: 'iserver/services/plot-jingyong/rest/plot',
3D地图路径: 'iserver/services/3D-vgis/rest/realspace'

项目里面的地图会用到谷歌地图服务，需要翻墙才能正常运行

地图服务器（测试）登录账号
访问地址：http://192.168.3.250:18080
用户名：Administrator
密码：MJNVGISAdmin2021

### HTTP接口的API文档

测试服务器：http://192.168.3.250:13002

生产服务器：http://192.168.170.63:3001（要开VPN）

参见docs/api目录下面的markdown文档

### VPN下载地址

https://www.oceanbluecloud.com/Download

下载Windows版的，账号管研发负责人要
不用常开，需要连远程服务器的时候再开