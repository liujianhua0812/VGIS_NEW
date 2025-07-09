<template>
  <el-select class="custom-selector" v-model="value" placeholder="选择类型" size="mini" clearable @change="updateValue" >
      <el-option v-for="factor in factors" :key="factor.id" :value="factor.id" :label="factor.name"></el-option>
  </el-select>
</template>

<script>

import { getConversionFactors } from "@/assets/js/api/factor";

export default {
    name: "factor-selector",
    props: {
        value: String
    },
    data () {
        return {
            factors: []
        }
    },
    methods: {
        updateValue () {
            this.$emit("input", this.value)
        },
        getFactors () {
            getConversionFactors().then(result => {
                this.factors = result.data
            })
        }
    },
    created() {
        this.getFactors()
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