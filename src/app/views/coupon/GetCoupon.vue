<template>
  <!--<div>-->
    <div class="get-coupon-container">
      <div class="get-coupon-bg"></div>
      <div class="get-coupon-main">
        <div class="top-coupon-box">
          <div class="top-coupon-intro">
            <div class="top-coupon-avator" :style=" firmLogo ? {backgroundImage:'url(\'' + firmLogo + '\')'} : '' "></div>
            <div class="top-coupon-text">
              <p>Hi，亲爱的朋友</p>
              <p>送你出行优惠券，快来领取吧</p>
            </div>
          </div>
          <p class="top-coupon-tips">现在关注连接公众号，新人可获取更多优惠</p>
        </div>
        <input class="get-phone" type="tel" v-model="phone" placeholder="请填写您的手机号码"/>
        <a v-if="couponData.receiveType != 1" class="button button-yellow-lighter" @click="wxUserCouponTakeCouponA">立即领取</a>
        <a v-if="couponData.receiveType == 1" class="button button-yellow-lighter" @click="wxUserCouponTakeCouponNum">立即领取</a>
      </div>
      <p class="intro-tit" v-if="couponData.remark">使用说明</p>
      <p class="intro-text" v-if="couponData.remark">{{couponData.remark}}</p>
      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPasswordCoupon"></pay-dialog>

    </div>

  <!--</div>-->
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import PayDialog from 'appComponents/dialog/payDialog'


  export default {
    components: {
      MainBox,
      PayDialog
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        firmLogo: appStorage.get('firmLogo'),
        Brand_Name: appStorage.get('Brand_Name'),
        phone:'',
        showPayDialog: false,
        couponData:{},
      }
    },
    mounted () {
      this.couponId = this.$route.query.couponId
      if (appStorage.get('X-Auth-Token')) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.phone = usrInfo.phone
      }
      this.couponFindById()
    },
    methods: {
      
      /**
       * 查询优惠券详情
       */
      couponFindById () {
        api.couponFindById(this.couponId).then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.couponData = data.resultData;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      wxUserCouponTakeCouponNum() {
          let validata = TOOL.formValidate([
              {value: this.phone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
          ]);

          if (!validata.valid) {
              this.$store.dispatch('showError', validata.msg);
              return false;
          }
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          if(!usrInfo.whetherSetPayPS){
              this.$store.dispatch('showConfirm', {
                  title: '支付密码提示',
                  confirmText: '立即设置',
                  cancelText: '暂不设置',
                  content: '使用积分换券需要输入平台支付密码<br/>您还没有设置支付密码',
                  onConfirm: () => {
                      this.$router.push({
                          name: 'setPayPasswordStep1'
                      })
                  },
                  onCancel: () => {}
              })
          }else{
              this.showPayDialog = true;
          }
      },

      verifyPayPasswordCoupon (payPassword) {
          this.payPassword = payPassword
          this.$store.commit('UPDATE_LOADING', true)
          api.verifyPayPassword(this.payPassword).then(res => {
              this.$store.commit('UPDATE_LOADING', false)
              const data = TOOL.toJson(res.data)
              if (data.resultCode === '0') {
                  this.showPayDialog = false
                  api.wxUserCouponTakeCoupon(this.couponId).then(res=>{
                      const couponData = TOOL.toJson(res.data)
                      if (couponData.resultCode === '0') {
                          this.$router.push({
                              name: 'getCouponSuccess',
                              query:{
                                  myCouponId: couponData.resultData.id,
                                  couponId: this.couponId,
                              }
                          })
                      } else {
                          if(couponData.resultCode === '2094') {
                              this.$router.push({
                                  name: 'myCoupon'
                              })
                          }
                          this.$store.dispatch('showError', couponData.resultMsg);
                      }
                  })
              } else {
                  this.$store.dispatch('showError', data.resultMsg);
              }
          })
      },

      wxUserCouponTakeCouponA () {
        let validata = TOOL.formValidate([
          {value: this.phone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        api.wxUserCouponTakeCouponA(this.couponId, this.phone).then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.$router.push({
              name: 'getCouponSuccess',
              query:{
                myCouponId: data.resultData.id,
                couponId: this.couponId,
              }
            })
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
  .get-coupon-container{
    height:100%;
    padding:0 20px;
    background-image:linear-gradient(130deg, #fcbe36, #ffe885);
  }
  .get-coupon-bg{
    position: absolute;
    top:0;
    left:0;
    width: 95%;
    height:317px;
    background: url("../../../assets/my/bg.png") no-repeat 0 0;
    background-size: 100%;
    opacity: 0.5;
  }
  .get-coupon-main{
    position: relative;
    z-index:2;
    margin-top:200px;
    padding: 210px 55px 30px;
    border-radius:20px;
    background-color: #f24a4e;
    &.pad-success{
      padding-left:30px;
      padding-right:30px;
    }
  }
  .top-coupon-box{
    position: absolute;
    top: -110px;
    left:0;
    width: 100%;
    height:263px;
    background: url("../../../assets/my/hongbao.png") no-repeat 0 0;
    background-size: 100%;
  }
  .top-coupon-intro{
    position: relative;
    padding:64px 20px 30px 196px;
    .top-coupon-avator{
      position: absolute;
      top:50px;
      left:76px;
      width:90px;
      height:90px;
      border:4px solid #fff;
      border-radius:50%;
      background-repeat:no-repeat;
      background-position:center center;
      background-size:90px 90px;
      background-color:#fff;
    }
    .top-coupon-text{
      font-size:28px;
      line-height:1.4;
      color: #411909;
    }
  }
  .top-coupon-success{
    padding:70px 0;
    text-align: center;
    font-size:40px;
    color:#411909;
  }
  .top-coupon-tips{
    text-align: center;
    font-size:22px;
    color: #af5733;

  }
  .get-phone{
    display:block;
    width: 100%;
    margin-bottom:90px;
    line-height:40px;
    padding:22px 20px;
    overflow: hidden;
    font-size: 28px;
    color: #121212;
    border-radius:4px;
  }
  .intro-tit{
    margin-top:90px;
    margin-bottom:40px;
    padding-bottom: 26px;
    text-align:center;
    font-size:32px;
    color: #411909;
    background:url("../../../assets/my/shuoming.png") no-repeat bottom center;
    background-size: 267px 14px;
  }
  .intro-text{
    position: relative;
    padding-left:30px;
    font-size:28px;
    color: #af5733;
    margin-bottom:30px;
    line-height:1.4;
  }
</style>
