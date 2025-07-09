<template>
    <el-date-picker
            size="mini"
            class="custom-date-selector"
            type="daterange"
            v-model="value"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="updateValue"
    ></el-date-picker>
</template>

<script>
export default {
    name: "vgis-simple-date-selector",
    props: {
        value: Date
    },
    data () {
        return {
            range: []
        }
    },
    methods: {
        updateValue () {
            this.$emit("input", this.value)
        }
    }
}
</script>

<style lang="scss">
.custom-date-selector.el-date-editor {
    border-radius: 2px;
    border: 1px solid #0050B3;
    background: #003A8C;

    .el-range-separator {
        background: transparent;
        color: #8C8C8C;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }

    input.el-range-input {
        background: transparent;
        color: #8C8C8C;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }

    input.el-range-input::placeholder {
        background: transparent;
        color: #8C8C8C;
        font-family: "HarmonyOS Sans SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
}
</style>