<template>
    <el-radio-group size="mini" class="energy-resources" v-model="selection" @change="updateSelection">
        <el-radio-button label="电"></el-radio-button>
        <el-radio-button label="天然气"></el-radio-button>
        <el-radio-button label="蒸汽"></el-radio-button>
        <el-radio-button label="水"></el-radio-button>
    </el-radio-group>
</template>

<script>
export default {
    name: "energy-resources-selector",
    props: {
        value: String
    },
    data () {
        return {
            selection: "电"
        }
    },
    methods: {
        updateSelection (value) {
            this.$emit("input", value)
        }
    }
}
</script>

<style>
.energy-resources .el-radio-button__inner {
    background-color: #003A8C;
    border-color: #003A8C;
    color: #FFFFFF;
    font-family: "HarmonyOS Sans SC";
    border-left: none !important;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
}
</style>