<template>
  <svg width="18px" height="22px" viewBox="0 0 18 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>{{title}}</title>
    <g id="2D-" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="2D地图-工具栏收缩" transform="translate(-22.000000, -71.000000)">
        <g id="Addnewmap" transform="translate(23.000000, 72.000000)">
          <path d="M1.44,0 L12.6386555,0 L12.6386555,0 L16,3.47107438 L16,18.56 C16,19.35529 15.35529,20 14.56,20 L1.44,20 C0.64470996,20 -3.4669427e-16,19.35529 0,18.56 L0,1.44 C1.24649665e-16,0.64470996 0.64470996,-2.979968e-16 1.44,0 Z" id="矩形" :stroke="color" stroke-width="2" stroke-linejoin="round"></path>
          <g id="编组-11" transform="translate(3.000000, 6.000000)" fill="#CECECE">
            <rect id="矩形" x="4" y="0" width="2" height="10" rx="1"></rect>
            <rect id="矩形备份-5" transform="translate(5.000000, 5.000000) rotate(-90.000000) translate(-5.000000, -5.000000) " x="4" y="9.09494702e-13" width="2" height="10" rx="1"></rect>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
    name: "AddIcon",
    props: {
        active: Boolean,
        title: String,
      color: {
        type: String,
        // default: '#BBBBBB'
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
