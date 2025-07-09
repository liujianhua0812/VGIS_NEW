#### 1. 获取井的实时参数  
GET /api/ec/well_status/list

#### Request数据说明   Params

| 字段名   | 类型   | 必填 | 字段说明 | 注意事项             |
| -------- | ------ | ---- | -------- | -------------------- |
| wellName | String | 是   | 井的名称 | 无                   |

#### Response数据说明

| 字段名     | 类型    | 字段说明                      | 注意事项                       |
| ---------- | ------- | ----------------------------- | ------------------------------ |
| api_status | Boolean | 接口返回是否正常              | true为正常/false为接口返回异常 |
| code       | int     | 接口返回是否正常              | 1：正常      -1：不正常        |
| message    | String  | 返回提示信息                  | 无                             |
| api_datas  | Object  | 存放返回的sample_analysis数据 | 对象数组                       |

Response实例：

错误：

```json
{
    "api_status": false,
    "code": -1,
    "message": "error message",
    "api_datas": {}
}
```



正确：

```json
{
    "api_status": true,
    "code": 1,
    "message": "",
    "api_datas": [
        {
            "wellName": "",
            "bsw": "",
            "oil": "",
            "water": "",
            "gas": "",
            "status": ""
        }
    ]
}
```




#### 2. 获取井的Well Sample Analysis  
GET /api/ec/sample_analysis/list

#### Request数据说明   Params

| 字段名   | 类型   | 必填 | 字段说明 | 注意事项             |
| -------- | ------ | ---- | -------- | -------------------- |
| wellName | String | 是   | 井的名称 | 无                   |
| date     | String | 否   | 日期     | 格式：yyyy-MM-dd 例：2021-12-06 |

#### Response数据说明

| 字段名     | 类型    | 字段说明                      | 注意事项                       |
| ---------- | ------- | ----------------------------- | ------------------------------ |
| api_status | Boolean | 接口返回是否正常              | true为正常/false为接口返回异常 |
| code       | int     | 接口返回是否正常              | 1：正常      -1：不正常        |
| message    | String  | 返回提示信息                  | 无                             |
| api_datas  | Object  | 存放返回的sample_analysis数据 | 对象数组                       |

Response实例：

错误：

```json
{
    "api_status": false,
    "code": -1,
    "message": "error message",
    "api_datas": {}
}
```



正确：

```json
{
    "api_status": true,
    "code": 1,
    "message": "",
    "api_datas": [
        {
            "wellName": "",
            "dayTime": "",
            "validFrom": "",
            "samplingMethod": "",
            "analysisStatus": "",
            "bsw": "",
            "sand": "",
            "co2": "",
            "oiDensity": "",
            "h2s": "",
            "salt": "",
            "api": ""
        }
    ]
}
```

#### 3. 获取井的Production Well Estimated Rates 
GET /api/ec/prod_well_esti_rate/list

#### Request数据说明   Params

| 字段名   | 类型   | 必填 | 字段说明 | 注意事项             |
| -------- | ------ | ---- | -------- | -------------------- |
| wellName | String | 是   | 井的名称 | 无                   |
| startDate     | String | 是   | 日期     | 格式：yyyy-MM-dd 例：2021-12-06 |
| endDate     | String | 是   | 日期     | 格式：yyyy-MM-dd 例：2022-12-06 |

#### Response数据说明

| 字段名     | 类型    | 字段说明                      | 注意事项                       |
| ---------- | ------- | ----------------------------- | ------------------------------ |
| api_status | Boolean | 接口返回是否正常              | true为正常/false为接口返回异常 |
| code       | int     | 接口返回是否正常              | 1：正常      -1：不正常        |
| message    | String  | 返回提示信息                  | 无                             |
| api_datas  | Object  | 存放返回的sample_analysis数据 | 对象数组                       |

Response实例：

错误：

```json
{
    "api_status": false,
    "code": -1,
    "message": "error message",
    "api_datas": {}
}
```



正确：

```json
{
    "api_status": true,
    "code": 1,
    "message": "",
    "api_datas": [
        {
            "wellName": "",
            "dayTime": "",
            "bsw": "",
            "netOil": "",
            "gor": "",
            "gas": "",
            "water": "",
            "whp": "",
            "chokeSize": "",
            "chokeUom": ""
        }
    ]
}
```

#### 4. 获取井的每日产量 
GET /api/ec/well_daily_prod/list

#### Request数据说明   Params

| 字段名   | 类型   | 必填 | 字段说明 | 注意事项             |
| -------- | ------ | ---- | -------- | -------------------- |
| wellName | String | 是   | 井的名称 | 单个井的名称                   |
| startDate     | String | 是   | 日期     | 格式：yyyy-MM-dd 例：2021-12-06 |
| endDate     | String | 是   | 日期     | 格式：yyyy-MM-dd 例：2022-2-06 |

##### benchmark取值
| 字段名   | 解释   |
| -------- | ------ |
| TYPE | 目前已知的取值只有：OP |
| STATUS | 目前已知的取值有：Open (Not New), Open New (opened during the month), Well bore plugged with cement |
| ONSTRM | On Strm [h] |
| CHOKE1SIZE | Choke > Choke 1 Size |
| UOM | Choke > UOM |
| FLP | FLP [barg] |
| THP | THP [barg] |
| THT | THT [C] |
| CHP | CHP [barg] |
| BSW | BS&W [%] |
| OILVOLT | Theoretical Calculated Figures > Oil Vol [Sm3] |
| GASVOLT | Theoretical Calculated Figures > Gas Vol [Sm3] |
| WATERVOLT | Theoretical Calculated Figures > Water Vol [Sm3] |
| CONVOILVOL | Converted Theoretical Figures > Conv. Oil Vol [bbl] |
| CONVGASVOL | Converted Theoretical Figures > Conv. Gas Vol [Scf] |
| CONVWATERVOL | Converted Theoretical Figures > Conv. Water Vol [bbl] |
| OILVOLA | Allocated Results > Oil Vol [Sm3] |
| OILFACTOR | Allocated Results > Oil Factor |
| GASVOLA | Allocated Results > Gas Vol [Sm3] |
| GASFACTOR | Allocated Results > Gas Factor |
| WATERVOLA | Allocated Results > Water Vol [m3] |
| WATERFACTOR | Allocated Results > Water Factor |
| CONVALLOCOILVOL | Converted Allocated Figures > Conv. Alloc Oil Vol [bbl] |
| CONVALLOCGASVOL | Converted Allocated Figures > Conv. Alloc Gas Vol [Scf] |
| CONVALLOCWATER | Converted Allocated Figures > Conv. Alloc Water [bbl] |
| COMMENTS |  |

#### Response数据说明

| 字段名     | 类型    | 字段说明                      | 注意事项                       |
| ---------- | ------- | ----------------------------- | ------------------------------ |
| api_status | Boolean | 接口返回是否正常              | true为正常/false为接口返回异常 |
| code       | int     | 接口返回是否正常              | 1：正常      -1：不正常        |
| message    | String  | 返回提示信息                  | 无                             |
| api_datas  | Object  | 存放返回的sample_analysis数据 | 对象数组                       |

Response实例：

错误：

```json
{
    "api_status": false,
    "code": -1,
    "message": "error message",
    "api_datas": {}
}
```



正确：

```json
{
  "code": 1,
  "api_status": true,
  "message": "",
  "api_datas": [
    {
      "wellName": "MJ-01",
      "dayTime": "2022-05-08",
      "value": {
        "TYPE": "OP",
        "STATUS": "Open (Not New)",
        "ONSTRM": "0.00",
        "CHOKE1SIZE": "0.00",
        "UOM": "64th of an inch",
        "FLP": "",
        "THP": "77.0",
        "THT": "0.0",
        "CHP": "",
        "BSW": "0.02",
        "OILVOLT": "0.0",
        "GASVOLT": "0.0",
        "WATERVOLT": "0.0",
        "CONVOILVOL": "0.0",
        "CONVGASVOL": "0.0",
        "CONVWATERVOL": "0.0",
        "OILVOLA": "",
        "OILFACTOR": "",
        "GASVOLA": "",
        "GASFACTOR": "",
        "WATERVOLA": "",
        "WATERFACTOR": "",
        "CONVALLOCOILVOL": "",
        "CONVALLOCGASVOL": "",
        "CONVALLOCWATER": "",
        "COMMENTS": ""
      }
    },
    {
      "wellName": "MJ-01",
      "dayTime": "2022-05-07",
      "value": {
        "TYPE": "OP",
        "STATUS": "Open (Not New)",
        "ONSTRM": "0.00",
        "CHOKE1SIZE": "0.00",
        "UOM": "64th of an inch",
        "FLP": "",
        "THP": "77.0",
        "THT": "0.0",
        "CHP": "",
        "BSW": "0.02",
        "OILVOLT": "0.0",
        "GASVOLT": "0.0",
        "WATERVOLT": "0.0",
        "CONVOILVOL": "0.0",
        "CONVGASVOL": "0.0",
        "CONVWATERVOL": "0.0",
        "OILVOLA": "0.0",
        "OILFACTOR": "",
        "GASVOLA": "0.0",
        "GASFACTOR": "",
        "WATERVOLA": "0.0",
        "WATERFACTOR": "",
        "CONVALLOCOILVOL": "0.0",
        "CONVALLOCGASVOL": "0.0",
        "CONVALLOCWATER": "0.0",
        "COMMENTS": ""
      }
    }
  ]
}
```
