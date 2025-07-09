<template>
  <el-date-picker type="month" class="custom-selector" v-model="value" placeholder="选择年月" size="mini" @change="updateValue"></el-date-picker>
</template>

<script>
export default {
    name: "energy-month-selector",
    props: {
        value: Date
    },
    methods: {
        updateValue () {
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