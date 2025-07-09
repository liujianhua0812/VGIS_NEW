#### GET      /api/cm/equipment/list

#### Request数据说明   Params

| 字段名 | 类型   | 必填 | 字段说明 | 注意事项 |
| ------ | ------ | ---- | -------- | -------- |
| STRNO  | String | 否   | 设备号   | 无       |

请求样例：

```
http://localhost/api/cm/equipment/list?STRNO=B.MJ.CP1.CP001-27-V-001
```

#### Response数据说明

| 字段名     | 类型    | 字段说明                | 注意事项                                               |
| ---------- | ------- | ----------------------- | ------------------------------------------------------ |
| api_status | Boolean | 接口返回是否正常        | true为正常/false为接口返回异常                         |
| code       | int     | 接口返回是否正常        | 1：正常      -1：不正常                                |
| message    | String  | 返回提示信息            | 无                                                     |
| api_datas  | Object  | 存放返回的workOrder数据 | 包含四个List：componet，longtext，operation，workorder |

#### Response实例：

错误：

```json
{
    "api_status": false,
    "code": -1,
    "message": "Failed",
    "api_datas": {}
}
```



正确：

```json
{
    "api_status": true,
    "code": 1,
    "message": "Get equipment list success.",
    "api_datas": {
        "list": [
            {
                "abcIndicatorForTechnicalObject": "A",
                "countryOfManufacture": "IT",
                "dateOnWhichTheRecordWasCreated": "20190901",
                "descriptionOfTechnicalObject": "Vessel - Separator",
                "equipmentCategory": "A",
                "equipmentNumber": "31001096789",
                "extFunctionalLocation": {
                    "abcIndicatorForTechnicalObject": "A",
                    "catalogProfile": "CP_STA506",
                    "countryOfManufacture": "IT",
                    "dateOnWhichTheObjectWasCreated": "20190829",
                    "dateOnWhichTheObjectWasLastChanged": "00000000",
                    "descriptionOfFunctionalLocationInCapitalLetters": "1st Stage Sweet Production Separator",
                    "functionalLocation": "?0100000000000010242",
                    "functionalLocationLabel": "B.MJ.CP1.CP001-27-V-001",
                    "functionalLocationStructureIndicator": "BOC02",
                    "key": "?0100000000000010242",
                    "locationAndAccountAssignmentForTechnicalObject": "4683",
                    "locationOfMaintenanceObject": "CP1CP001",
                    "maintenancePlanningPlant": "MJ01",
                    "manufacturerOfAsset": "BELLELI",
                    "objectIdOfTheWorkCenter": "10000004",
                    "objectNumber": "IF?0100000000000010242",
                    "plannerGroupForCustomerServiceAndPlantMaintenance": "MNT",
                    "plantSection": "MSE",
                    "psIdentifier": "",
                    "psRequired": "Y",
                    "reasonSceAwarded": "SCE FROM BOW-TIE",
                    "room": "",
                    "safetyBarrier": "",
                    "sceGroup": "PC001",
                    "sceGroupName": "PC001 Pressure Vessels",
                    "shortDescription": "MNTCE. Mechanical",
                    "sortField": "CP001-27-V-001",
                    "superiorFunctionalLocation": "?0100000000000005891",
                    "systemStatus": "CRTE",
                    "textForObjectType": "Vessel - Separator",
                    "typeOfTechnicalObject": "VESE",
                    "userStatus": "APPR",
                    "value": "[ B.MJ.CP1.CP001-27-V-001 | BOC02 | MNT | MAJMMECH | PC001 | 1st Stage Sweet Production Separator | MNTCE. Mechanical ]",
                    "workCenter": "MAJMMECH"
                },
                "functionalLocation": "?0100000000000010242",
                "functionalLocationLabel": "B.MJ.CP1.CP001-27-V-001",
                "key": "31001096789",
                "locationAndAccountAssignmentForTechnicalObject": "21308",
                "locationOfMaintenanceObject": "CP1CP001",
                "maintenancePlanningPlant": "MJ01",
                "manufacturerOfAsset": "BELLELI",
                "objectIdOfTheWorkCenter": "10000004",
                "plannerGroupForCustomerServiceAndPlantMaintenance": "MNT",
                "plantSection": "MSE",
                "room": "",
                "shortDescription": "MNTCE. Mechanical",
                "sortField": "CP001-27-V-001",
                "systemStatus": "INST",
                "technicalObjectAuthorizationGroup": "MJ10",
                "textForObjectType": "Vessel - Separator",
                "typeOfTechnicalObject": "VESE",
                "userStatus": "APPR",
                "validToDate": "99991231",
                "value": "[ 31001096789 | MNT | MAJMMECH | B.MJ.CP1.CP001-27-V-001 | Vessel - Separator | MNTCE. Mechanical ]",
                "workCenter": "MAJMMECH"
            }
        ]
    }
}
```

