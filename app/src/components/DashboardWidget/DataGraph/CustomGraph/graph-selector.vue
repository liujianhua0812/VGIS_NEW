<template>
    <vgis-card title="图表选取">
        <div v-for="item in selections" class="chart-item">
            <el-radio :label="item.value" v-model="selection" @input="updateSelection">{{item.name}}</el-radio>
            <div>
                <el-image class="full-w" :src="item.image"></el-image>
            </div>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import Histogram from "@/assets/images/chart/histogram.png"
import MultipleLine from "@/assets/images/chart/multipleLine.png"
import Relation from "@/assets/images/chart/relation.png"

export default {
    name: "graph-selector",
    components: {
        VgisCard
    },
    props: {
        value: String
    },
    data () {
        return {
            selection: "histogram",
            selections: [{
                name: "直方图",
                value: "histogram",
                image: Histogram
            }, {
                name: "对比折线图",
                value: "multiple-line",
                image: MultipleLine
            }, {
                name: "关系散点图",
                value: "relation",
                image: Relation
            }]
        }
    },
    methods: {
        updateSelection () {
            this.$emit("input", this.selection)
        }
    },
    created() {
        let match = this.selections.find(item => item.value === this.value)
        if (match) {
            this.selection = match.value
        }
        else {
            this.selection = this.selections[0].value
            this.updateSelection()
        }
    }
}
</script>

<style scoped>
    .chart-item {
        margin-top: 16px;

        .el-radio {
            color:  #FFFFFF;
            font-family: "HarmonyOS Sans SC";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
            margin-bottom: 8px;
        }
    }
</style>