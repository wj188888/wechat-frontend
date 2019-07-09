<template>
  <main-box :title="title" main-class="bg-fff scrollingBox" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
    <div class="pad-20">
      <p class="phone-tips">请输入手机号<em> {{userInfo.phone | hidePhone}} </em>收到的验证码</p>
      <div class="verify-item">
        <input class="log-inp" placeholder="请输入您收到的验证码" type="tel" v-model="payPasswordVerify"/>
        <input type="button"
           class="log-ver-inp verify-disabled"
           v-model="verifyCodeTimer.value"
           :disabled="btnStatus.verifyCodebtn"
           @click="sendVerifyCode"/>
      </div>
      <input type="button" class="button login-btn" value="验证" :disabled="!(payPasswordVerify !== '' && userAuthBtn)" @click="verifySMS"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        isUndunionApp: TOOL.browser().undunion_app,
        phone: '',
        userInfo: {},
        payPasswordVerify: '',
        brandName: '',
        verifyCodeTimer: {
          totalTime: 60,
          value: '获取验证码'
        },
        btnStatus: {
          verifyCodebtn: false,
          applyBtn: false
        },
        userAuthBtn: true,
        verifyTimer: '',
        orderData:'',
        type: '',
      }
    },
    mounted(){
      this.userInfo = JSON.parse(appStorage.get('userInfo'))
      this.type = this.$route.query.payOrder
    },
    destroyed () {
      if (this.verifyTimer) {
        clearInterval(this.verifyTimer)
      }
    },
    methods: {

      /**
       *  发送验证码
       */
      sendVerifyCode () {
        this.btnStatus.verifyCodebtn = true
        api.smsFind({phone: this.userInfo.phone}).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode === '0') {
            this.$store.dispatch('showError', '验证码发送成功');
            this.verifyTimer = window.setInterval(()=> {
              if (this.verifyCodeTimer.totalTime > 0) {
                this.verifyCodeTimer.value = this.verifyCodeTimer.totalTime + '(s)'
                this.verifyCodeTimer.totalTime--
              } else {
                window.clearInterval(this.verifyTimer)
                this.verifyCodeTimer.value = '重新发送'
                this.verifyCodeTimer.totalTime = 60
                this.btnStatus.verifyCodebtn = false
              }
            }, 1000)
          } else {
            this.btnStatus.verifyCodebtn = false
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 用户登录
       * @returns {boolean}
       */
      verifySMS () {
        let validata = TOOL.formValidate([
          {value: this.payPasswordVerify, emptyTips: '短信验证码不能为空'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
  
        appStorage.set('payPasswordVerify',  this.payPasswordVerify)
        this.$router.push({
          name: 'setPayPasswordStep2',
          query:{
            type: this.type
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

  .verify-item{
    position: relative;
    height:100px;
    border:1PX solid @bc-e5e5e5;
    border-radius: 4px;
    overflow:hidden;
    .log-inp{
      display: block;
      padding:26px 220px 26px 20px;
      font-size: 28px;
      line-height: 1.8;
      color: @fc-121212;
    }
    .log-ver-inp{
      position: absolute;
      top:0;
      right:20px;
      display: block;
      width:180px;
      height:66px;
      line-height:66px;
      margin-top:15px;
      border:1PX solid @bc-e5e5e5;
      background-color: @bg-fff;
      color: @fc-121212;
      text-align: center;
      font-size:24px;
      padding:0;
      border-radius: 4px;
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
