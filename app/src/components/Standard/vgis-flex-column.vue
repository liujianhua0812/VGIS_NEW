<script>
  export default {
    name: "vgis-flex-column",
    render(createElement, context) {
      let style = {}

      return createElement('div', {
        class: [
          'vgis-flex-column',
          'flex-column'
        ],
        style
      }, this.$slots.default)
    }
  }
</script>

<style scoped>

</style>
