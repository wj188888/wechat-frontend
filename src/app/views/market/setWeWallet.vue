<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox">
    <div class="person-box">
      <div class="person-avatar">
        <img :src="marketer.headImg" alt="">
      </div>
      <p class="person-name">{{marketer.name}}</p>
    </div>


    <div class="login-box line line-x-t line-x-b">
      <div class="log-item clearfix">
        <div class="label-title">手机号码</div>
        <input class="log-inp" placeholder="请输入手机号码" type="tel" v-model="phone" maxlength="11"/>
        <input type="button"
               class="log-ver-inp verify-disabled"
               v-model="verifyCodeTimer.value"
               :disabled="btnStatus.verifyCodebtn"
               @click="sendVerifyCode"/>
      </div>
      <div class="log-item clearfix line line-x-t">
        <div class="label-title">验证码</div>
        <input class="log-inp" placeholder="请输入短信验证码" type="tel" v-model="code"/>
      </div>
    </div>
    <!--:disabled="!(phone && code !== '' && userAuthBtn)" @click="userAuth"-->
    <p class="login-footer">
      <input type="button" value="完成"
             :disabled="!(phone && code)"
             @click="marketerGrant"
             class="login-btn"/>
    </p>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data() {
      return {
        title: this.$route.meta.title,
        marketer: {},
        verifyCodeTimer: {
          totalTime: 60,
          value: '获取验证码'
        },
        btnStatus: {
          verifyCodebtn: false,
          applyBtn: false
        },
        verifyTimer: '',
        phone: '',
        code: ''
      }
    },
    mounted () {
      this.getMarketInfo();
      console.log(this.$router);
    },
    methods: {
      getMarketInfo() {
        api.getMarketInfo().then((res) => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.marketer = data.resultData || {};
            console.log(this.marketer);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
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
      marketerGrant() {
        let validata = TOOL.formValidate([
          {value: this.phone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
          {value: this.code, emptyTips: '请输入验证码'}
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        api.marketerGrant({
          phone: this.phone,
          code: this.code,
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$store.dispatch('showSuccess', '设置成功');
            setTimeout(() => {
              this.$router.back();
            }, 1500);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
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
  label, .label-title {
    display: block;
    width:170px !important;
    height:100px;
    line-height:100px;
    font-size: 26px;
    color: #929292;
  }
  .log-inp{
    width: 0;
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


  .person-box {
    width: 100%;
    padding: 50px 0 60px 0;

    background: #fff;
  }
  .person-avatar {
    width: 130px;
    height: 130px;
    margin: 0 auto;

    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .person-name {
    font-size: 32px;
    color: #121212;

    text-align: center;
    margin-top: 20px;
  }
</style>