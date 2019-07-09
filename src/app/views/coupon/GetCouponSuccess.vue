<template>
  <div class="get-coupon-container">
    <div class="get-coupon-bg"></div>
    <div class="get-coupon-main pad-success">
      <div class="top-coupon-box">
        <p class="top-coupon-success">恭喜您，领取成功！</p>
        <p class="top-coupon-tips">现在关注{{Brand_Name}}公众号，新人可获取更多优惠</p>
      </div>
      <ul class="coupon-list">
        <li class="coupon-item radius-box">
          <div class="coupon-info">
            <div class="coupon-price-box">
              <p class="coupon-price">
                ¥ <em v-if="couponData.amountType === 1 ">{{couponData.minAmount + ' ~ ' + couponData.maxAmount}}</em>
                <em v-else>{{couponData.amount}}</em>
              </p>
              <p>{{couponData.useAmountLimit ? `满${couponData.useAmount}元可用` : '无门槛使用'}}</p>
            </div>
            <div class="coupon-detail">
              <h2 class="coupon-name">{{couponData.name}}</h2>
              <div class="coupon-time">
                <p>{{couponData.activeTime | formatDate('date')}} ~ {{couponData.invalidTime | formatDate('date')}}</p>
                <p>
                  <span v-if="couponData.weekLimit">{{couponData.weekList | weekText}}</span>
                  <span v-if="!couponData.weekLimit && couponData.startupTimeLimit">每天</span>
                  <span>{{ couponData.startupTimeLimit ? couponData.startupBeginTime + ' - ' + couponData.startupEndTime : '不限时段'}} 使用</span>
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="coupon-btn-box">
        <a class="btn-coupon-share" @click="showShare = true">分享给小伙伴</a>
        <router-link class="btn-coupon-detail" :to="{name: 'myCoupon'}">立即使用</router-link>
      </div>
    </div>
    <p class="intro-tit" v-if="couponData.remark">使用说明</p>
    <p class="intro-text" v-if="couponData.remark">{{couponData.remark}}</p>

    <share-modal :show="showShare" share-text="与好友分享这份喜悦吧" @closeShare="showShare = false"></share-modal>
  </div>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ShareModal from 'appComponents/shareModal/index.vue'

  export default {
    components: {
      MainBox,
      ShareModal
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        firmLogo: appStorage.get('firmLogo'),
        Brand_Name: appStorage.get('Brand_Name'),
        showShare: false,
        couponId:'',
        myCouponId:'',
        couponData:{},
      }
    },
    mounted () {
      this.couponId = this.$route.query.couponId
      this.myCouponId = this.$route.query.myCouponId
      this.wxUserCouponFindById()
      interfaceApi.share({
        share: true,
        shareUrl: TOOL.shareURL + 'getCoupon' + '?couponId=' +　this.couponId,
        shareTitle: '您的好友分享了优惠券，再也不用为出行担心啦',
        shareDesc: this.Brand_Name + '出行，让出行从未如此便捷',
      });
    },
    methods: {
      /**
       * 查询优惠券详情
       */
      wxUserCouponFindById () {
        api.wxUserCouponFindById(this.myCouponId).then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.couponData = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

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
  .coupon-item{
    position: relative;
    margin-bottom: 30px;
    font-size:24px;
    color:#888;
    background: url("../../../assets/my/discount_2.png") repeat-y right top @bg-fff;
    background-size:16px 10px;
    .coupon-info{
      position: relative;
      display: flex;
      height:175px;
      padding:30px 160px 20px 0;
    }
    .coupon-price-box{
      white-space: nowrap;
      padding:0 20px 24px;
      text-align: center;
      border-right:1px dashed @bc-e5e5e5;
    }
    .coupon-price{
      margin-bottom:30px;
      font-size:28px;
      color: @fc-ff6600;
      em{
        font-size:40px;
      }
    }
    &.no-use{
      .coupon-price,
      .coupon-name{
        color: @fc-888;
      }
    }
    .coupon-detail{
      position: relative;
      flex:1;
      padding:0 20px 0 30px;
      font-size:20px;
    }
    .coupon-name{
      width: 300px;
      margin-bottom:40px;
      line-height:1.4;
      font-size:32px;
      color:#121212;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .coupon-time{
      position: absolute;
      bottom: 0;
      left:30px;
      line-height: 1.6;
      p{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 300px;
      }
    }
    .coupon-use{
      line-height:60px;
      text-align:center;
    }
    .coupon-status{
      position: absolute;
      right:20px;
      bottom:24px;
      .button-size{
        width:120px;
        height:50px;
        line-height:50px;
        font-size:24px;
      }
      &.coupon-used{
        top:0;
        bottom:0;
        width:120px;
        background:url("../../../assets/my/used.png") no-repeat right center;
        background-size:100px 100px;
      }
      .coupon-percent{
        position: relative;
        width:120px;
        height:20px;
        margin-bottom:15px;
        border-radius:10px;
        background-color: @bg-ffe1cd;
        overflow:hidden;
        .percent{
          position: absolute;
          left:0;
          height:20px;
          border-radius:10px;
          transition: width 1s;
          background-color: @bg-ff6600;
        }
      }
      .coupon-percent-txt{
        text-align: center;
        margin-bottom:15px;
        color: @fc-ff6600;
      }
    }
  }
  .coupon-btn-box{
    display:flex;
    padding-top:96px;
    a{
      display:block;
      flex:1;
      height:80px;
      line-height:80px;
      text-align:center;
      font-size:32px;
      color:#ff6600;
      &.btn-coupon-share{
        margin-right:50px;
        background-color: #fff;
        color: #ff6600;
        border-radius:5PX;
      }
      &.btn-coupon-detail{
        border-radius:5PX;
        background-color: #fedd52;
        color: #af5733;
      }
    }
  }
</style>
