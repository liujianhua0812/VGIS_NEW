### Update Static Attribute Value

#### Default Channel: instance/:instanceId/data/attributes
You can also specify a custom channel, but beware that the channel you specify should be unique.

#### Request Parameters:

Request body is a dict, using attribute name as key and attribute value as value, as the example shown below.

#### Request Example

```json
{
  "Height": 36.5,
  "Width": 40
}
```
