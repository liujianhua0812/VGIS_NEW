<template>
  <div class="m-l-20 full-h">
    <vgis-breadcrumb :navs="navs"></vgis-breadcrumb>
    <el-card v-loading="loading" style="min-height: calc(100% - 35px);" shadow="none">
      <el-input class="filter m-b-10" v-model="filter.query.value" clearable @clear="getFiles(1, true)" @keyup.native.enter="getFiles(1, true)">
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="getFiles(1, true)"></el-button>
        </template>
      </el-input>
      <div>
        <el-tag class="pointer m-r-10 m-t-10" v-for="type in filter.type.candidates" :effect="filter.type.value.includes(type) ? 'dark' : ''" @click="toggleType(type)">{{type}}</el-tag>
      </div>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="3" v-for="file in files" class="m-b-20">
          <el-card class="pointer" @click.native="download(file)">
            <div class="file-icon">
              <i class="el-icon-document"></i>
            </div>
            <a class="file-name" :title="file.name">{{file.name}}</a>
          </el-card>
        </el-col>
      </el-row>
      <div class="text-center m-t-20">
        <el-pagination hide-on-single-page :current-page="pagination.page" :page-count="pagination.totalPage" @current-change="getFiles"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { downloadFile } from "../../utils";
  import {getFile, getFileList, getFileTypes} from "../../assets/js/api/media-file";
  import VgisBreadcrumb from "../Standard/vgis-breadcrumb.vue";

  export default {
    name: "MediaPage",
    components: {
      VgisBreadcrumb,
    },
    data () {
      return {
        navs: [{
          name: this.$t("menu.home"),
          url: '/admin'
        }, {
          name: this.$t("menu.file")
        }],
        filter: {
          query: {
            value: ""
          },
          type: {
            value: [],
            candidates: [],
          }
        },
        loading: false,
        files: [],
        pagination: {
          page: 1,
          pagination: 40,
          total: 1,
          totalPage: 1
        },
      }
    },
    methods: {
      getFiles (page = 1) {
        this.loading = true
        this.pagination.page = page
        getFileList(Object.assign({
          query: this.filter.query.value,
          type: this.filter.type.value
        }, this.pagination)).then(result => {
          this.files = result.data
          this.pagination = result.pagination
          this.loading = false
        })
      },
      getTypes () {
        getFileTypes().then(result => {
          this.filter.type.candidates = result.data
        })
      },
      toggleType(type) {
        if (this.filter.type.value.includes(type)) {
          this.filter.type.value = this.filter.type.value.filter(item => item !== type)
        }
        else {
          this.filter.type.value = this.filter.type.value.concat([type])
        }
        this.getFiles()
      },
      download(file) {
        getFile(file.id).then(result => {
          downloadFile(file.name, result.data)
        })
      }
    },
    created() {
      this.getTypes()
      this.getFiles()
    }
  }
</script>

<style scoped>
  .file-icon {
    font-size: 48px;
    text-align: center;
    color: #409EFF;
  }

  .file-name {
    font-weight: bold;
    overflow-x: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
</style>
