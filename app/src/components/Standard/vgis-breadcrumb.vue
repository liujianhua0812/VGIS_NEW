<template>
    <div :class="['navs', { light }]">
      <span class="nav-item" v-for="(item, index) in navs">
          <router-link v-if="item.link" :to="item.link">{{item.name}}</router-link>
          <router-link v-else-if="item.url" :to="item.url">{{item.name}}</router-link>
          <span v-else-if="index < navs.length - 1">{{item.name}}</span>
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
        },
        light: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="scss" scoped>
.navs {
  padding: 0;

  .nav-item {
    color: #8C8C8C;
    font-family: "HarmonyOS Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */

    * {
      margin-right: 4px;
    }

    a {
      text-decoration: none;
      color: #8C8C8C;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
    }

    .curr {
      color: #FFFFFF;
      font-weight: 900;
      line-height: 22px; /* 157.143% */
    }
  }
}

.navs.light {
  padding: 8px 0;

  .nav-item {

    a {
      color: #4FACFF;
    }

    .curr {
      color: #B3B3B3;
    }
  }
}
</style>