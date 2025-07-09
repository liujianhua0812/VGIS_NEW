<template>
  <el-select class="custom-selector" v-model="curr" placeholder="选择年份" size="mini" @change="updateYear">
      <el-option v-for="year in years" :key="year" :value="year" :label="year"></el-option>
  </el-select>
</template>

<script>
export default {
    name: "vgis-year-selector",
    props: {
        value: Number
    },
    data () {
        let years = []
        let now = new Date()
        for(let i = now.getFullYear(); i >= 2000 ; i--) {
            years.push(i)
        }

        return {
            curr: now.getFullYear(),
            years
        }
    },
    methods: {
        updateYear () {
            this.$emit("input", parseInt(this.curr))
        }
    },
    created() {
        this.curr = this.value || new Date().getFullYear()
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