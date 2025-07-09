#### 3.获取HSSE每日面板数据

POST /api/hsse/noticeboard

#### Request数据说明 Params

| 字段名 | 类型 | 必填 | 字段说明     | 注意事项 |
|--------|------|------|--------------|----------|
| date     | 日期  | 是   | 日期，如"2022-08-03" | 无，截至到date日期为止，noticeboard的最新数据     |

#### Response数据说明

| 字段名     | 类型    | 字段说明         | 注意事项               |
|------------|---------|------------------|------------------------|
| api_status | Boolean | 接口返回是否正常 | true为正常/false为异常 |
| code       | int     | 接口返回是否正常 | 1：正常 -1：不正常     |
| message    | String  | 返回提示信息     | 无                     |

Response实例:

错误：

```json
{
"api_status": false,
"code": -1,
"message": "error message"
```

正确:

```Json
{
  "api_status": false,
  "code": -1,
  "message": "error message",
  "date": {
    "dateLTI": "2022-01-04",
    "dateLI": "2022-01-05",
    "dateLMC": "2022-01-06",
    "oilProduced": 123456789,
    "leftCommentsEn": "",
    "leftCommentsAr": "",
    "rightCommentsEn": "",
    "rightCommentsAr": ""
  }
}
```