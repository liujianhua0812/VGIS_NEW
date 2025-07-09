<template>
  <el-input class="custom-input" type="number" v-model="curr" step="1" min="1" placeholder="请设置" size="mini" @input="updateValue"></el-input>
</template>

<script>
export default {
    name: "vgis-number-input",
    props: {
        value: Number
    },
    watch: {
        value (newValue) {
            this.curr = `${this.value}`
        }
    },
    data () {
        return {
            curr: ""
        }
    },
    methods: {
        updateValue () {
            this.$emit("input", parseInt(this.curr))
        }
    },
    created() {
        this.curr = `${this.value}`
    }
}
</script>

<style lang="scss">
  .custom-input {

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