<script>
    export default {
        name: "vgis-row",
        props: {
          gutter: {
            type: Number,
            default: 0
          }
        },
        computed: {
          style () {
            const ret = {}

            if (this.gutter) {
              ret.marginLeft = `-${this.gutter / 2}px`
              ret.marginRight = ret.marginLeft
            }

            if (this.flex) {
              ret.flexGrow = 1
            }

            return ret
          },
          flex () {
            let parent = this.$parent
            while (parent && parent.$options._componentTag !== 'vgis-cell') {
              parent = parent.$parent
            }
            return !!parent
          }
        },
        render(createElement, context) {
          return createElement('div', {
            class: [
              'vgis-row'
            ],
            style: this.style
          }, this.$slots.default)
        }
    }
</script>

<style scoped>
  .vgis-row {
    display: block;
  }
</style>
