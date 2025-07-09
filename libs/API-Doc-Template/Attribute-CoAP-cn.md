### 更新设备的静态属性值（CoAP协议）

#### POST /instance/:instanceId/data/attributes

#### 请求头

|       名称       |        取值        |
|:--------------:|:----------------:|
| content-format | application/json |

#### 请求参数

请求参数为字典格式，键名为字段名，键值为字段值。

#### 请求示例

```json
{
  "Height": 36.5,
  "Width": 40
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
    "Height": {
      "code": 1,
      "msg": "Update successfully"
    },
    "Weight": {
      "code": -1,
      "msg": "Invalid Attribute Name"
    },
    "Width": {
      "code": 1,
      "msg": "Update successfully"
    }
  }
}
```
