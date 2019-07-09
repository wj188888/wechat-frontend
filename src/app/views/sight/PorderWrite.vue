<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="white-back" style="padding-bottom:0;">
      <div class="sight-desc">
        <div class="theme" v-text="ticketInfo.productTheme">摄影之旅丹巴+新都桥+稻城7日六晚跟团游向导+央视达人策划+16人Vip纯玩团
        </div>
        <div class="time-pany clearfix">
          <i class="pany-icon"></i>
          <span style="margin-right:20px;" v-text="ticketInfo.firmName"></span>
        </div>
      </div>
    </div>
    <div class="form-box" style="margin-top:1rem;">
      <div class="input-inline line line-x-b" @click="jumpToSkuSelect">
        <label class="num_price_box">{{ date | formatDate('monthDay') }}</label>
        <span class="f-s-28 c-f-888 mar-l-20 sig-date-seats" v-if="availableSeats && seats != 0x7FFFFFFF">剩余{{availableSeats}}座</span>
        <span class="sig-date-price" v-if="orderData.price">{{ orderData.price | formatPrice }}</span>
        <i class="icon-r-jt"></i>
      </div>
    </div>

    <passenger-add
            :carry-kid-setting="carryKidSetting"
            :max-buy-number="maxBuyNumber"
            :order="orderData"
            @jumpToPassenger="jumpToPassenger"
            @deletPassenger="deletPassenger"
            @checkCarryKid="checkCarryKid">
    </passenger-add>

    <passenger-add
            type="children"
            :carry-kid-setting="carryKidSetting"
            :max-buy-number="maxBuyNumber"
            :order="orderData"
            @jumpToPassenger="jumpToPassenger"
            @deletPassenger="deletPassenger">
    </passenger-add>

    <div class="form-box mar-b-0 mar-t-20">
      <div class="input-inline line line-x-t">
        <label>手机号码</label>
        <input type="number" v-model="orderData.contactTelephone" placeholder="必填，接收车票信息" maxlength="11"/>
      </div>
    </div>

    <insure-select
      :insure-type-id="orderData.insureTypeId"
      :total-prem="orderData.totalPrem"
      :passenger-num="passengerNum"
      :ticket-amount="ticketAmount"
      :save-form="saveForm"
      :from-page="pageRouter">
    </insure-select>

    <activity :optimal-activity="optimalActivity"
              :activity-list="activityList"
              :use-activity="orderData.useActivity"
              @change="checkActivity"
              @changeActivity="changeActivity">
    </activity>

    <coupon :order-coupon-price="orderCouponPrice" @jumpToSelectCoupon="jumpToSelectCoupon"></coupon>

    <score :score-rule="scoreRule"
           :user-coupon-id="orderData.discountInfo.userCouponId"
           :activity-id="orderData.discountInfo.activityId"
           :use-score="orderData.useScore"
           :sale-price="salePrice"
           :integral-price="orderData.integralPrice"
           @showScoreDialogHandle="showScoreDialogHandle"
           @change="checkScore"
           @changeScore="changeScore">
    </score>

    <div slot="footer">

      <score-rule-dialog
        :show-score-dialog="showScoreDialog"
        :score-rule="scoreRule"
        @hideScoreDialogHandle="hideScoreDialogHandle">
      </score-rule-dialog>

      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPassword"></pay-dialog>

      <div class="abs-bottom-box">
        <div class="buy-left clearfix" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span v-if="showPrice">{{ totalPrice | formatPrice }}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input type="button" :disabled="disableBtn" class="button button-primary" value="立即预定" @click="orderCreateHandel('tour')"/>
        </div>
      </div>

      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">旅客人数</span>
            <span>{{passengerNum}}人</span>
          </p>
          <p v-if="orderData.insureTypeId && passengerNum">
            <span class="price-d-tit">保险费用</span>
            <span>
              {{orderData.totalPrem | formatPrice}} × {{passengerNum}}人
            </span>
          </p>
          <p v-if="adultNum">
            <span class="price-d-tit">成人票价</span>
            <span>
            {{orderData.price | formatPrice('yuan')}} × {{adultNum}}人
          </span>
          </p>
          <p v-if="childrenNum">
            <span class="price-d-tit">儿童票价</span>
            <span>
            {{orderData.childPrice | formatPrice('yuan')}} × {{childrenNum}}人
          </span>
          </p>
          <p v-if="ticketInfo.serviceFee > 0">
            <span class="price-d-tit">服务费用</span>
            <span>
            {{ticketInfo.serviceFee | formatPrice('yuan')}} × {{passengerNum}}人
          </span>
          </p>
          <p v-if="reducedAmount > 0">
            <span class="price-d-tit">优惠活动</span>
            <span class="align-yuan">
              - {{reducedAmount | formatPrice}}
            </span>
          </p>
          <p v-if="orderCouponPrice > 0">
            <span class="price-d-tit">优惠券</span>
            <span class="align-yuan">
              - {{orderCouponPrice | formatPrice}}
            </span>
          </p>
          <p v-if="integralPrice > 0">
            <span class="price-d-tit">积分抵现</span>
            <span class="align-yuan">
              - {{integralPrice | formatPrice}}
            </span>
          </p>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import PassengerAdd from 'appComponents/orderCreateService/passengerAdd'
  import InsureSelect from 'appComponents/orderCreateService/insureSelect'
  import Activity from 'appComponents/orderCreateService/activity'
  import Coupon from 'appComponents/orderCreateService/coupon'
  import Score from 'appComponents/orderCreateService/score'
  import ScoreRuleDialog from 'appComponents/dialog/scoreRuleDialog'
  import PayDialog from 'appComponents/dialog/payDialog'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      PassengerAdd,
      InsureSelect,
      Activity,
      Coupon,
      Score,
      ScoreRuleDialog,
      PayDialog,
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        orderData: {
          formId: TOOL.getTimeStamp(),
          skuId: '',
          productId: '',
          productTypeLevelOne: '',
          passengers: [],
          children: [],//儿童信息
          contactName: '',
          contactTelephone: '',
          insureTypeId: '', //保险id
          totalPrem: 0, //保险价格
          needInvoice: false,
          startupTime: '',
          price: '',
          childPrice: '',
          supplyInvoice: '',
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
          useScore: false,
          integralExId: '',
          integralType: 1, // 积分兑换类型 0：兑换产品，1：积分抵现
          integralPrice: 0, //抵用积分
        },
        carryKidSetting: {
          canCarryKid: false
        },
        workSku: '',
        ticketInfo: '',
        priceMore: false, //是否显示订单详情
        showPriceDetail: false,
        datePrice: '',
        storeId: '',
        flightId: '',
        disableBtn: false,
        date: '',
        availableSeats:0,
        seats:0
      }
    },
    computed: {
      totalPrice () {
        this.adultNum = this.orderData.passengers.length
        this.childrenNum = this.orderData.children.length
        this.passengerNum = this.adultNum + this.childrenNum

        if (this.passengerNum) {
          this.priceMore = true
          let childPrice = this.orderData.childPrice * this.childrenNum
          let passengerPrice = this.orderData.price * this.adultNum
          let insureprice = (this.orderData.totalPrem || 0) * this.passengerNum
          let servicePrice = this.ticketInfo.serviceFee * this.passengerNum

          if(this.orderData.integralExId){
            this.integralPrice = this.orderData.integralPrice * this.scoreRule.exchangeAmount / this.scoreRule.baseUseNum
          }else{
            this.integralPrice = 0
          }

          return childPrice + passengerPrice + (+insureprice) + servicePrice - this.reducedAmount - this.orderCouponPrice - this.integralPrice
        } else {
          this.priceMore = false
          return 0
        }

      },
      maxBuyNumber (){
          if(this.availableSeats > this.ticketInfo.maxBuyNumber){
              return this.ticketInfo.maxBuyNumber;
          }else{
              return this.availableSeats;
          }
      }
    },
    mounted(){
      this.orderData.productId = this.$route.query.id;
      if (appStorage.get(this.pageRouter)) {
        let localData = JSON.parse(appStorage.get(this.pageRouter));
        this.orderData.passengers = localData.passengers || [];
        this.orderData.children = localData.children || [];
        this.orderData.needInvoice = localData.needInvoice;
        this.orderData.price = localData.price || '';
        this.orderData.childPrice = localData.childPrice || 0;
        this.availableSeats = localData.availableSeats;
        this.seats = localData.seats;
        if (localData.startupTime) {
          this.date = localData.startupTime

        }

        if (localData.id) {
          this.orderData.skuId = localData.id
        } else {
          this.orderData.skuId = localData.skuId
        }

        if (appStorage.get('X-Auth-Token') && !localData.contactTelephone) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.orderData.contactTelephone = usrInfo.phone
        } else {
          this.orderData.contactTelephone = localData.contactTelephone || ''
        }
      }else if (appStorage.get('X-Auth-Token')) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.orderData.contactTelephone = usrInfo.phone
      }
      this.findDetail()
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let saveData = this.orderData;
        let localData = JSON.parse(appStorage.get(this.pageRouter));
        saveData.startupTime = this.date;
        let newData = Object.assign(localData, saveData);
        appStorage.set(this.pageRouter, JSON.stringify(newData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 查找产品详情
       */
      findDetail () {
        api.sightProductDetail({
          id: this.orderData.productId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.ticketInfo = data.resultData
            this.carryKidSetting = data.resultData.carryKidSetting
            this.orderData.productTypeLevelOne = data.resultData.productTypeLevelOne
            this.sharePage()
            this.visitLog()
            this.initActivityAndCoupon()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.orderData.price || 0;
        this.adultNum = this.orderData.passengers.length
        this.childrenNum = this.orderData.children.length
        this.ticketTotalAmount = this.orderData.price * this.adultNum + this.orderData.childPrice * this.childrenNum;
        this.activityAndCounponParam = {
          type: 'skuId',
          id: this.orderData.skuId,
          productId: this.ticketInfo.productId,
          productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
          productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
          startupTime: this.date
        };
        this.insurancePlanTypeFind(this.ticketAmount);
        if(this.ticketInfo.storeId && this.ticketInfo.storeId !== appStorage.get('StoreId')){
          this.showPrice = true;
          return
        }
        this.getOptimalActivity()
      },

      /**
       * 跳转优惠券选择页面
       */
      jumpToSelectCoupon () {
        this.saveForm()
        this.$router.push({
          name: 'selectCoupon',
          query: {
            pageRouter: this.pageRouter,
            skuId: this.orderData.skuId,
            productTypeLevelOne: this.orderData.productTypeLevelOne,
            startupTime: this.date,
            passengerNum: this.adultNum + this.childrenNum,
            ticketAmount: this.ticketAmount,
            ticketTotalAmount: this.ticketTotalAmount,
            activityId: this.orderData.discountInfo.activityId,
            price: this.ticketTotalAmount - this.reducedAmount
          }
        })
      },

      sharePage () {
        if(this.ticketInfo.shareTheme){
          interfaceApi.share({
            share: true,
            shareUrl: location.href,
            shareTitle: this.ticketInfo.shareTheme.title,
            shareDesc: this.ticketInfo.shareTheme.description,
            shareImgUrl: this.ticketInfo.shareTheme.image
          });
        }else{
          interfaceApi.share({
            share: true,
            shareUrl: window.location.href
          });
        }
      },

      visitLog () {
        TOOL.saveVisitLogs({
          url: this.$route.name,
          skuId: this.orderData.skuId,
          productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
          productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo
        })
      },

      /**
       * 跳转到日期界面选择车票
       */
      jumpToSkuSelect () {
        this.saveForm()
        let startTime = TOOL.newGetDate({date: new Date(), type: 'date'})
        let endTime = TOOL.newGetDate({date: new Date(), type: 'futureTwoMonth'})
        this.$router.push({
          name: 'skuSelect',
          query: {
            pageRouter: this.pageRouter,
            flightId: this.orderData.productId,
            startDate: startTime,
            endDate: endTime
          }
        })
      },

      /**
       * 跳转到乘客列表新增乘客
       */
      jumpToPassenger (dataKey) {
        this.saveForm()
        this.$router.push({
          name: 'passengerList',
          query: {
            page: this.pageRouter,
            dataKey: dataKey,
            maxBuyNumber: this.maxBuyNumber
          }
        })
      },

      /**
       *  删除联系人
       */
      deletPassenger (passenger, dataKey) {
        for (let i in this.orderData[dataKey]) {
          if (passenger.idCard === this.orderData[dataKey][i].idCard) {
            this.orderData[dataKey].splice(i, 1)
          }
        }
        this.initActivityAndCoupon()
      },

      /**
       * 携童设置
       */
      checkCarryKid (index, passengers) {
        let carryKidNum = 0;
        for (let i in this.orderData.passengers) {
          if (this.orderData.passengers[i].carryKid) {
            carryKidNum++
          }
        }
        if (passengers.carryKid || carryKidNum < this.carryKidSetting.maxNumber) {
          passengers.carryKid = !passengers.carryKid
          this.$set(this.orderData.passengers, index, passengers)
        } else {
          this.$store.dispatch('showError', '对不起，没有免费携童名额了，请为儿童购买车票');
        }
      },

    }
  }
</script>
<style type="less" scoped>
  .num_price_box{
    width: 6rem;
  }
  .sig-date-seats{
    display: block;
    height: 5rem;
    line-height: 5rem;
  }
</style>
