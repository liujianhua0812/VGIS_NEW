<template>
  <div class="flex align-items-center justify-content-center id-container">
    <div class="text-center">
      <img :src="LoadingImage" />
      <div class="id-message">{{message}}</div>
    </div>
  </div>
</template>

<script>

  import LoadingImage from '@/assets/images/loading.gif'

  export default {
    name: "LoadingIndicator",
    props: {
      message: {
        type: String,
        default: "Loading……"
      }
    },
    data () {
      return {
        LoadingImage
      }
    }
  }
</script>

<style scoped>
  .id-container {
    width: 100%;
    height: 100%;
      background: rgba(10, 18, 30, 0.8);
  }

  .id-message {
    margin-top: 24px;
    font-size: 36px;
    line-height: 42px;
  }
</style>
