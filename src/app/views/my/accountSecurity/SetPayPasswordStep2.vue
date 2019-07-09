<template>
  <main-box :title="title" main-class="bg-fff scrollingBox" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="pad-20">
      <p class="phone-tips">设置6位数字支付密码</p>
      <password
        :pay-password="payPassword"
        @input="getPassword">
      </password>
      <input type="button" class="button login-btn" value="确定" :disabled="payPassword.length !== 6" @click="jumptoSetPayPasswordStep3"/>
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
        isUndunionApp: TOOL.browser().undunion_app,
        type:'',
        payPassword:'',
        payPasswordVerify: appStorage.get('payPasswordVerify')
      }
    },
    mounted(){
      this.type = this.$route.query.type
      if(this.type === 'change'){
          this.title = '修改支付密码'
      }
      if(!this.payPasswordVerify){
        this.$router.replace({
          name: 'setPayPasswordStep1',
        })
      }
    },
    methods: {
      getPassword (value) {
        this.payPassword = value
      },

      jumptoSetPayPasswordStep3 () {
        if(!/\d/.test(this.payPassword)){
          this.$store.dispatch('showError', '密码为6位数字');
          this.payPassword = ''
          return
        }
        appStorage.set('payPassword', this.payPassword)
        this.$router.push({
          name: 'setPayPasswordStep3',
          query: {
              type: this.type
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
