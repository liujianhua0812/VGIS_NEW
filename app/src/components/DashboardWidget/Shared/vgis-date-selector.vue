<template>
  <div class="custom-date-selector">
      <el-radio-group v-model="current" size="mini" @input="updatePeriod">
          <el-radio-button :label="item.name" :key="item.name" v-for="item in periods"></el-radio-button>
      </el-radio-group>
      <el-date-picker
              type="daterange"
              v-model="range"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="notify"
      ></el-date-picker>
  </div>
</template>

<script>
export default {
    name: "vgis-date-selector",
    props: {
        value: Array
    },
    data () {
        let basicGap = 60 * 60 * 24 * 1000
        return {
            basicGap,
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
                name: "季度",
                gap: basicGap * 90
            }, {
                name: "年",
                gap: basicGap * 365
            }],
            range: []
        }
    },
    methods: {
        updatePeriod () {
            let item = this.periods.find(item => item.name === this.current)
            if (item) {
                let now = new Date()
                let last = new Date(now.getTime() - item.gap)
                this.range = [last, now]
                this.notify()
            }
        },
        notify () {
            this.$emit("input", this.range)
        }
    },
    created() {
        if (this.value.length > 0) {
            this.range = this.value.slice(0, 2)
            if (this.range[0] && this.range[1] && this.range[1].format("yyyy-MM-dd") === new Date().format("yyyy-MM-dd")) {
                let endDate = new Date(
                    this.range[1].getFullYear(),
                    this.range[1].getMonth(),
                    this.range[1].getDate(),
                )
                let startDate = new Date(
                    this.range[0].getFullYear(),
                    this.range[0].getMonth(),
                    this.range[0].getDate(),
                )
                let item = this.periods.find(item => item.gap === endDate - startDate)
                if (item) {
                    this.current = item.name
                }
            }
        }
        else {
            this.updatePeriod()
        }
    }
}
</script>

<style lang="scss">
  .custom-date-selector {
    .el-radio-button__inner {
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

    .el-date-editor {
      border-radius: 2px;
      border: 1px solid #0050B3;
      background: #003A8C;
      width: calc(100% - 248px);
      margin-left: 8px;
      height: 38px;

      input.el-range-input {
        background: transparent;
        color: #8C8C8C;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }

      input.el-range-input::placeholder {
        background: transparent;
        color: #8C8C8C;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }
    }
  }
</style>