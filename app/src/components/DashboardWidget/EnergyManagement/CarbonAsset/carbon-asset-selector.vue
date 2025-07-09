<template>
  <el-select clearable class="custom-selector" v-model="value" placeholder="请选择类型" size="mini" @change="updateValue">
      <el-option v-for="type in types" :key="type.id" :value="type.id" :label="type.name"></el-option>
  </el-select>
</template>

<script>
import { getAssetTypes } from "@/assets/js/api/catbon-asset";

export default {
    name: "carbon-asset-selector",
    props: {
        value: String
    },
    data () {
        return {
            types: []
        }
    },
    methods: {
        updateValue () {
            this.$emit("input", this.value)
        },
        getTypes () {
            getAssetTypes().then(result => {
                this.types = result.data
            })
        }
    },
    created() {
        this.getTypes()
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