<template>
  <div class="w100">
    <div class="user-info line line-x-b" @click="login">
      <div class="avatar">
        <div class="avatar-img" :style="headimgurl?{backgroundImage:'url(\'' + headimgurl + '\')'}:''"></div>
      </div>
      <p class="user-name" v-text="phone"></p>
      <p class="user-vip" v-if="phone !== '点击登录'">
        <i class="icon-vip"></i>
        普通会员
      </p>
      <p class="user-vip" v-if="phone === '点击登录'">登录后即可购买车票</p>
      <div class="edit-user-info" v-if="phone !== '点击登录'">
        <i class="icon-r-jt"></i>
      </div>
    </div>
    <div class="my-order">
      <div class="my-order-tit line line-x-b">
        <p>我的订单</p>
        <p class="all-order" @click="goOrderList(-1)">查看全部订单</p>
      </div>
      <ul class="my-order-status line line-x-b">
        <li class="order-status-0" @click="goOrderList(0)">未付款</li>
        <li class="order-status-1" @click="goOrderList(1)">待出行</li>
        <li class="order-status-4" @click="goOrderList(4)">待评价</li>
        <li class="order-status-5" @click="goOrderList(5)">已评价</li>
      </ul>
      <!--<div class="my-order-trip">-->
      <!--<div class="tit">-->
      <!--<p class="p1">最新行程</p>-->
      <!--<p>07-07</p>-->
      <!--</div>-->
      <!--<div class="trip">-->
      <!--<p class="p1">成都-绵阳</p>-->
      <!--<p>08:00 出发</p>-->
      <!--<i class="icon-r-jt"></i>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <div class="normal-list">
      <ul class="line line-box line-list">
        <router-link v-show="!isUndunionApp" tag="li" class="icon-my-info" :to="{name:'commonUsedAddress'}">
          常用信息<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" class="icon-my-vip" :to="{name:'vipCardList'}">
          我的会员卡<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" class="icon-my-coupon" :to="{name:'myCoupon'}">
          我的优惠券<i class="icon-r-jt"></i>
        </router-link>
      </ul>
    </div>
    <div class="normal-list">
      <ul class="line line-box line-list">
        <router-link tag="li" class="icon-my-score" :to="{name:'myScore'}">
          我的积分
          <span class="pull-right mar-r-20" v-if="myScore">{{myScore}}分</span>
          <i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" class="icon-my-invoice" v-if="showInvoice" :to="{name:'invoiceList'}">
          申请发票<i class="icon-r-jt"></i>
        </router-link>
        <router-link tag="li" class="icon-my-market" v-if="marketSetting" :to="{name:'marketIndex'}">
          全民营销<i class="icon-r-jt"></i>
        </router-link>
        <router-link v-show="!isUndunionApp" tag="li" class="icon-my-safe" :to="{name:'accountSecurity'}">
          账户安全<i class="icon-r-jt"></i>
        </router-link>
      </ul>
    </div>
    <div class="normal-list">
      <ul class="line line-box line-list">
        <li class="icon-my-kefu" @click="callService('')">
          客服电话<span class="pull-right" v-text="phoneNumber"></span>
        </li>
        <li class="icon-my-complaint" @click="callService(complainTel)">
          投诉电话<span class="pull-right" v-text="complainTel"></span>
        </li>
        <router-link v-show="!isUndunionApp" tag="li" class="icon-my-about mar-b-100" :to="{name:'about'}">
          关于我们<i class="icon-r-jt"></i>
        </router-link>
      </ul>
    </div>
    <div class="normal-list mar-b-100" v-show="isUndunionApp">
      <ul class="line line-box line-list">
        <li class="icon-my-setting" @click="callSetting">
          设置中心<span class="pull-right"></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import phone from 'mixins/phone'
  export default {
    mixins: [phone],
    data(){
      return {
        phoneNumber: appStorage.get('serviceTel') || TOOL.phoneNumber,
        complainTel: appStorage.get('complainTel') || TOOL.phoneNumber,
        phone: '点击登录',
        headimgurl: '',
        myScore: 0,
        isUndunionApp: TOOL.browser().undunion_app,
        showInvoice:false, // 默认不显示电子发票入口
        marketSetting: appStorage.get('marketSetting')
      }
    },
    mounted () {
      this.storeId = appStorage.get('StoreId');
      this.initialize()
    },
    watch: {
      $route () {
        this.initialize()
      }
    },
    methods: {
      initialize () {
        if (appStorage.get('X-Auth-Token')) {
          this.userGetUserInfo();
          this.findEVoiceSet(this.storeId);
        }else{
          this.phone = '点击登录'
          this.headimgurl = ''
          this.myScore = 0
        }
      },
      
      /**
       * 获取用户的基本信息
       * 注：浏览器、app、微信修改用户信息同步
       */
      userGetUserInfo () {
        api.userGetUserInfo().then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode === '0') {
            appStorage.set('userInfo', JSON.stringify(result.resultData))
            if (result.resultData.nickname) {
              this.phone = result.resultData.nickname
            } else {
              this.phone = result.resultData.phone
            }
            this.headimgurl = result.resultData.headimgurl
            this.myScore = result.resultData.points || 0
          } else {
            JsWebviewInterface.clearAppLoginData(appStorage.get('X-Auth-Token'))
            this.$store.dispatch('showError', result.resultMsg)
          }
        })
      },

      /*
      * 查询企业电子发票设置与否
      * */
      findEVoiceSet (storeId) {
        api.findEleInvoiceSetting(storeId).then(res => {
          const result = TOOL.toJson(res.data)
          if(result.resultCode === '0'){
              this.showInvoice = result.resultData;
          }else{
              this.$store.dispatch('showError', result.resultMsg);
          }

        });
      },

      goOrderList (status) {
        let orderListRouter = TOOL.getOrderListPageRouter()
        this.$router.push({
          name: orderListRouter,
          query: {
            status: status
          }
        })
      },
      
      /**
       * 跳转登录页面
       */
      login () {
        if (this.phone === '点击登录') {
          TOOL.login()
        } else {
          this.$router.push({name: 'userInfo'})
        }
      },
      
      callSetting () {
        this.$router.push({name: 'empty'})
        JsWebviewInterface.appSetting()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .w100{
    width: 100%;
  }
  .user-info{
    position:relative;
    height:200px;
    padding-left:156px;
    background-color: @c-fff;
    .edit-user-info{
      position:absolute;
      right:20px;
      top:100px;
      padding-right:20px;
      font-size:24px;
      color: @c-999;
      .icon-r-jt:after{
        right:0;
        margin-top:-5PX;
      }
    }
    .avatar{
      position:absolute;
      left:0;
      top:0;
      width:156px;
      height:100%;
      .avatar-img{
        margin:42px auto;
        width:116px;
        height:116px;
        background:url("../../../assets/my/geren.png") no-repeat center center;
        background-size:116px 116px;
        border-radius:50%;
      }
    }
    .user-name{
      padding:60px 0 28px;
      font-size:32px;
      color:#393A3E;
    }
    .user-vip{
      font-size:24px;
      color:#929292;
      .icon-vip{
        display: inline-block;
        width:24px;
        height:25px;
        margin-right:5PX;
        background:url("../../../assets/my/huiyuandengji.png") no-repeat center center;
        background-size:22px 22px;
        vertical-align: bottom;
      }
    }
  }
  .my-order{
    background-color: @bg-fff;
    color: @fc-4c4c4c;
    font-size:28px;
    .my-order-tit{
      margin-top:20px;
      padding:0 20px;
      height:80px;
      line-height:80px;
      display:flex;
      p{
        flex:1;
      }
      .all-order{
        text-align:right;
        color: @fc-888;
        font-size:24px;
      }
    }
    .my-order-status{
      display:flex;
      li{
        flex:1;
        padding:100px 0 30px;
        background: no-repeat center 30px;
        background-size:50px 50px;
        text-align:center;
        &.order-status-0{
          background-image:url("../../../assets/my/order_0.png")
        }
        &.order-status-1{
          background-image:url("../../../assets/my/order_1.png")
        }
        &.order-status-4{
          background-image:url("../../../assets/my/order_4.png")
        }
        &.order-status-5{
          background-image:url("../../../assets/my/order_5.png")
        }
      }
    }
    .my-order-trip{
      position: relative;
      padding:20px 0;
      color: @fc-888;
      display: flex;
      .tit{
        padding:0 20px;
      }
      .p1{
        margin-bottom:30px;
      }
      .trip{
        position: relative;
        flex:1;
        padding-left:90px;
        background:url("../../../assets/my/order_trip.png") no-repeat 20px center;
        background-size: 50px 50px;
        &:before{
          content: " ";
          display:block;
          position: absolute;
          left:1px;
          top:20px;
          width: 1PX;
          height:60px;
          background-color: @bg-e0e0e0;
        }
        .icon-r-jt:after{
          right:20px;
        }
      }
    }
  }
</style>
