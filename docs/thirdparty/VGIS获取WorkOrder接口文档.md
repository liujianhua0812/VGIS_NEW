#### GET      /api/work_order/vgis_data

#### Request数据说明   Params

| 字段名    | 类型   | 必填 | 字段说明       | 注意事项           |
| --------- | ------ | ---- | -------------- | ------------------ |
| date      | String | 否   | 日期  yyyyMMdd | 格式样例：20211206 |
| equipment | String | 否   | 设备号         | 无                 |
| fl | String | 否   | Functional Location         | equipment和fl不能同时为空                 |

请求样例：

```
/api/work_order/vgis_data?date=20211206&equipment=31001275640
/api/work_order/vgis_data?fl=BOC.MJ.MED
/api/work_order/vgis_data?equipment=000000031001078112&fl=BOC.MJ.MED
```

#### Response数据说明

| 字段名     | 类型    | 字段说明                | 注意事项                                               |
| ---------- | ------- | ----------------------- | ------------------------------------------------------ |
| api_status | Boolean | 接口返回是否正常        | true为正常/false为接口返回异常                         |
| code       | int     | 接口返回是否正常        | 1：正常      -1：不正常                                |
| message    | String  | 返回提示信息            | 无                                                     |
| api_datas  | Object  | 存放返回的workOrder数据 | 包含四个List：componet，longtext，operation，workorder |

componet，longtext，operation，workorder   具体字段含义参见Design for Work Order   Detail页面

#### Response实例：

错误：

```json
{
    "api_status": false,
    "code": -1,
    "message": "Get WorkOrder Error. Error Message:Data was lost while copying a value.",
    "api_datas": {}
}
```



正确：

```json
{
    "api_status": true,
    "code": 1,
    "message": "Get WorkOrder success.",
    "api_datas": {
        "component": [
            {
                "aBLAD": "Old ware house:N-22-7",
                "aFNAM": "",
                "aUART": "PMFC",
                "aUFNR": "2000000561",
                "bANFN": "",
                "bDMNG": "1.000",
                "bEDNR": "",
                "bNFPO": "0",
                "description": "REPAIR KIT,XSK075RK-000,SEVRN-GL",
                "eNMNG": "1.000",
                "gPREIS": "390.00",
                "iDNLF": "",
                "kTEXT_WO": "RECYCLE FV-302 SEAT & PLUG PASSING",
                "kZEAR": "X",
                "mAKTX": "REPAIR KIT,XSK075RK-000,SEVRN-GL",
                "mATNR": "1001532102",
                "mEINS": "SET",
                "pOSNR": "40",
                "pOSTP": "L",
                "pOTX1": "",
                "rSNUM": "7093",
                "rSPOS": "4",
                "vORNR": "0040",
                "wAERS": "USD",
                "wEMPF": "",
                "xLOEK": "",
                "xWAOK": "X"
            }
        ],
        "longtext": [
            {
                "aUART": "PMFC",
                "aUFNR": "002000002656",
                "kTEXT_WO": "Ex integrity Defects for DS2 Instruments",
                "lONGTEXT": "Ex integrity Defects for DS2 Instruments\nCM NOTIFICATION LONG TEXT TEMPLATE:\n Ex integrity remedial works to be done according to attached file.\n Scaffolding to be erected for Remedial work no:38.\n\nCHECKS AS PER LIST JOBS CAN DO IN RUNNING CONDITION, MARKED WHICH IS\nNEED SHUTDOWN.   KSR\n\nREQUESTOR NAME: Senthilandavan.C\nCONTACT INFO (PHONE NUMBER OR EMAIL): Senthilandavan.C@majnoon-ifms.com\n\n\n\nA) DESCRIBE THE DEFECT FOUND:\nAS found some Ex integrity defects in Instrument certified equipment's\non during 3Y Ex detailed inspection (WO Ref:3000002940).\n\nB) WHAT ARE THE EQUIPMENT FUNCTION / RESPONSIBILITY AND IT'S OVER ALL,\nIMPACT?\nInstrument certified equipment's\n\nC) PROVIDE LOCATION OF DEFECT <(>&<)> EQUIPMENT AFFECTED:\n DS2 station\n\nD) DESCRIBE IMMEDIATE CORRECTIVE ACTIONS TAKEN AND MITIGATION REQUIRED:\n Notification Raised\n\nE) EXPLAIN CHOSEN CMPT RANKING IN DETAIL FOR FOLLOWING:\nCONSEQUENCE CATEGORY:\nCONSEQUENCE SERVERITY:\nLIKELIHOOD OF OCCURENCE:\n\n\nF) WHAT ARE THE SHUTDOWN / ISOLATION\n",
                "zTDLTX1": "20210217 135633 MJ204022\n will be Carry out during  next shutdown\n20210817 154405 MJ204003\nReason for requested extension (Proposal/Justification):\n\nAll WO system conidian G/E, a facility shutdown is required. In this\nscenario, all work orders LAFD must be extended for one year, and the\ntask will be completed during the next upcoming shutdown.\n",
                "zTDLTX2": "",
                "zTDLTX3": "",
                "zTDLTX4": ""
            }
        ],
        "operation": [
            {
                "aBLAD": "",
                "aFNAM": "",
                "aNLZU": "",
                "aNLZUX": "",
                "aRBEH": "H",
                "aRBEI": "0",
                "aRBPL": "MAJMINST",
                "aUART": "PMFC",
                "aUFKT": "1",
                "aUFNR": "2000002656",
                "bANFN": "",
                "bEDNR": "",
                "bNFPO": "0",
                "dAUNE": "H",
                "dAUNO": "0",
                "eBELN": "",
                "eBELP": "0",
                "eKGRP": "",
                "eKNAM": "",
                "eKORG": "",
                "eKOTX": "",
                "iSMNW": "0",
                "kTEXT_WC": "MNTCE. INSTRUMENTS",
                "kTEXT_WO": "Ex integrity Defects for DS2 Instruments",
                "lIFNR": "",
                "lTXA1": "Ex integrity Defects for DS2 Instruments",
                "mATKL": "",
                "mEINH": "",
                "mGVRG": "1.000",
                "pEINH": "0",
                "pHFLG": "",
                "pREIS": "0",
                "sAKTO": "",
                "sTEUS": "PMIN",
                "vORNR": "10",
                "wAERS": "USD",
                "wEMPF": ""
            }
        ],
        "workorder": [
            {
                "aBCKZ": "B",
                "aBNUM": "0",
                "aEDAT": "2021-12-05",
                "aENAM": "MJ204025",
                "aENAMT": "MJ-IFMS-MAINT-INST-TEC(WP) Manikandan.V",
                "aNLZU": "F",
                "aNLZUX": "Process Shutdown (Oil/Gas/Water)",
                "aRBPL": "MAJMINST",
                "aUART": "PMFC",
                "aUFNR": "2000002656",
                "bEBER": "",
                "eQFNR": "",
                "eQKTX": "",
                "eQUNR": "",
                "eRDAT": "2021-01-26",
                "eRNAM": "MJ204026",
                "eRNAMT": "MJ-IFMS-MAINT-INST-WP Syed salam/KSR Anjaneyulu",
                "fING": "",
                "gLTRP": "2021-12-07",
                "gSTRP": "2021-12-06",
                "iLART": "CRB",
                "iLATX": "Breakdown or Malfunction",
                "iNGPR": "MNT",
                "iNNAM": "Facility Maintenan",
                "iWERK": "MJ01",
                "kTEXT_FL": "Existing & New Facilities at DS2",
                "kTEXT_WC": "MNTCE. INSTRUMENTS",
                "kTEXT_WO": "Ex integrity Defects for DS2 Instruments",
                "lRMDT": "0000-00-00",
                "mPT": "A2A",
                "mSGRP": "120",
                "oBJNR": "OR002000002656",
                "pLNAL": "",
                "pLNNR": "",
                "pLTXT": "Certified (EX) Equipment",
                "pOSID": "O.MT.MAIN.PM0.00.0000",
                "pOST1": "\"PM/CM (Mechanical, Electrical, etc)\"",
                "pRIOK": "6",
                "pROID": "1924",
                "qMNUM": "001000002939",
                "sTORT": "DS2DS002",
                "sTRNO": "B.MJ.DS2.Z01",
                "sTTXT": "REL,PRC,SETC,NMAT",
                "sWERK": "MJ01",
                "tPLNR": "?0100000000000005769",
                "uSRTXT": "EXEC",
                "wAPOS": "",
                "wARPL": "",
                "zBDATE": "2021-02-17",
                "zCORR": "",
                "zDES": "",
                "zLAFDATE": "2022-07-17",
                "zLASDATE": "2021-02-17",
                "zODF": "2021-07-17",
                "zOLAF": "2021-07-17",
                "zOLAS": "2021-02-17",
                "zREASON": "",
                "zSEAR": "2021-02-18",
                "zSSAR": "2021-02-17",
                "zTDOBNAME1": "00200000265601",
                "zTDOBNAME2": "00200000265602",
                "zTIDAYS": "30",
                "zTOLRD": "0",
                "zWORK": "0",
                "zZYKZT": "0"
            }
        ]
    }
}
```

