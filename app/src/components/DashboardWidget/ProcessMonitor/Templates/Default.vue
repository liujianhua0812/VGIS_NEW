<template>
    <vgis-row :gutter="24" class="full-h">
        <vgis-col :span="72" class="full-h">
            <vgis-cell class="full-h">
                <vgis-card no-header>
                    <div class="pid-container">
                        <DynamicPID class="full" :preview="false" :pid="pid"></DynamicPID>
                    </div>
                </vgis-card>
            </vgis-cell>
        </vgis-col>
    </vgis-row>
</template>

<script>
import VgisCard from "@/components/Standard/vgis-card.vue";
import VgisRow from "@/components/Standard/vgis-row.vue";
import VgisCol from "@/components/Standard/vgis-col.vue";
import VgisCell from "@/components/Standard/vgis-cell.vue";
import DynamicPID from "@/components/Admin/PID/DynamicPID.vue";

export default {
    name: "Default",
    props: {
        pid: Object
    },
    components: {DynamicPID, VgisCell, VgisCol, VgisRow, VgisCard}
}
</script>

<style scoped>
  .pid-container {
      width: 100%;
      height: calc(100% - 20px);
      padding-top: 20px;
      display: flex;
      align-items: center;
  }
</style>