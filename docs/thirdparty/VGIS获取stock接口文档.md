#### Post      /api/stock_items/data

#### Request数据说明   Params

将下面接口默认参数json放入body访问接口，不传将返回报错。

```
{
    "material_number": "",
    "material_description": "",
    "material_group": "",
    "division": "",
    "manufacturer": "",
    "manufacturer_name": "",
    "manufacturer_part_number": "",
    "abc_indicator": "",
    "mrp_type": "",
    "storage_location": "",
    "storage_bin": "",
    "search_oper": "IN_AND",
    "exclude_oper": "EX_AND",
    "word1": "",
    "word2": "",
    "word3": "",
    "word4": "",
    "word5": "",
    "word6": "",
    "word7": "",
    "word8": ""
}
```

请求样例：

```
http://localhost/api/stock_items/data
```

#### Response数据说明

| 字段名       | 类型    | 字段说明            | 注意事项                            |
| ------------ | ------- | ------------------- | ----------------------------------- |
| api_status   | Boolean | 接口返回是否正常    | true为接口正常，false为接口返回异常 |
| api_errormsg | String  | 返回提示信息        | 无                                  |
| data         | list    | 存放返回的stock数据 | 详细数据含义参见末尾代码            |

#### Response实例：

错误：

```json
{
    "api_errormsg": "catch exception : com.engine.workflow.common.sap.stock.StockCmd执行过程中异常",
    "api_status": false
}
```



正确：

```json
{
    "data": [
        {
            "AENAM": "MM01",
            "DIBEZ": "No planning",
            "DISLS": "",
            "DISMM": "ND",
            "EISBE": "0.000",
            "ERNAM": "MM01",
            "ERSDA": "28.08.2019",
            "INSME": "0.000",
            "LABST": "0.000",
            "LAEDA": "28.08.2019",
            "LGOBE": "Ast. Unrestrictd",
            "LGORT": "1001",
            "LGPBE": "",
            "LOSLT": "",
            "MAABC": "",
            "MABST": "0.000",
            "MAKTX": "2WCV INSERT TOOL W/KEY,040800-01,CAMERON",
            "MATKL": "03XXXX",
            "MATNR": "1000000298",
            "MAT_LTX": "",
            "MENGE_AVAI": "",
            "MENGE_OPEN": "",
            "MENGE_ORDER": "",
            "MENGE_PR": "",
            "MFRNR": "803248",
            "MFRPN": "040800-01",
            "MINBE": "0.000",
            "NAME_ORG": "CAMERON DRILLING & PRODUCTION",
            "PLANT_NAME": "Majnoon Oil Field",
            "PLIFZ": "227",
            "POSID": "",
            "SPART": "Z1",
            "SPEME": "0.000",
            "UNIT": "EA",
            "VTEXT": "Wells",
            "WERKS": "MJ01",
            "WGBEZ": "PARTS,DRLG TOOL",
            "key": 1
        }],
    "api_errormsg": "",
    "api_status": true
}
```

数据含义：

```
const table = [
            {
                title: "NO.",
                dataIndex: "key",
            },
            {
                title:
                    <Tooltip title="Description of material group">
                        <span>Material Number</span>
                    </Tooltip>,
                dataIndex: "MATNR",
                width: 100
            },
            {
                title:
                    <Tooltip title="Description of material">
                        <span>Material Description</span>
                    </Tooltip>,
                dataIndex: "MAKTX",
                width: 100
            },
            {
                title:
                    <Tooltip title="Material specification">
                        <span>Material Long Text</span>
                    </Tooltip>,
                dataIndex: "MAT_LTX",
                width: 250
            },
            {
                title:
                    <Tooltip title="Base Unit of Measure">
                        <span>Base Unit of Measure</span>
                    </Tooltip>,
                dataIndex: "UNIT",
                width: 100
            },
            {
                title:
                    <Tooltip title="Number of the material group. A material group comprises several materials or services having the same attributes.">
                        <span>Material Group</span>
                    </Tooltip>,
                dataIndex: "MATKL",
                width: 100
            },
            {
                title:
                    <Tooltip title="Description of material group">
                        <span>Material Group Desc.</span>
                    </Tooltip>,
                dataIndex: "WGBEZ",
                width: 100
            },
            {
                title:
                    <Tooltip title="A way of grouping materials, products, or services. ">
                        <span>Division</span>
                    </Tooltip>,
                dataIndex: "SPART",
                width: 100
            },
            {
                title:
                    <Tooltip title="Devision Name">
                        <span>Division Name</span>
                    </Tooltip>,
                dataIndex: "VTEXT",
                width: 100
            },
            {
                title:
                    <Tooltip title="Manufacturer of the MPN material or the manufacturer's plant for which a manufacturer master record has been created.">
                        <span>Manufacturer</span>
                    </Tooltip>,
                dataIndex: "MFRNR",
                width: 100
            },
            {
                title:
                    <Tooltip title="Manufacturer Name">
                        <span>Manufacturer Name</span>
                    </Tooltip>,
                dataIndex: "NAME_ORG",
                width: 100
            },
            {
                title:
                    <Tooltip title="Number used by the manufacturer, or also by the supplier, to manage a material.">
                        <span>Manufacturer part number</span>
                    </Tooltip>,
                dataIndex: "MFRPN",
                width: 100
            },
            {
                title:
                    <Tooltip title="Indicate material ABC classifiction">
                        <span>ABC Indicator</span>
                    </Tooltip>,
                dataIndex: "MAABC",
                width: 100
            },
            {
                title:
                    <Tooltip title="Key that determines whether and how the material is planned.">
                        <span>MRP Type</span>
                    </Tooltip>,
                dataIndex: "DISMM",
                width: 100
            },
            {
                title:
                    <Tooltip title="MPR Type Desc.">
                        <span>MPR Type Desc.</span>
                    </Tooltip>,
                dataIndex: "DIBEZ",
                width: 100
            },
            {
                title:
                    <Tooltip title="If the stock falls below this quantity, the system flags the material for requirements planning by creating a planning file entry.">
                        <span>Reorder Point</span>
                    </Tooltip>,
                dataIndex: "MINBE",
                width: 100
            },
            {
                title:
                    <Tooltip title="System uses within materials planning to calculate the quantity to be procured or produced.">
                        <span>Lot Size</span>
                    </Tooltip>,
                dataIndex: "DISLS",
                width: 100
            },
            {
                title:
                    <Tooltip title="Lot Size Desc.">
                        <span>Lot Size Desc</span>
                    </Tooltip>,
                dataIndex: "LOSLT",
                width: 100
            },
            {
                title:
                    <Tooltip title="Specifies the quantity whose purpose is to satisfy unexpectedly high demand in the coverage period.">
                        <span>Safety Stock</span>
                    </Tooltip>,
                dataIndex: "EISBE",
                width: 100
            },
            {
                title:
                    <Tooltip title="Quantity of the material in this plant that may not be exceeded.">
                        <span>Maximum Stock Level</span>
                    </Tooltip>,
                dataIndex: "MABST",
                width: 100
            },
            {
                title:
                    <Tooltip title="Number of calendar days needed to obtain the material or service if it is procured externally.">
                        <span>Lead Time</span>
                    </Tooltip>,
                dataIndex: "PLIFZ",
                width: 100
            },
            // {
            //   title:
            //   <Tooltip title="Plant in which you produce or for which you wish to procure materials or services.">
            //     <span>Plant</span>
            //   </Tooltip> ,
            //   dataIndex: "WERKS",
            //   width: 100
            // },
            // {
            //   title:
            //   <Tooltip title="Name of plants">
            //     <span>Plant Name</span>
            //   </Tooltip> ,
            //   dataIndex: "PLANT_NAME",
            //   width: 100
            // },
            {
                title:
                    <Tooltip title="Number of the storage location at which materials are stored. There can be one or more storage locations within a plant.">
                        <span>Storage Location</span>
                    </Tooltip>,
                dataIndex: "LGORT",
                width: 100
            },
            {
                title:
                    <Tooltip title="Storage Location Description">
                        <span>Storage Location Description</span>
                    </Tooltip>,
                dataIndex: "LGOBE",
                width: 100
            },
            {
                title:
                    <Tooltip title="It identifies the exact location in the warehouse where goods can be stored.">
                        <span>Storage Bin</span>
                    </Tooltip>,
                dataIndex: "LGPBE",
                width: 100
            },
            {
                title:
                    <Tooltip title="Stock quantity in Unrestricted-Use">
                        <span>Unrestricted-Use Quantity</span>
                    </Tooltip>,
                dataIndex: "LABST",
                width: 100
            },
            {
                title:
                    <Tooltip title="Stock quantity in Quality Inspection">
                        <span>Quality Inspection Quantity</span>
                    </Tooltip>,
                dataIndex: "INSME",
                width: 100
            },
            {
                title:
                    <Tooltip title="Stock quantity in Blocked">
                        <span>Blocked Quantity</span>
                    </Tooltip>,
                dataIndex: "SPEME",
                width: 100
            },
            {
                title:
                    <Tooltip title="WBS Element Number">
                        <span>WBS Element</span>
                    </Tooltip>,
                dataIndex: "POSID",
                width: 100
            },
            {
                title:
                    <Tooltip title="PR quantity has not been converted to PO ">
                        <span>Open PR Quantity</span>
                    </Tooltip>,
                dataIndex: "MENGE_PR",
                width: 100
            },
            {
                title:
                    <Tooltip title="PO quantity has not been deliveried ">
                        <span>Open PO Quantity</span>
                    </Tooltip>,
                dataIndex: "MENGE_ORDER",
                width: 100
            },
            {
                title:
                    <Tooltip title="The quantity booked by work order or other cost objects">
                        <span>Open Reservation Quantity</span>
                    </Tooltip>,
                dataIndex: "MENGE_OPEN",
                width: 100
            },
            {
                title:
                    <Tooltip title="Available QTY = Unrestricted stock QTY + Open PR QTY + Open PO QTY – Open Work Order QTY">
                        <span>Available Quantity</span>
                    </Tooltip>,
                dataIndex: "MENGE_AVAI",
                width: 100
            },
            {
                title:
                    <Tooltip title="Created By">
                        <span>Created By</span>
                    </Tooltip>,
                dataIndex: "ERNAM",
                width: 100
            },
            {
                title:
                    <Tooltip title="Created On">
                        <span>Created On</span>
                    </Tooltip>,
                dataIndex: "ERSDA",
                width: 100
            },
            {
                title:
                    <Tooltip title="Changed By">
                        <span>Changed By</span>
                    </Tooltip>,
                dataIndex: "AENAM",
                width: 100
            },
            {
                title:
                    <Tooltip title="Changed On">
                        <span>Changed On</span>
                    </Tooltip>,
                dataIndex: "LAEDA",
                width: 100
            }
        ]
```

