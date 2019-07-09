<template>
  <div class="app-page">
    <loading :show="showLoading" position="absolute" :text="loadingText"></loading>
    <follow-us v-if="isShowFollowUs"></follow-us>
    <router-view></router-view>

    <x-dialog :show="showCouponDialog" :hide-on-blur="true" @on-hide="showCouponDialog = false" class="new-user-coupon-dialog">
      <div class="new-user-coupon">
        <div class="bg-1"></div>
        <div class="bg-2"></div>
        <h2 class="new-title"></h2>
        <p class="new-tips">恭喜您获得我们的新人礼包</p>
        <ul class="coupon-list" v-if="couponDatas.wxUserCouponList && couponDatas.wxUserCouponList.length">
          <li class="coupon-item radius-box-8" v-for="couponData in couponDatas.wxUserCouponList">
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
                  <p>{{couponData.weekList | weekText}} {{ couponData.weekLimit ? couponData.startupBeginTime + ' - ' + couponData.startupEndTime : '不限时段'}}使用</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="new-user-integral radius-box-8">
          <p class="txt">获得积分</p>
          <p class="integral">{{couponDatas.integral}}</p>
        </div>
        <a class="button button-yellow-lighter" @click="jumpToMyCoupon">立即使用</a>
      </div>
    </x-dialog>
  
    <div class="dialog-demo" v-show="showCarpoolPriceDialog">
      <div class="company-quote" v-if="carpoolPriceDatas.tripType === 1">
        <h1 class="company-quote-tit">费用明细</h1>
        <p class="price-total">
          <em>{{(carpoolPriceDatas.carpoolPrice - (carpoolPriceDatas.carpoolDiscount ? carpoolPriceDatas.carpoolDiscount.discountAmount : 0) + carpoolPriceDatas.serviceFee) | formatPrice('normal')}}</em>
          <i> 元</i>
        </p>
        <div class="company-quote-table">
          <div class="company-text mar-t-10">
            <p>拼车费用 <span v-if="carpoolPriceDatas.passengerNum">({{carpoolPriceDatas.passengerNum}}人)</span></p>
            <p>{{carpoolPriceDatas.carpoolPrice | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10">
            <p>服务费用</p>
            <p>{{carpoolPriceDatas.serviceFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10" v-if="carpoolPriceDatas.carpoolDiscount && carpoolPriceDatas.carpoolDiscount.activityAmount">
            <p>优惠活动抵扣</p>
            <p>- {{carpoolPriceDatas.carpoolDiscount.activityAmount | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10" v-if="carpoolPriceDatas.carpoolDiscount && carpoolPriceDatas.carpoolDiscount.couponAmount">
            <p>优惠券抵扣</p>
            <p>- {{carpoolPriceDatas.carpoolDiscount.couponAmount | formatPrice('normal')}}元</p>
          </div>
        </div>
      </div>
      <div class="company-quote" v-if="carpoolPriceDatas.tripType === 2">
        <h1 class="company-quote-tit">费用明细</h1>
        <p class="price-total">
          <em>{{(carpoolPriceDatas.charterePrice - (carpoolPriceDatas.charterDiscount ? carpoolPriceDatas.charterDiscount.discountAmount : 0) + carpoolPriceDatas.serviceFee)  | formatPrice('normal')}}</em>
          <i> 元</i>
        </p>
        <div class="company-quote-table">
          <div class="company-text mar-t-10">
            <p>包车费用</p>
            <p>{{carpoolPriceDatas.charterePrice | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10">
            <p>服务费用</p>
            <p>{{carpoolPriceDatas.serviceFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10" v-if="carpoolPriceDatas.charterDiscount && carpoolPriceDatas.charterDiscount.activityAmount">
            <p>优惠活动抵扣</p>
            <p>- {{carpoolPriceDatas.charterDiscount.activityAmount | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10" v-if="carpoolPriceDatas.charterDiscount && carpoolPriceDatas.charterDiscount.couponAmount">
            <p>优惠券抵扣</p>
            <p>- {{carpoolPriceDatas.charterDiscount.couponAmount | formatPrice('normal')}}元</p>
          </div>
        </div>
      </div>
      <div class="close-icon" @click="closeCarpoolPrice"></div>
    </div>
   
    <fix-market v-if="isShowMarketSetting"></fix-market>
    <share-url :shareUrl="shareData.shareUrl"
               :showModal="isShowShareUrl"
               :shareProduct="shareProduct"
               @closeModal="closeModal">
    </share-url>
  </div>
</template>

<script>
  import { XDialog } from 'vux'
  import Loading from 'components/loading/index'
  import FollowUs from 'components/followUs/index'
  import FixMarket from 'components/fixMarket/index'
  import ShareUrl from 'appComponents/marketShareUrl/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      Loading,
      XDialog,
      FollowUs,
      FixMarket,
      ShareUrl,
    },
    data () {
      return {
        productList: [],
        showFooter: false,
        shareData: {},
        shareProduct: [],
      }
    },
    computed: {
      ...mapState({
        showLoading: state => state.loading.showLoading,
        loadingText: state => state.loading.text,
        showCouponDialog: state => state.couponDialog.showCouponDialog,
        couponDatas: state => state.couponDialog.couponDatas,
        showCarpoolPriceDialog: state => state.carpoolPriceDialog.showCarpoolPriceDialog,
        carpoolPriceDatas: state => state.carpoolPriceDialog.carpoolPriceDatas,
        isShowFollowUs: state => state.followUs.showFollowUs,
        isShowMarketSetting: state => state.marketSetting.showFixMarket,
        isShowShareUrl: state => state.marketSetting.showShareUrl,
        marketSettingData: state => state.marketSetting.marketSettingData,
      }),
    },
    mounted () {
      this.userGetUserInfo()
    },
    methods: {
  
      closeCarpoolPrice () {
        this.$store.commit('UPDATE_CARPOOLPRICE_DIALOG', false)
      },
      
      /**
       * 如用户已经注册，缓存用户的基本信息
       * 注：浏览器、app、微信修改用户信息同步
       */
      userGetUserInfo () {
        api.userGetUserInfo().then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode === '0') {
            appStorage.set('userInfo', JSON.stringify(result.resultData))
          } else {
            this.$store.dispatch('showError', result.resultMsg)
          }
        })
      },

      jumpToMyCoupon () {
        if(this.couponDatas.wxUserCouponList && this.couponDatas.wxUserCouponList.length){
          this.$router.push({
            name: 'myCoupon'
          })
        }else{
          this.$router.push({
            name: 'myScore'
          })
        }
        this.$store.commit('UPDATE_DIALOG', false)
      },
  
      marketProShareUrl(proData) {
        this.shareProduct = [];
        api.marketProShareUrl({
          productTypeLevelTwo: proData.productTypeLevelTwo
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.shareData = data.resultData;
            this.shareProduct.push({
              productTypeLevelOne: proData.productTypeLevelOne,
              productTypeLevelTwo: proData.productTypeLevelTwo,
              commissionRate: proData.commissionRate,
            });
            this.showFooter = true;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      closeModal() {
        this.$store.commit('UPDATE_SHAREURL', false)
      }
    }
  }
</script>
<style lang="less">
  @import '../styles/reset.less';
  @import '../styles/form.less';
  @import '../styles/button.less';
  @import '../styles/layout.less';
  @import '../styles/vux.less';
  @import '../styles/map.less';
  @import '../styles/index.less';
  @import '../styles/work.less';
  @import '../styles/my.less';
  @import '../styles/charter.less';
  @import '../styles/ticket.less';
  @import '../styles/common.less';
  @import '../styles/car.less';
  @import '../styles/sight.less';
</style>
<style lang="less" scoped>
  .dialog-demo {
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1000;
    -webkit-transform: scale3d(1, 1, 1);
  }
  
  .close-icon {
    position: fixed;
    bottom: 30px;
    left: 50%;
    width: 95px;
    height: 95px;
    background: url("../assets/charter/close.png") no-repeat;
    background-size: 91px 91px;
    margin-left: -45px;
    z-index: 2000;
  }
  
  .company-quote {
    padding: 20px 30px;
    overflow: hidden;
    margin-top: 150px;
  }
  
  .company-quote-tit {
    display: block;
    height: 96px;
    line-height: 96px;
    text-align: center;
    color: #888;
    font-size: 36px;
  }
  
  .price-total{
    margin:80px 0 130px;
    text-align: center;
    font-size:70px;
    color:#4c4c4c;
  i{
    position: relative;
    top:-2px;
    font-size: 36px;
  }
  }
  
  .company-quote-table {
    padding: 0 40px;
    font-size: 28px;
    color: #4C4C4C;
  }
  
  .company-text {
    font-size:28px;
    color:#888;
    line-height: 50px;
    overflow: hidden;
  }
  
  .company-text p {
    float: left;
  }
  
  .company-text p:last-child {
    float: right;
  }
  
  .company-text.mar-t-10 {
    margin-top: 10px;
  }
</style>