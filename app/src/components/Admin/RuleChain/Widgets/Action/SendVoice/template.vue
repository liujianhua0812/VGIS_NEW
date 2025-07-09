<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold">{{label}}</h3>
        <el-button size="mini" type="primary">{{$t("action.configure")}}</el-button>
    </div>
</template>

<script>

export default {
    name: "ThresholdTemplate",
    props: {
        label: String
    },
    data() {
        return {}
    },
    methods: {},
    created() {
    }
}
</script>

<style lang="scss" scoped>

</style>
