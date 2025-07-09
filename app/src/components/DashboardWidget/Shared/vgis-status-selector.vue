<template>
  <el-select class="custom-selector" v-model="value" placeholder="全部" size="mini" clearable @clear="updateSelection" @change="updateSelection">
      <el-option v-for="item in status" :key="item.name" :value="item.value" :label="item.name"></el-option>
  </el-select>
</template>

<script>
export default {
    name: "vgis-status-selector",
    props: {
        value: String
    },
    data () {
        return {
            status: [{
                name: "未处理",
                value: "pending"
            }, {
                name: "已处理",
                value: "solved"
            }, {
                name: "待议",
                value: "undetermined"
            }]
        }
    },
    methods: {
        updateSelection () {
            this.$emit("input", this.value)
        }
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