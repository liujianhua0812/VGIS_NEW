<template>
  <div class="parent full-h">
    <div class="full-h" style="max-height:100%;overflow: scroll">
      <div class="full-h" v-if="messageTexts.length">
        <div class="text-item" v-for="item in messageTexts">
          <div class="para-mark"></div>
          <div class="text-content">
            <span class="location" v-show="item.get('Location')" @click="chartClickFn(item.get('Location'))">{{ item.get('Location') }}</span>
            <span class="time" v-show="item.get('Time')">{{ new Date(item.get('Time')).format('yyyy-MM-dd hh:mm:ss') }}</span>
            <div class="description">{{ item.get('Description') }}</div>
          </div>
        </div>
      </div>
      <div class="full-h" v-else>
        <div class="no-content full-h">
          <img style="height:60%; " src="@/assets/images/pc/NoData.png">
          <div style="text-align: center">No data</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import EventBus from "@/utils/EventBus";
import config from "@/config";
import {getTableRecords} from '@/assets/js/api/hierarchy'

export default {
  name: "Miscellaneous",
  data() {
    return {
      messageTexts: [],
    }
  },
  created () {
    this.getData(config.general.date)
  },
  mounted() {
    EventBus.$on("date-updated", this.getData)
  },
  methods: {
    chartClickFn(params) {
      this.$bus.$emit("linkMapName", params, true)
    },
    getData(date) {
      let today = date;
      let timeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1000);
      getTableRecords(
        ['Miscellaneous'],
        [
          {name: 'Time', value: [timeStart, today]}
        ]
      ).then(res => {
        this.messageTexts = []
        res.data.map(item => {
          let map = new Map()
          for (let key in item.field_values) {
            map.set(item.field_values[key].fieldName, item.field_values[key].value)
          }
          this.messageTexts.push(map)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: HarmonyOS_Sans;
}

.parent {

  ::-webkit-scrollbar {
    display: unset;
    height: 0;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(29,174,255,0.2);
  }
  .no-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  //padding: 8px;
  //position:relative;
  color: rgba(255, 255, 255, 0.7);
  //border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;

  .text-item {
    position: relative;
    min-height: 35px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    font-size: 15px;
    background: linear-gradient(90deg, rgba(29, 174, 255, 0.1) 0%, rgba(29, 174, 255, 0) 100%);
    border-radius: 4px;
    padding-left: 13px;

    .text-content {
      padding: 6px 0;
      //flex: 1;

      .location {
        color: #3DE1EF;
        font-size: 16px;
        font-weight: 700;
        margin-right: 10px;
        cursor: pointer;
      }

      .time {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
      }

      .description {
        font-size: 15px;
        color: white;
      }
    }
  }

  .para-mark {
    position: absolute;
    left: 0;
    width: 3px;
    height: 35px;
    background-color: #3695FF;
    border-radius: 3px;
  }
}
</style>
