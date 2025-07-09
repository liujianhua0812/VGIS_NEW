<template>
  <div class="center">
    <div class="text-center">
      <el-image :src="ErrorIcon"></el-image>
      <div class="error-title">{{message}}</div>
      <button v-if="redirectUri" class="error-action" @click="redirect">Back</button>
    </div>
  </div>
</template>

<script>

    import ErrorIcon from '@/assets/images/error.png'

    export default {
        name: "ErrorPage",
        props: {
          redirectUri: String
        },
        computed: {
          message () {
            return this.$route.params.msg || 'Unknown Error'
          }
        },
        data () {
          return {
            ErrorIcon
          }
        },
        methods: {
          redirect () {
            if (this.redirectUri) {
              this.$router.replace(this.redirectUri)
            }
            else {
              this.$router.replace({name: 'SignInPage'})
            }
          }
        }
    }
</script>

<style scoped>
  .center {
    width: 100%;
    margin-top: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-title {
    height: 42px;
    font-size: 30px;
    font-family: Boston-SemiBold, Boston;
    font-weight: 600;
    color: #333333;
    line-height: 39px;
    margin-top: 40px;
  }

  .error-action {
    width: 290px;
    height: 60px;
    margin-top: 40px;
    background: #254592;
    border-radius: 8px;
    font-size: 24px;
    font-family: Boston-SemiBold, Boston;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 31px;
    cursor: pointer;
  }
</style>
