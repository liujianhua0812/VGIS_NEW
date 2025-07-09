<template>
  <div class="ctv">
    <surveillance-item v-for="(item, index) in cctvs" :rows="1" :key="index" :info="item" :default-cover="DefaultCover">
    </surveillance-item>
  </div>
</template>
<script>

  import DefaultCover from '@/assets/images/cctv1.png'
  import SurveillanceItem from "../DashboardWidget/Shared/SurveillanceItem.vue"
  export default {
    name: "RealtimeCCTV",
    components: {
      SurveillanceItem
    },
    props: {
      title: String,
      cctvs: Array,
    },
    data() {
      return {
        DefaultCover
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ctv {
    //width: 100%;
    //overflow: hidden;
    //height: 100%;
    //margin-top: -10px;

    width: 100%;
    display: flex;
    flex-direction: row;
    //justify-content: space-around;
    justify-content: space-between;
    flex-wrap: wrap;
    //height: 100%;

    //.cctv-item {
    //  height: calc(100%/2);
    //  border-bottom: 1px solid #4FACFF;
    //}
  }
</style>
