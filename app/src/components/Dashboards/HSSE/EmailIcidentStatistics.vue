<template>
    <div class="full-h vgis-dashboard-table" style="display: flex">
        <div class="singleAxis">
            <v-chart
                    style="height: 100%;width: 100%;z-index:1"
                    :option="chartsOption"
                    autoresize
            ></v-chart>
            <div class="bottomback">
                <div v-for="(item,key) in productionData" class="backitem"></div>
            </div>
        </div>
        <el-table
                @row-click="rowClick"
                ref="singleTable"
                height="100%"
                :row-class-name="tableRowClassName"
                :data="tableData"
                style="flex:1;width: 100%">
            <el-table-column
                    property="Title"
                    label="Title">
                <template v-slot="scope">
                    <div :title="scope.row.Title" v-html="scope.row.Title" class="title-tips"></div>
                </template>
            </el-table-column>
            <el-table-column
                    width="167px"
                    property="Type"
                    label="Type">
                <template v-slot="scope">
                    <div :title="scope.row.Type" v-html="scope.row.Type" class="title-tips"></div>
                </template>
            </el-table-column>
            <el-table-column
                    width="167px"
                    property="Time"
                    label="Time">
                <template v-slot="scope">
                    <div :title="new Date(scope.row.Time).format('MM/dd/yyyy hh:mm')"
                         v-html="new Date(scope.row.Time).format('MM/dd/yyyy hh:mm')" class="title-tips"></div>
                </template>
            </el-table-column>
        </el-table>
        <EmailDialog @action-finished="actionFinished" v-if="dialogVisibility" :dialog-visibility="dialogVisibility"
                     :info="model" dialog-id="EmailIcidentStatistics"/>
    </div>

</template>

<script>
import {
    getNodeDetail,
    getSeriesHistoryValues,
    getMultipleSeriesHistoryValues, getTableRecords
} from "@/assets/js/api/hierarchy";
import TableDialog from "./Dialog/TableDialog";
import EmailDialog from "./Dialog/EmailDialog";
import Password from "@/components/Admin/System/Password.vue";

export default {
    name: "EmailIcidentStatistics",
    components: {Password, EmailDialog, TableDialog},
    computed: {
        chartsOption() {
            let singleAxis = [], title = [], series = []
// prettier-ignore
            let a = []
            const days = [
                "Personnel Notice", "Activity",
                "Weather", "Other", "Public Transit",
            ];
            let length = days.length
            let colors = ["#4FACFF", "#F6E75A", "#F8A151", "#F65A5A", "#967FF3", "#3DE1EF"]
            days.forEach((day, idx) => {
                title.push({
                    textBaseline: 'middle',
                    textAlign: 'right',
                    left: 140,
                    right: 0,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 16,
                        fontWeight: 400
                    },
                    top: ((idx + 0.2) * 100) / 5 + '%',
                    text: day
                });
                singleAxis.push({
                    left: 170,
                    type: 'category',
                    boundaryGap: false,
                    data: this.xData,
                    top: ((idx * 100) / 5) + '%',
                    height: '12%',
                    axisTick: {
                        show: false,
                    },
                    zIndex: -1,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            width: 30,
                            color: colors[idx],
                            opacity: 0.8
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: idx < length - 1 ? false : true,
                        interval: 0,
                        color: '#ffffff'
                    }
                });
                let datase = this.productionData[day].map((item, index) => {
                    item = parseInt(item)
                    return [index, item]
                })
                series.push({
                    singleAxisIndex: idx,
                    coordinateSystem: 'singleAxis',
                    type: 'scatter',
                    data: datase,
                    symbolSize: function (dataItem) {
                        return dataItem[1] * 5 + 1;
                    }
                });
            });
            return {
                tooltip: {
                    trigger: "axis",
                    position: 'top',
                    borderColor: "#3DE1EF",
                    borderWidth: "0.5",
                    backgroundColor: "#141B25",
                    shadowBlur: "4",
                    renderMode: 'html',
                    appendToBody: true,
                    shadowColor: "rgba(61, 225, 239, 0.25)",
                    icon: "rect",
                    valueFormatter: function (prams) {
                        return prams[1]
                    },
                    textStyle: {
                        color: "#fff",
                        fontFamily: "Inter",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: 14
                    },
                },
                color: ["#4FACFF", "#F6E75A", "#F8A151", "#F65A5A", "#967FF3", "#3DE1EF"],
                title: title,
                singleAxis: singleAxis,
                series: series
            };
        },
    },
    props: {
        time: {
            type: Object,
            default: () => new Date()
        }
    },
    watch: {
        time: {
            handler(newVal) {
                this.getData(newVal)
            }
        }
    },
    data() {
        return {
            model: {},
            dialogVisibility: false,
            tableData: [],
            xData: [],
            productionData: {
                'Public Transit': [],
                'Personnel Notice': [],
                'Other': [],
                'Activity': [],
                'Weather': [],
            },
            width: document.documentElement.clientWidth,
            seriesData: {}
        };
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex % 2 === 0) {
                return ''
            } else {
                return 'whiteCell'
            }
        },
        actionFinished(e) {
            this.model = {}
            this.dialogVisibility = e
        },
        rowClick(row) {
            let time = new Date(row.Time)
            this.model = {
                Title: row.Title,
                Time: `${time.format('MF dd, yyyy, hh:mm')}${time.getHours() >= 12 ? 'PM' : 'AM'}`,
                'From Account': row['From Account'],
                'From Email': row['From Email'],
                Content: row.Content,
                'Attachments': row.AttachmentIds
            }
            this.dialogVisibility = true
        },

        getData(time) {
            let today = time
            let timeStart = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
            getTableRecords(
                ['HSSE Email'],
                [
                    {name: 'Received At', value: [timeStart, today]}
                ]
            ).then(res => {
                let records = [], tableData = []
                res.data.map(item => {
                    let thisRecord = [0, 0] // [time, type]
                    let thisTableRow = {}
                    for (let key in item.field_values) {
                        if (item.field_values[key].fieldName === "Subject") {
                            thisTableRow.Title = item.field_values[key].value
                        } else if (item.field_values[key].fieldName === "Received At") {
                            thisRecord[0] = (new Date(item.field_values[key].value).format('yyyy-MM'))
                            thisTableRow.Time = item.field_values[key].value
                        } else if (item.field_values[key].fieldName === "Category") {
                            thisRecord[1] = (item.field_values[key].value)
                            thisTableRow.Type = item.field_values[key].value
                        } else {
                            thisTableRow[item.field_values[key].fieldName] = item.field_values[key].value
                        }
                    }
                    tableData.push(thisTableRow)
                    records.push(thisRecord)
                })
                this.tableData = tableData
                records.forEach(item => {
                    if (!this.xData.includes(item[0])) {
                        this.xData.push(item[0])
                    }
                })
                this.xData.sort((a, b) => {
                    return a > b ? 1 : -1
                })
                for (let key in this.productionData) {
                    this.productionData[key] = new Array(this.xData.length).fill(0)
                }
                records.forEach(item => {
                    for (let xDataItem of this.xData) {
                        if (item[0] === xDataItem) {
                            this.productionData[item[1]][this.xData.indexOf(xDataItem)]++
                        }
                    }
                })
            })
        },
        watchWindowSize() {
            this.width = document.documentElement.clientWidth;
        }
    },
    created() {
        window.addEventListener("resize", this.watchWindowSize);
        this.getData(this.time);
    }
};
</script>

<style lang="scss" scoped>

* {
    font-family: HarmonyOS_Sans;
}

.singleAxis {
    flex: 1;
    position: relative;
}

.backitem {
    z-index: 0;
    width: 100%;
    flex: 0 0 15%;
    background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0.03) 100%);
    border-radius: 4px;
}

.bottomback {
    position: absolute;
    height: 92%;
    width: calc(100% - 140px);
    top: 0;
    left: 155px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.vgis-dashboard-table {
    .el-table::before {
        height: 0;
    }

    .el-table {
        overflow: scroll;
        margin-left: 35px;
        background: linear-gradient(180deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
        color: #FFFFFF;

        ::v-deep {
            tbody {
                tr {
                    background: transparent;
                    cursor: pointer;

                    td {
                        padding: 0;
                        overflow: hidden;
                        border-bottom: 0 solid rgba(255, 255, 255, 0.4);
                        background: transparent;
                    }

                }

                tr:hover > td {
                    background-color: rgba(54, 149, 255, 0.1) !important;
                    color: #ffffff;
                }

                tr.current-row > td {
                    color: #fff;
                    background: #409EFF !important;
                }
            }

            thead {
                color: rgba(255, 255, 255, 0.7);
                font-weight: 400;
                font-style: normal;

                tr {
                    background: transparent;
                    th {
                        background: rgba(29, 174, 255, 0.05);
                        color: #ffffff;
                        padding: 0;
                        overflow: hidden;
                    }

                    th.is-leaf {
                        font-weight: 400 !important;
                        border-bottom: 0 solid rgba(255, 255, 255, 0.4);
                        padding: 0 0 8px 0;
                    }
                }
            }

            .whiteCell {
                background: rgba(29, 174, 255, 0.05);
            }

            .cell {
                word-break: break-word !important;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                max-height: 48px;
            }

            .el-table__row {
                height: 48px;
            }
        }
    }
}
</style>
