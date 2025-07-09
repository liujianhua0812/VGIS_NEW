### Upload Series Value via MQTT

#### Default Channel: instance/:instanceId/data/series
You can also specify a custom channel, but beware that the channel you specify should be unique.

#### Request Parameters

| Parameters Name  |  Type  | Required |         Description         |                Remarks                |
|:----------------:|:------:|:--------:|:---------------------------:|:-------------------------------------:|
|       data       | Array  |   Yes    | upload data of series value |                                       |
|       name       | String |   Yes    |         Series Name         |                                       |
|      value       | String |   Yes    |        Series Value         |                                       |
|       time       | String |    No    |         Series Time         | If not specified, using received time |

#### Request Example

```json
{
  "data": [
    {
      "name": "Temperature",
      "value": "11.5"
    },
    {
      "name": "Pressure",
      "value": "0.21",
      "time": "2022-04-21T03:45:45.298Z"
    }
  ]
}
```