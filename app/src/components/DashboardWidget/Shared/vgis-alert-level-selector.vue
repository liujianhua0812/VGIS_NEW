<template>
  <el-select class="custom-selector" v-model="value" placeholder="全部" size="mini" clearable @clear="updateSelection" @change="updateSelection">
      <el-option v-for="item in levels" :key="item.name" :value="item.id" :label="item.name">
          <div class="flex align-items-center justify-content-between">
              <span style="float: left">{{ item.name }}</span>
              <span :style="`float: right; color: #FFFFFF; background: ${item.color}; border-radius: 50%; width: 16px; height: 16px; font-size: 13px; line-height: 16px; text-align: center;`">{{ item.level }}</span>
          </div>
      </el-option>
  </el-select>
</template>

<script>
import {getAlertLevelList} from "@/assets/js/api/alert_level";

export default {
    name: "vgis-alert-level-selector",
    props: {
        value: String
    },
    data () {
        return {
            levels: []
        }
    },
    methods: {
        updateSelection () {
            this.$emit("input", this.value)
        },
        getLevels () {
            getAlertLevelList().then(result => {
                this.levels = result.data
            })
        }
    },
    created() {
        this.getLevels()
    }
}
</script>

<style lang="scss">
  .custom-selector {

    input {
      border-radius: 2px;
      border: 1px solid #0050B3;
      background: #003A8C;
      color: var(--Neutral-6, #BFBFBF);
      font-family: "HarmonyOS Sans SC";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
  }
</style>