<template>
  <div id="app">
    <vue-headful :title="`${title}`"/>
    <el-row :gutter="30" style="height: 100%;">
      <el-col :span="24" style="height:100%; width: 100%; margin: 0 0;">
        <dynamic-p-i-d-panel map-name="Overall" instanceId="Majnoon" :dynamic="true"></dynamic-p-i-d-panel>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import DynamicPIDPanel from "@/components/DashboardWidget/Shared/DynamicPIDPanel";

  export default {
    name: 'Home',
    components: {
      DynamicPIDPanel
    },
    data() {
      return {}
    },
    computed: {
      title () {
        return 'VGIS - PID Dashboard'
      }
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .chartsArea {
    .el-col {
      border-radius: 4px;
      /* // padding: 0 15px; */
      margin: 0 10px;
      background: linear-gradient(360deg, rgba(0, 213, 255, 0.2) 0%, rgba(0, 213, 255, 0) 100%);
    }
  }

  .grid-content {
    border-radius: 4px;
    min-height: 200px;
    flex-grow: 1;
    height: 100%;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  #app {
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
        /*width: 100%;*/
        height: 100%;
      }
    }

    .productionList {

      width: 100%;

      display: flex;

      flex-wrap: wrap;

      justify-content: space-between;


      h6 {

        width: 100%;

        height: 31px;

        font-size: 18px;

        font-family: AlibabaSans-Bold, AlibabaSans;

        font-weight: bold;

        color: #FFFFFF;

        line-height: 31px;

        text-align: start;

      }

      dl {

        width: 33%;

        height: 90px;

        dt {

          width: 100%;

          height: 28px;

          font-size: 18px;

          font-family: AlibabaSans-Regular, AlibabaSans;

          font-weight: 400;

          color: #FFFFFF;

          line-height: 28px;

          text-align: start;
          i{
            width: 6px;
            height: 14px;
            background: #00D5FF;
            display: inline-block;
            margin-right: 10px;
          }
        }

        dd {

          width: 100%;

          height: 47px;

          font-size: 30px;

          font-family: AlibabaSans-Heavy, AlibabaSans;

          font-weight: 800;

          color: #FFFFFF;

          line-height: 47px;

          text-align: center;

          padding-top: 10px;

        }

      }



    }

    .todayOil {

      width: 100%;

      display: flex;

      flex-wrap: wrap;

      h6 {

        width: 100%;

        height: 31px;

        font-size: 18px;

        font-family: AlibabaSans-Bold, AlibabaSans;

        font-weight: bold;

        color: #FFFFFF;

        line-height: 31px;

        text-align: start;

      }

      dl {

        width: 50%;

        height: 90px;

        dt {

          width: 100%;

          height: 28px;

          font-size: 18px;

          font-family: AlibabaSans-Regular, AlibabaSans;

          font-weight: 400;

          color: #FFFFFF;

          line-height: 28px;

          text-align: start;
          i{
            width: 6px;
            height: 14px;
            background: #00D5FF;
            display: inline-block;
            margin-right: 10px;
          }


        }

        dd {

          width: 100%;

          height: 47px;

          font-size: 30px;

          font-family: AlibabaSans-Heavy, AlibabaSans;

          font-weight: 800;

          color: #FFFFFF;

          line-height: 47px;

          text-align: center;

          padding-top: 10px;

        }

      }

    }


  }
</style>
