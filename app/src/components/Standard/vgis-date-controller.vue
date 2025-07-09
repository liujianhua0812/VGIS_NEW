<template>
    <div class="vgis-date-controller">
      <div :class="['date-item', { active: index === sIndex }]" v-for="(date, index) in dates" @click="selectDate(index)">
        <div class="date-label" v-if="index === sIndex">{{date.format("yyyy-MM-dd")}}</div>
        <el-image class="active-indicator" v-if="index === sIndex" :src="DateIndicator"></el-image>
      </div>
    </div>
</template>

<script>

import DateIndicator from "@/assets/images/dashboard/dateIndicator.png"
import config from "@/config"
import EventBus from "@/utils/EventBus"
export default {
  name: "vgis-date-controller",
  data () {
    return {
      dates: [],
      sIndex: 0,
      DateIndicator
    }
  },
  methods: {
    selectDate (index) {
      this.sIndex = index
      EventBus.$emit("date-updated", this.dates[this.sIndex])
    },
    generateDates (date) {
      this.dates = []
      for(let i = 0; i < 7; i++) {
        let _date = new Date(date.getTime())
        _date.setDate(_date.getDate() - i)
        this.dates = [_date].concat(this.dates)
      }
      this.sIndex = this.dates.length - 1
    }
  },
  created () {
    this.generateDates(config.general.date)
  }
}
</script>

<style lang="scss" scoped>
  .vgis-date-controller {
    position: relative;
    background: rgba(61, 225, 239, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .date-item {
      width: 10px;
      height: 10px;
      background: #FFFFFF;
      border: 1px solid #3DE1EF;
      margin-left: 24px;
      border-radius: 5px;
      cursor: pointer;
      position: relative;
    }

    .date-item.active {
      background: #3DE1EF;
    }

    .date-item:first-child {
      margin-left: 0;
    }

    .active-indicator {
      width: 10px;
      height: 14px;
      top: -24px;
      left: 0;
    }

    .date-label {
      top: 16px;
      left: -39px;
      width: 78px;
      position: absolute;
      font-family: 'HarmonyOS Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #3DE1EF;
    }
  }
</style>
