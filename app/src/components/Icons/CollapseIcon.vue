<template>
  <svg width="21px" height="18px" viewBox="0 0 21 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>{{title}}</title>
    <g id="3D" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
      <g id="3D-模式-鸟瞰和-俯视模式下能看到的数据备份-2" transform="translate(-62.000000, -1004.000000)" :stroke="color" stroke-width="2">
        <g id="Collapse" transform="translate(72.500000, 1013.000000) rotate(-180.000000) translate(-72.500000, -1013.000000) translate(63.000000, 1005.000000)">
          <line x1="2.5313085e-13" y1="8" x2="19" y2="8" id="路径-8" transform="translate(9.500000, 8.000000) rotate(-360.000000) translate(-9.500000, -8.000000) "></line>
          <line x1="19" y1="8" x2="11" y2="16" id="路径-9" transform="translate(15.000000, 12.000000) rotate(-360.000000) translate(-15.000000, -12.000000) "></line>
          <line x1="19" y1="8" x2="11" y2="0" id="路径-10" transform="translate(15.000000, 4.000000) rotate(-360.000000) translate(-15.000000, -4.000000) "></line>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
    name: "CollapseIcon",
    props: {
        active: Boolean,
        title: String,
      color: {
        type: String,
        default: '#BBBBBB'
      }
    },
    // data () {
    //     return {
    //         color: {
    //             normal: "#BBBBBB",
    //             active: '#FFFFFF'
    //         }
    //     }
    // }
}
</script>

<style scoped>

</style>
