<template>
  <main-box :title="title" main-class="bg-fff scrollingBox" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="pad-20">
      <p class="phone-tips">输入支付密码，完成支付验证</p>
      <password
        :pay-password="payPasswordVerify"
        @input="getPassword">
      </password>
      <input type="button" class="button login-btn" value="确定" :disabled="payPasswordVerify.length !== 6" @click="jumptoSetPayPasswordStep2"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import Password from 'components/password/password'

  export default {
    components: {
      MainBox,
      Password
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        payPasswordVerify:'',
        isUndunionApp: TOOL.browser().undunion_app
      }
    },
    mounted(){

    },
    methods: {
      getPassword (value) {
        this.payPasswordVerify = value
      },

      jumptoSetPayPasswordStep2 () {
        if(!/\d/.test(this.payPasswordVerify)){
          this.$store.dispatch('showError', '密码为6位数字');
          this.payPasswordVerify = ''
          return
        }
        appStorage.set('payPasswordVerify', this.payPasswordVerify)
        this.$router.push({
          name: 'setPayPasswordStep2',
          query:{
            type: 'change'
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .phone-tips{
    text-align:center;
    font-size:28px;
    color: #121212;
    padding:40px 0 80px;
    em{
      color: @fc-ff6600;
    }
  }

  .login-btn{
    margin-top:100px;
    color: @c-fff;
    background-color: @c-ff6600;
    &[disabled]{
      color: @c-fff;
      background-color:#ffdfcc;
    }
  }

  .verify-disabled[disabled]{
    border:1PX solid #e8e8e8!important;
    color:#929292!important;
  }
</style>
