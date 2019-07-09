<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="login-box line line-x-t line-x-b">
      <div class="log-item clearfix">
        <label>手机号码</label>
        <input class="log-inp" placeholder="请输入手机号码" type="tel" v-model="phone" maxlength="11"/>
        <input type="button"
               class="log-ver-inp verify-disabled"
               v-model="verifyCodeTimer.value"
               :disabled="btnStatus.verifyCodebtn"
               @click="sendVerifyCode"/>
      </div>
      <div class="log-item clearfix line line-x-t">
        <label>短信验证码</label>
        <input class="log-inp" placeholder="请输入短信验证码" type="tel" v-model="code"/>
      </div>
    </div>
    <p class="agree-prc">点击登录即同意《<a @click="jumpToRegisterAgreement">{{brandName}}会员服务协议</a>》</p>
    <p class="login-footer">
      <input type="button" value="登录" :disabled="!(phone && code !== '' && userAuthBtn)" @click="userAuth" class="login-btn"/>
    </p>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import createOrder from 'mixins/createOrder.js'

  export default {
    components: {
      MainBox
    },
    mixins: [createOrder],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        phone: '',
        code: '',
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
        orderData:''
      }
    },
    mounted(){
      this.brandName = appStorage.get('Brand_Name')
      if (appStorage.get(this.pageRouter)) {
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        this.phone = localData.phone
        this.code = localData.code
      }
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
        let validata = TOOL.formValidate([
          {value: this.phone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.btnStatus.verifyCodebtn = true
        api.smsFind({phone: this.phone}).then(res => {
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
       * 保存表单信息
       */
      saveForm () {
        let localData = {
          phone: this.phone,
          code: this.code
        }
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 删除表单信息
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      jumpToRegisterAgreement () {
        this.saveForm();
        this.$router.push({
          name: 'registerAgreement'
        })
      },

      /**
       * 用户登录
       * @returns {boolean}
       */
      userAuth () {
        let validata = TOOL.formValidate([
          {value: this.phone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
          {value: this.code, emptyTips: '短信验证码不能为空'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.userAuthBtn = false
        this.$store.commit('UPDATE_LOADING', true)

        let resource = 'userAuth';
        if (!TOOL.browser().weixin || appStorage.get('hasAuthority')) {
          resource = 'userAuthByBrowser'
        }
        api[resource]({
          phone: this.phone,
          code: this.code
        }).then(res => {
          const result = TOOL.toJson(res.data)
          this.userAuthBtn = true
          this.$store.commit('UPDATE_LOADING', false)
          if (result.resultCode === '0') {
            this.deleteForm()
            //登录成功后缓存token并清除本地用于识别微信用户的token
            appStorage.set('X-Auth-Token', result.resultData.token)
            appStorage.remove('logoutToken')
            appStorage.set('userInfo', JSON.stringify(result.resultData.user))
            if(result.resultData.wxUserCouponList || result.resultData.integral){
              this.$store.commit('UPDATE_DIALOG', true)
              this.$store.commit('UPDATE_COUPON', {
                integral: result.resultData.integral,
                wxUserCouponList: result.resultData.wxUserCouponList,
              })
            }else{
              this.$store.dispatch('showSuccess', '登录成功')
            }
            this.afterLogin()
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      afterLogin () {
        this.createPassenger()
        let orderPage = TOOL.orderCreatePage
        
        let fromPage = {}
        if (appStorage.get('fromPage')) {
          fromPage = JSON.parse(appStorage.get('fromPage'))
        }

        if(fromPage.name){
          if ($.inArray(fromPage.name, orderPage) === -1) {
            appStorage.remove('fromPage');
            this.$router.replace({
              name: fromPage.name,
              query: fromPage.query
            })
          } else {
            this.createOrder(fromPage)
          }

        } else {
          this.$router.go(-1)
        }
      },

      createOrder (fromPage) {
        this.orderData = JSON.parse(appStorage.get('orderToSubmit'))
        this.orderData.contactTelephone = this.orderData.contactTelephone || this.phone
        this.orderData.formId = TOOL.getTimeStamp()
        if(!this.orderData){
          this.$router.go(-1)
        }
        this.orderCreated(fromPage.name, '', true)
      },

      createPassenger(){
        if(appStorage.get('passengers')){
          let passengers = JSON.parse(appStorage.get('passengers'))
          api.userAddPassengers(passengers).then(res => {
            const data = TOOL.toJson(res.data)
            if (data.resultCode === '0') {
              appStorage.remove('passengers')
            }
          })
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";

  .login-box{
    margin-top:20px;
    background-color: @c-fff;
    height:202px;
    .log-item{
      height:100px;
      padding:0 20px;
      display: flex;
      label{
        display: block;
        width:170px;
        height:100px;
        line-height:100px;
        font-size: 26px;
        color: #929292;
      }
      .log-inp{
        display: block;
        flex:1;
        padding:25px 0;
        border: 0;
        font-size: 28px;
        color: @c-121212;
        padding-right:10px;
      }
      .log-ver-inp{
        display: block;
        width:160px;
        height:65px;
        line-height:65px;
        margin-top:17px;
        border:1PX solid @c-ff6600;
        background-color: @c-fff;
        color: @c-ff6600;
        text-align: center;
        font-size:24px;
        padding:0;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
      }
    }
  }

  .agree-prc{
    margin-top:45px;
    font-size:26px;
    color: #525252;
    padding-right:20px;
    text-align: center;
    a{
      text-decoration: underline;
      text-decoration-color:#bfb6b6 ;
      color: #bfb6b6;
    }
  }

  .login-footer{
    margin:30px 20px;
    display: flex;
    .login-btn{
      flex:1;
      display: block;
      height:80px;
      line-height:80px;
      text-align: center;
      color: @c-fff;
      background-color: @c-ff6600;
      border:0;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      font-size:36px;
      &[disabled]{
        color: @c-fff;
        background-color:#FFDFCC;
      }
    }
  }

  .verify-disabled[disabled]{
    border:1PX solid #E8E8E8!important;
    color:#929292!important;
  }
</style>
