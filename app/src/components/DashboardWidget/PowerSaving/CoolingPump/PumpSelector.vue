<template>
    <vgis-card title="冷冻水泵筛选">
        <div class="selector">
            <div v-for="pump in pumps" class="selector-item">
                <el-checkbox v-model="pump.checked" @change="updateSelection"></el-checkbox>
                {{pump.name}}
            </div>
        </div>
    </vgis-card>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import {getNodeChildren, getNodesByModel} from "@/assets/js/api/hierarchy";

export default {
    name: "PumpSelector",
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
            pumps: []
        }
    },
    methods: {
        updateSelection () {
            this.$emit("input", this.pumps.filter(item => item.checked))
        },
        getInstances () {
            if (this.station) {
                let system = null
                getNodeChildren(encodeURIComponent(this.station.instanceId), "CoolingSystem").then(result => {
                    system = result.data[0]
                    if (system) {
                        getNodeChildren(encodeURIComponent(system.instanceId), "CoolingPump").then(result => {
                            this.pumps = result.data.map(item => {
                                item.checked = false
                                return item
                            })
                            for(let i = 0; i < Math.min(this.least, this.pumps.length); i++) {
                                this.pumps[i].checked = true
                            }
                            this.updateSelection()
                        })
                    }
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