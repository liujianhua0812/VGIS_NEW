### 上传时序数据（HTTP协议）

#### POST /instance/:instanceId/data/series

#### 请求头

|      名称      |        取值        |
|:------------:|:----------------:|
| content-type | application/json |

#### 请求参数

|  参数名  |  数据类型  | 是否必须 |    说明    |       备注        |
|:-----:|:------:|:----:|:--------:|:---------------:|
| data  | Array  |  是   | 要更新的时序数据 |                 |
| name  | String |  是   |  时序数据名   |                 |
| value |        |  是   |   数据值    |                 |
| time  | String |  否   | 数据点对应的时间 | 如果不设置则使用收到数据的时间 |

#### 请求示例

```json
{
  "data": [
    {
      "name": "Temperature",
      "value": 11.5
    },
    {
      "name": "Pressure",
      "value": 0.21,
      "time": "2022-04-21T03:45:45.298Z"
    }
  ]
}
```

#### 响应参数

|       参数名       |  数据类型   |              说明               |
|:---------------:|:-------:|:-----------------------------:|
|      data       |  Dict   |   更新结果，为键值对，每一项表示一个属性的更新结果    |
| data[name].code | Integer | name对应的属性的更新结果码; 1代表成功,其他代表失败 |
| data[name].msg  | String  |             结果信息              |

#### 响应示例

```json
{
  "data": {
    "Temperature": {
      "code": 1,
      "msg": "Create successfully"
    },
    "Pressure": {
      "code": 1,
      "msg": "Update successfully"
    }
  }
}
```
