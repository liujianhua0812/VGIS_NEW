<template>
    <el-cascader
        clearable
        class="custom-selector"
        :props="{ multiple: false, value: 'id', label: 'name', emitPath: false, checkStrictly: true }"
        v-model="value"
        placeholder="选择设备"
        size="mini" :options="PointTree" @change="updateSelection" @clear="updateSelection"></el-cascader>
</template>

<script>
import PointTree from "./device-template"
import { getHierarchy } from "@/assets/js/api/hierarchy";

export default {
    name: "vgis-index-selector",
    props: {
        value: {
            type: Array
        }
    },
    data () {
        return {
            props: {
                label: "name",
                value: "id"
            },
            PointTree: []
        }
    },
    methods: {
        getHierarchy () {
            getHierarchy().then(result => {
                this.PointTree = result.data
            })
        },
        updateSelection () {
            this.$emit("input", this.value)
        }
    },
    created() {
        this.getHierarchy()
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