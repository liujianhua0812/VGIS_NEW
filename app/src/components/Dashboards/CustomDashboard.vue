<template>
    <iframe class="bi-container" :srcdoc="dashboard.content"></iframe>
</template>

<script>
import {
    getDashboardList,
    getDashboardDetail,
    addNewDashboard,
    updateDashboardDetail,
    updateDashboardGroup
} from '@/assets/js/api/bidashboard'

export default {
    data () {
        return {
            dashboard: {}
        }
    },
    methods: {
        getDashboard () {
            getDashboardDetail({ id: this.$route.params.dashboardId }).then(result => {
                this.dashboard = result.data
                console.log(this.dashboard)
            })
        }
    },
    created () {
        this.getDashboard()
    }
}

</script>

<style scoped lang="scss">
    .bi-container {
        width: 100%;
        height: 100%;
    }
</style>