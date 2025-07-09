<template>
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{{title}}</title>
    <path id="&#232;&#183;&#175;&#229;&#190;&#132;" d="M1.31905 2.73233L7.04858 8.05985L7.04858 16.2171C7.04858 16.5776 7.24254 16.9101 7.55626 17.0875L12.4763 19.8704C12.7859 20.0455 13.1652 20.043 13.4725 19.8638C13.7797 19.6846 13.9686 19.3557 13.9686 19L13.9686 8.04384L19.6809 2.73233C19.982 2.4524 20.0811 2.01676 19.9307 1.63417C19.7803 1.25158 19.4111 1 19 1L2 1C1.58891 1 1.21971 1.25158 1.06932 1.63417C0.91893 2.01676 1.018 2.4524 1.31905 2.73233Z" :stroke="color" stroke-width="2" stroke-linejoin="round"/>
  </svg>
</template>

<script>
  export default {
    name: "FilterIcon",
    props: {
      disabled: Boolean,
      title: String,
      color: {
        type: String,
        default: '#4FACFF'
      }
    },
    // data () {
    //     return {
    //         color: {
    //             normal: "#009A3C",
    //             disabled: '#929292'
    //         }
    //     }
    // }
  }
</script>

<style scoped>

</style>
