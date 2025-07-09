### 更新设备的静态属性值（MQTT协议）

#### 默认Channel： instance/:instanceId/data/attributes
您可以设置自定义的Channel，但要保证唯一性，否则会出现数据串线的问题。

#### 请求参数

请求参数为字典格式，键名为字段名，键值为字段值。

#### 请求示例

```json
{
  "Height": 36.5,
  "Width": 40
}
```
