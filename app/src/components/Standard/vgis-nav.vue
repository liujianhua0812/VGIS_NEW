<template>
  <div class="navs">
      <span class="nav-item" v-for="(item, index) in navs">
          <router-link v-if="item.link" :to="item.link">{{item.name}}</router-link>
          <span class="curr" v-else-if="index < navs.length - 1">{{item.name}}</span>
          <span class="curr" v-else>{{item.name}}</span>
          <span class="el-icon-arrow-right" v-if="index < navs.length - 1"></span>
      </span>
  </div>
</template>

<script>
export default {
    name: "vgis-nav",
    props: {
        navs: {
            type: Array,
            default () {
                return []
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .navs {
    .nav-item {



      a {

      }
    }
  }
</style>