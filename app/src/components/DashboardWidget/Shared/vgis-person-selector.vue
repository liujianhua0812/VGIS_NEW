<template>
  <el-select :multiple="multiple" class="custom-selector" v-model="curr" placeholder="选择人员" size="mini" clearable @change="selectPerson">
      <el-option v-for="person in people" :key="person.user.id" :value="person.user.id" :label="person.user.realName"></el-option>
  </el-select>
</template>

<script>
import {getUserList} from "@/assets/js/api/accounts";
export default {
    name: "vgis-person-selector",
    props: {
        value: [String, Array],
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            curr: "",
            people: []
        }
    },
    methods: {
        getUsers () {
            getUserList().then(result => {
                this.people = result.data
            })
        },
        selectPerson () {
          this.$emit("input", this.curr)
        }
    },
    created() {
        this.curr = this.value || (this.multiple ? [] : "")
        this.getUsers()
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