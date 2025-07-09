<template>
  <el-select class="custom-selector" v-model="value" placeholder="全部" size="mini" clearable @clear="updateSelection" @change="updateSelection">
      <el-option v-for="item in types" :key="item" :value="item" :label="item"></el-option>
  </el-select>
</template>

<script>

export default {
    name: "vgis-alert-type-selector",
    props: {
        value: String
    },
    data () {
        return {
            types: ["传感器故障", "机组导出故障", "需求不满足故障"]
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