<template>
  <el-card class="m-20">
    <div class="flex align-items-center justify-content-between">
      <h2 class="m-b-0">
        {{route.name}}
      </h2>
      <el-button class="p-0" icon="el-icon-back" type="text" @click="toList">Back</el-button>
    </div>
    <el-divider></el-divider>
    <h3>
      <b>Trail: </b>
      {{route.stops.map(item => !item.hasRelation ? item.name : item.equipName).join(" — ")}}
    </h3>
    <h3>
      <b>Settings: </b>
    </h3>
    <div>
      <ul class="m-l-20" style="list-style: none;">
        <li class="m-b-10">
          <b>Loop: </b>{{ route.config && route.config.loop ? 'Yes' : 'No' }}
        </li>
      </ul>
    </div>
    <h3>
      <b>Preview</b>
    </h3>
    <div style="width: 100%; height: 750px;">
      <route-viewer v-if="route.id" map-name="Majnoon" :route="route"></route-viewer>
    </div>
  </el-card>
</template>

<script>

    import RouteViewer from "@/components/Standard/RouteViewer";
    import {getRoute} from "@/assets/js/api/roaming";

    export default {
        name: "RoamingDetail",
        components: {
          RouteViewer
        },
        data () {
          return {
            route: {
              stops: [],
              settings: [],
              parsedRoute: {}
            }
          }
        },
        methods: {
          refresh () {
            getRoute(this.$route.params.routeId).then(result => {
              this.route = result.data
            })
          },
          toList () {
            this.$router.push({ name: 'RoamingList' })
          }
        },
        created() {
          this.refresh()
        },
        beforeDestroy() {

        }
    }
</script>

<style scoped>

</style>
