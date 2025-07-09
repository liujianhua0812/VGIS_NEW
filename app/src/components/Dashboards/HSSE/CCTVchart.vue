<template>
  <div class="full-h CCTVcontainer">
    <div class="full-h block">
      <div class="iconCCTV"></div>
      <div class="nameContainer">
        <div class="name">CCTV</div>
        <div class="data">{{cctvData}}</div>
      </div>
    </div>

    <div class=" full-h block">
      <div class="iconAccess"></div>
      <div class="nameContainer">
        <div class="name">Access</div>
        <div class="data">{{AccessData}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import {
  getNodeDetail,
  getTableRecords,getNodesByModel,
  getSeriesHistoryValues,
  getMultipleSeriesHistoryValues
} from "@/assets/js/api/hierarchy";

export default {
  name: "CCTVchart",
  components: {},
  data() {
    return {
      cctvData:0,
      AccessData:0
    };
  },
  methods: {
    getData() {
      getNodesByModel(["CCTV"]).then((res)=>{
        this.cctvData=res.data.length
      })
      getNodesByModel(["Entrance Guard"]).then((res)=>{
        this.AccessData=res.data.length
      })
    },
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}

.CCTVcontainer {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 0;
  .block {
    flex: 0 0 48%;
    display: flex;
    border: 0.5px solid rgba(165, 201, 255, 0.4);
    border-radius: 4px;
    .iconAccess{
      flex: 1;
      background-image: url("~@/assets/images/pc/Access.png");
      background-repeat: no-repeat;
      background-position: center;
    }
    .iconCCTV{
      flex: 1;
      background-image: url("~@/assets/images/pc/CCTV.png");
      background-position: center;
      background-repeat: no-repeat;
    }
    .nameContainer{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .data{
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
      }
    }
  }
}
</style>
