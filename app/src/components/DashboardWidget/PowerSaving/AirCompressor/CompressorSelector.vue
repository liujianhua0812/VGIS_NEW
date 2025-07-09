<template>
    <vgis-card title="空压机筛选">
        <div class="selector">
            <div v-for="compressor in compressors" class="selector-item">
                <el-checkbox v-model="compressor.checked" @change="updateSelection"></el-checkbox>
                {{compressor.name}}
            </div>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getNodeChildren, getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "CompressorSelector",
    props: {
        value: Array,
        station: Object,
        least: {
            type: "Number",
            default: 2
        }
    },
    components: {
        VgisCard
    },
    watch: {
        station: {
            handler (newValue) {
                this.getInstances()
            },
            deep: true
        }
    },
    data () {
        return {
            compressors: []
        }
    },
    methods: {
        updateSelection () {
            this.$emit("input", this.compressors.filter(item => item.checked))
        },
        getInstances () {
            if (this.station) {
                getNodeChildren(encodeURIComponent(this.station.instanceId), "AirCompressor").then(result => {
                    this.compressors = result.data.map(item => {
                        item.checked = false
                        return item
                    })
                    for(let i = 0; i < Math.min(this.least, this.compressors.length); i++) {
                        this.compressors[i].checked = true
                    }
                    this.updateSelection()
                })
            }
        }
    },
    mounted() {
        this.getInstances()
    }
}
</script>

<style lang="scss" scoped>
  .selector {
      margin-top: 24px;

    .selector-item {
      margin-bottom: 8px;
      color: #FFFFFF;
      font-family: "HarmonyOS Sans SC";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
      display: flex;
      align-items: center;
    }

    .el-checkbox {
      margin-right: 8px;
    }
  }
</style>