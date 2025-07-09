### Upload Series Value via CoAP

#### POST /instance/:instanceId/data/series

#### Request Headers

|     Header     |      Value       |
|:--------------:|:----------------:|
| content-format | application/json |

#### Request Parameters

| Parameters Name |  Type  | Required |         Description         |                Remarks                |
|:---------------:|:------:|:--------:|:---------------------------:|:-------------------------------------:|
|      data       | Array  |   Yes    | upload data of series value |                                       |
|      name       | String |   Yes    |         Series Name         |                                       |
|      value      |        |   Yes    |        Series Value         |                                       |
|      time       | String |    No    |         Series Time         | If not specified, using received time |

#### Request Example

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

#### Response

| Parameters Name  |  Type   |                               Description                                |
|:----------------:|:-------:|:------------------------------------------------------------------------:|
|       data       |  Dict   |                              update result                               |
| data[name].code  | Integer | The code for update result of parameter name; 1-success, Others-Failure  |
|  data[name].msg  | String  |          The short message for update result of parameter name           |

#### Response Example

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
