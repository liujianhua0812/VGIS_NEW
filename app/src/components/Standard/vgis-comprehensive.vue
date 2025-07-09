<template>
  <div :class="`${isPC ? '' : 'noc-'}vgis-comprehensive-container`">
    <div class="imgs">
      <img :src="image" alt="">
    </div>
    <div class="content">
      <p>{{name}} <span>{{moreData}}</span></p>
      <ul>
        <li>Total: <b>{{totalData}}</b></li>
        <li>Fault: <span>{{faultData}}</span></li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'vgis-comprehensive',
    props: {
      name: {
        type: String,
        default: "",
      },
      image: String,
      totalData: Number,
      faultData: Number,
      moreData: {
        type: String,
        default: ""
      }
    },
    computed: {
      isPC () {
        return this.$route.name.match(/PC/) ? 'PC' : ''
      },
    },
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {

    }
  }
</script>
<style lang="scss">

  @each $affix in [noc-vgis vgis] {
    .#{$affix}-comprehensive-container {
      width: 100%;
      height: calc(100% - 20px);
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;

      .imgs {
        width: 30%;
        text-align: start;
        margin-top: 3px;
      }

      .content {
        width: 70%;
        list-style: none;
        padding: 20px;

        p {
          font-size: 24px;
          display: flex;
          justify-content: space-between;
          font-family: AlibabaSans-Bold, AlibabaSans;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 38px;
          text-align: start;

          span {
            height: 22px;
            font-size: 14px;
            font-family: AlibabaSans-Bold, AlibabaSans;
            font-weight: bold;
            color: #4FACFF;
            line-height: 22px;
          }
        }

        ul {
          width: 100%;
          display: flex;
          justify-content: space-between;

          li {
            list-style: none;
            text-align: start;
            height: 31px;
            font-size: 20px;
            font-family: AlibabaSans-Medium, AlibabaSans;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 31px;

            b {
              font-size: 20px;
              font-family: AlibabaSans-Medium, AlibabaSans;
              font-weight: 500;
              color: #FFFFFF;
              line-height: 31px;
            }

            span {
              height: 31px;
              font-size: 20px;
              font-family: AlibabaSans-Medium, AlibabaSans;
              font-weight: 500;
              color: #FF4040;
              line-height: 31px;
            }
          }
        }
      }

    }
  }

</style>
