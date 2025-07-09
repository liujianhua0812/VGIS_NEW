### Update Static Attribute Value via CoAP

#### POST /instance/:instanceId/data/attributes

#### Request Header

|       名称       |        取值        |
|:--------------:|:----------------:|
| content-format | application/json |

#### Request Parameters

Request body is a dict, using attribute name as key and attribute value as value, as the example shown below.

#### Request Example

```json
{
  "Height": 36.5,
  "Width": 40
}
```

#### Response

|  Parameters Name  |  type   |                               Description                               |
|:-----------------:|:-------:|:-----------------------------------------------------------------------:|
|       data        |  Dict   |                              update result                              |
|  data[name].code  | Integer | The code for update result of parameter name; 1-success, Others-Failure |
|  data[name].msg   | String  |          The short message for update result of parameter name          |

#### Response Example

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
