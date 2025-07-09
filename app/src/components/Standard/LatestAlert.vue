<template>
    <div class="latest-alert">
        <div class="flex align-items-center full-h justify-content-between">
            <div class="el-icon-d-arrow-left pointer"></div>
            <div style="flex-grow: 1;" class="full-h m-l-20 m-r-20">
                <div class="text-bold" style="color: red;">
                    2023-08-30 16:50:11
                    &nbsp;|&nbsp;
                    设备UT-123-AB发生异常
                </div>
                <div>设备UT-123-AB已有3.5小时没有回传腐蚀数据，请及时检查设备是否正常。</div>
            </div>
            <div class="el-icon-d-arrow-right pointer"></div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
    .latest-alert {
        height: 50px;
        width: 600px;
        border-radius: 6px;
        padding: 5px 10px;
        color: #FFFFFF;
        background: #2375be;
    }
</style>