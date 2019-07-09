<template>
  <main-box :title="title" main-class="bg-fff scrollingBox" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="pad-20">
      <p class="phone-tips">再次输入</p>
      <password
        :pay-password="password"
        @input="getPassword">
      </password>
      <input type="button" class="button login-btn" value="确定" :disabled="password.length !== 6" @click="addPayPasswordHandle"/>
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
        password:'',
        payPassword: appStorage.get('payPassword'),
        payPasswordVerify: appStorage.get('payPasswordVerify')
      }
    },
    mounted(){
      this.type = this.$route.query.type
      let backPage = ''
      if(this.type === 'change'){
        this.title = '修改支付密码'
        backPage = 'changePayPasswordStep1'
      }else{
        backPage = 'setPayPasswordStep1'
      }
      if(!this.payPassword || !this.payPasswordVerify){
        this.removeData()
        this.$router.replace({
          name: backPage,
        })
      }
    },
    methods: {
      getPassword (value) {
        this.password = value
      },

      removeData () {
        appStorage.remove('payPassword')
        appStorage.remove('payPasswordVerify')
      },

      addPayPasswordHandle () {
        if(!/\d/.test(this.password)){
          this.$store.dispatch('showError', '密码为6位数字');
          this.payPassword = ''
          return
        }else if(this.password !== this.payPassword){
          this.$store.dispatch('showError', '两次输入密码不一致');
          this.password = ''
          return
        }

        let resource = 'addPayPassword'
        if(this.type === 'change'){
          resource = 'resetPayPassword'
        }
        this.$store.commit('UPDATE_LOADING', true)
        api[resource](this.password, this.payPasswordVerify).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if(data.resultCode === '0'){
            this.removeData()
            appStorage.set('userInfo', JSON.stringify(data.resultData))
            this.$store.dispatch('showSuccess', '设置支付密码成功')
            if(this.type === 'payOrder'){
              this.$router.go(4)
            }else{
              this.$router.go(-3)
            }
          }else{
            if(this.type === 'payOrder'){
              this.$router.go(4)
            }else{
              this.$router.go(-3)
            }
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

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
