<script>
  export default {
    name: "vgis-cell",
    props: {
      grow: Number
    },
    render(createElement, context) {
      let style = {}

      if (this.grow) {
        style.flexGrow = this.grow
        style.height = 0
      }

      return createElement('div', {
        class: [
          'vgis-cell',
          'flex-column'
        ],
        style
      }, this.$slots.default)
    }
  }
</script>

<style scoped>

</style>
