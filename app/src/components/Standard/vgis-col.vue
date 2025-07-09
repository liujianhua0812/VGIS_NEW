<script>
  export default {
    name: "vgis-col",
    props: {
      span: {
        type: Number,
        default: 72
      }
    },
    computed: {
      gutter () {
        let parent = this.$parent
        while (parent && parent.$options._componentTag !== 'vgis-row') {
          parent = parent.$parent
        }
        return parent ? parent.gutter : 0
      },
      flex () {
        let parent = this.$parent
        while (parent && parent.$options._componentTag !== 'vgis-row') {
          parent = parent.$parent
        }
        return parent ? !!parent.flex : false
      }
    },
    render (createElement, context) {
      let classList = [];
      classList.push(`el-col-${this.span}`)

      let style = {};

      if (this.gutter) {
        style.paddingLeft = this.gutter / 2 + 'px';
        style.paddingRight = this.gutter / 2 + 'px';
      }
      if (this.flex) {
        style.height = '100%'
      }

      return createElement('div', {
        class: [
          'vgis-col',
          classList
        ],
        style
      }, this.$slots.default)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .vgis-col {
    display: inline-block;
  }

  .el-col-0 {
    display: none;
  }

  @for $i from 0 through 72 {
    .el-col-#{$i} {
      width: (1 / 72 * $i * 100) * 1%;
    }
  }
</style>
