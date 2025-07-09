<template>
    <div id="app">
      <vue-headful :title="`${title}`"/>
      <vgis-row :gutter="20" class="full-h">
        <vgis-col :span="12" class="full-h">
          <vgis-flex-column class="full-h">
            <vgis-cell :grow="34">
              <CpicChart></CpicChart>
            </vgis-cell>
            <vgis-cell :grow="32">
              <HandlingNotice></HandlingNotice>
            </vgis-cell>
            <vgis-cell :grow="32">
              <TrendAnalysis></TrendAnalysis>
            </vgis-cell>
          </vgis-flex-column>
        </vgis-col>
        <vgis-col :span="24" class="full-h">
          <vgis-flex-column class="full-h">
            <vgis-cell :grow="1" class="m-b-20">
              <majnoon map-name="Majnoon-HSSE" />
            </vgis-cell>
            <vgis-cell style="height: 250px;" class="m-b-20">
              <vgis-row :gutter="20" class="full-h">
                <vgis-col :span="54" class="full-h">
                  <CorrdeTable></CorrdeTable>
                </vgis-col>
                <vgis-col :span="18" class="full-h">
                  <CenterChart></CenterChart>
                </vgis-col>
              </vgis-row>
            </vgis-cell>
          </vgis-flex-column>
        </vgis-col>
        <vgis-col :span="12" class="full-h">
          <vgis-flex-column class="full-h">
            <vgis-cell :grow="1">
              <CategoryChart></CategoryChart>
            </vgis-cell>
            <vgis-cell style="height: 280px;" class="m-b-20">
              <CpartsTable></CpartsTable>
            </vgis-cell>
            <vgis-cell style="height: 420px;" class="m-b-20">
              <CriskStatistics></CriskStatistics>
            </vgis-cell>
          </vgis-flex-column>
        </vgis-col>
        <vgis-col :span="24" class="full-h">
          <vgis-flex-column class="full-h">
            <vgis-cell :grow="1" class="m-b-20">
              <vgis-row class="full-h">
                <vgis-card title="Process Diagram">
                  <dynamic-p-i-d-panel map-name="Overall" mode="NoTrain2" :alarm="true"></dynamic-p-i-d-panel>
                </vgis-card>
              </vgis-row>
            </vgis-cell>
            <vgis-cell>
              <CalarmTable></CalarmTable>
            </vgis-cell>
          </vgis-flex-column>
        </vgis-col>
      </vgis-row>
    </div>
</template>
<script>
    // import echarts from 'echarts'
    import majnoon from "./DashboardWidget/SplitScreen/HSSE/majnoon.vue"
    import { getData } from "../assets/js/api/data"
    import Title from "./Title.vue"
    import Logo from "./DashboardWidget/SplitScreen/Overview/Logo"
    import VgisRow from './Standard/vgis-row'
    import VgisCol from './Standard/vgis-col'
    import VgisFlexColumn from './Standard/vgis-flex-column'
    import VgisCell from './Standard/vgis-cell'
    import VgisTitle from './Standard/vgis-title'
    import VgisCard from './Standard/vgis-card'
    // HandlingNotice
    import CpicChart from "./Corrode/CpicChart"
    import HandlingNotice from "./Corrode/HandlingNotice"
    import TrendAnalysis from "./Corrode/TrendAnalysis"
    import CorrdeTable from "./Corrode/CorrdeTable"
    import CenterChart from "./Corrode/CenterChart"
    import CategoryChart from "./Corrode/CategoryChart"
    import CpartsTable from "./Corrode/CpartsTable"
    import CriskStatistics from "./Corrode/CriskStatistics"
    import DynamicPIDPanel from "./DashboardWidget/SplitScreen/Overview/DynamicPIDPanel"
    import CalarmTable from "./Corrode/CalarmTable"
    import centerMap from "./DashboardWidget/SplitScreen/Overview/centerMap"
    export default {
        name: 'Home',
        components: {
            majnoon,
            Title,
            Logo,
          VgisRow,
          VgisCol,
          VgisFlexColumn,
          VgisCell,
          VgisCard,
          VgisTitle,
            CalarmTable,
            CpicChart,
            HandlingNotice,
            TrendAnalysis,
            CorrdeTable,
            CenterChart,
            CategoryChart,
            CpartsTable,
            CriskStatistics,
            DynamicPIDPanel,
            centerMap
        },
        data() {

            return {
                title: "Corrosion loops drawing",
            }

        },
      computed: {
        title () {
          return 'VGIS - Corrosion Dashboard'
        }
      },
        methods: {},
    }
</script>
<style>
    .lastLogo {
        margin-top: 0px !important;
    }

    .logo:last-child {
        margin-top: 0px !important;
    }
</style>
<style lang="scss" scoped>
    .titleStyle {
        margin: 20px 0;
        background: linear-gradient(270deg, rgba(79, 172, 255, 0) 0%, rgba(79, 172, 255, 0.5) 100%);
        border-radius: 15px;
        /* font-size: 14px; */
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        padding-left: 15px;
        text-align: left;
        height: 35px !important;
        /* line-height: 35px !important; */
    }

    .el-row {
        margin-bottom: 0px;
        display: flex;
        justify-content: space-between;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .centerOperatingArea {
        display: flex;
        margin-left: -100px;
        z-index: 999;
    }

    .operatingArea {
        width: 55%;
        /* width: 100%; */
        margin-top: 15px;
        display: flex;

        li {
            list-style: none;
            margin: 0 20px;
            width: 20%;
            height: 56px;
            line-height: 56px;
            font-size: 26px;
            font-family: Helvetica;
            color: #FFFFFF;
            background: rgba(37, 69, 146, 0.4);
            box-shadow: 0px 0px 20px 0px rgba(0, 213, 255, 0.6) inset;
            border-radius: 8px;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;

            span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .svgSpn {
                width: 35px;
                height: 30px;
                display: inline-block;
                margin: 0 20px;
                background: url(../assets/images/流程图.svg) no-repeat
            }

            .shengchan {
                width: 35px;
                height: 30px;
                display: inline-block;
                margin: 0 20px;
                background: url(../assets/images/生产.svg) no-repeat
            }

            .tanzhen {
                width: 40px;
                height: 35px;
                display: inline-block;
                margin: 0 20px;
                background: url(../assets/images/探针管理.svg) no-repeat
            }

            .cctv {
                width: 35px;
                height: 33px;
                margin: 0 20px;
                display: inline-block;
                background: url(../assets/images/cctv.svg) no-repeat
            }
        }

    }

    .chartsArea {
        margin-left: 10px;

        .el-col {
            border-radius: 4px;
            /* // padding: 0 15px; */
            margin: 0 10px;
            /* background: linear-gradient(360deg, rgba(0, 213, 255, 0.2) 0%, rgba(0, 213, 255, 0) 100%); */
            background: #081C31;
            /* box-shadow: 0px 0px 10px 0px #00D5FF; */
            border-radius: 8px;
        }
    }

    .grid-content {
        border-radius: 4px;
        min-height: 200px;
        flex-grow: 1;
        /* height: 100%; */
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    #app {
        background: #081C31;
        width: 100%;
        height: 100%;
        flex-direction: column;
        flex-wrap: wrap;
        color: #fff;
        overflow: hidden;
        flex-grow: 1;

        h5 {
            height: 104px;
            top: 0;
            left: 0;
            background: none !important;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
