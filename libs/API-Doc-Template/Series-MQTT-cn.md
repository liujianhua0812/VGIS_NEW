### 上传时序数据（MQTT协议）

#### 默认Channel： instance/:instanceId/data/series
您可以设置自定义的Channel，但要保证唯一性，否则会出现数据串线的问题。

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