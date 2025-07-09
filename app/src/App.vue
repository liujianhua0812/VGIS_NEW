<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

  export default {
    name: 'App',
    data() {
      return {
        num: 0,
        verified: false
      }
    },
    methods: {
      setResolution (e) {
        this.$store.commit('setResolution', { width: window.innerWidth, height: window.innerHeight })
      },
      addListeners () {
        window.addEventListener("resize", this.setResolution)
      },
      removeListeners () {
        window.removeEventListener("resize", this.setResolution)
      }
    },
    beforeCreate() {

    },
    created () {
      this.setResolution()
      this.addListeners()
    },
    beforeDestroy() {
      this.removeListeners()
      clearInterval(this.loopId)
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    font-family: Alibaba sans;
  }
  *::selection{
    color: white;
    background: #4facff;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* color: #2c3e50; */
    width: 100%;
    height: 100%;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  body,
  html {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
</style>
