<template>
  <el-radio-group class="fast-date" v-model="current" size="mini" @input="updatePeriod">
      <el-radio-button :label="item.name" :key="item.name" v-for="item in periods"></el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
    name: "vgis-fast-date-selector",
    data () {
        let basicGap = 60 * 60 * 24 * 1000
        return {
            current: "日",
            periods: [{
                name: "日",
                gap: basicGap
            }, {
                name: "周",
                gap: basicGap * 7
            }, {
                name: "月",
                gap: basicGap * 30
            }, {
                name: "年",
                gap: basicGap * 365
            }]
        }
    },
    methods: {
        updatePeriod () {
            let item = this.periods.find(item => item.name === this.current)
            if (item) {
                let now = new Date()
                let last = new Date(now.getTime() - item.gap)
                this.$emit("change", [last, now])
            }
        }
    },
    created() {
        this.updatePeriod()
    }
}
</script>

<style lang="scss">
  .fast-date .el-radio-button__inner {
    background-color: #003A8C;
    border-color: #003A8C;
    color: var(--Neutral-1, #FFF);
    font-family: "HarmonyOS Sans SC";
    border-left: none !important;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }
</style>