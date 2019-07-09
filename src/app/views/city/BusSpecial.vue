
<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="inline-box" @click="jumpToAppointStation('onStation')">
      <label>上车地点</label>
      <span v-text="onAddress"></span>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t" @click="jumpToAppointStation('offStation')">
      <label>下车地点</label>
      <span v-text="offAddress"></span>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box mar-b-20 line line-x">
      <label>出行时间</label>
      <input type="text" placeholder="请选择出行时间" v-mobidatetime:startConfig="startTime" readonly/>
      <i class="icon-r-jt"></i>
    </div>

    <set-contact
      v-model="orderData.contactTelephone"
      @input="orderData.contactTelephone = arguments[0]"
      :page-router="pageRouter"
      :save-form="saveForm">
    </set-contact>

    <car-type-select
      v-model="avaibleCar"
      :product-id="productId"
      :product-type="orderData.productTypeLevelOne"
      :from-page-router="pageRouter"
      :save-form="saveForm">
    </car-type-select>

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

    <ticket-notice
      refund-notice-type="refundNotice2"
      :custom-contents="cityProductOne.customContents">
    </ticket-notice>

    <div slot="footer">
      <score-rule-dialog
        :show-score-dialog="showScoreDialog"
        :score-rule="scoreRule"
        @hideScoreDialogHandle="hideScoreDialogHandle">
      </score-rule-dialog>

      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPassword"></pay-dialog>

      <div class="abs-bottom-box">
        <div class="buy-left" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span v-if="showPrice">{{totalPrice | formatPrice}}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input class="button button-primary" type="button" :disabled="disableBtn" @click="orderCreateHandel('special')" value="立即叫车"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">行程费用</span>
            <span>{{price | formatPrice('yuan')}}</span>
          </p>
          <p v-if="cityProductOne.serviceFee">
            <span class="price-d-tit">服务费用</span>
            <span>{{cityProductOne.serviceFee | formatPrice('yuan')}}</span>
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
  import Mobidatetime from 'directives/mobiDateTime'
  import MainBox from 'components/mainBox/index'
  import Activity from 'appComponents/orderCreateService/activity'
  import Coupon from 'appComponents/orderCreateService/coupon'
  import Score from 'appComponents/orderCreateService/score'
  import ScoreRuleDialog from 'appComponents/dialog/scoreRuleDialog'
  import PayDialog from 'appComponents/dialog/payDialog'
  import SetContact from 'appComponents/setContact/index'
  import CarTypeSelect from 'appComponents/carTypeSelect/index'
  import TicketNotice from 'components/ticketNotice/index'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  const now = new Date()

  export default {
    directives: {
      Mobidatetime,
    },
    components: {
      MainBox,
      Activity,
      Coupon,
      Score,
      ScoreRuleDialog,
      PayDialog,
      SetContact,
      CarTypeSelect,
      TicketNotice,
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        productId: '',
        cityProductOne: {
          customContents:[]
        },
        orderData: {
          formId: TOOL.getTimeStamp(),
          productId: '',
          productTypeLevelOne: '',
          startTime: '',
          carType: '', //汽车所属级别：0.5座经济轿车、1.5座高级轿车、2.7座商务、3.经济SUV、4.高级SUV、5.小巴、6.中巴、7.大巴
          totalSeats:'', //车辆座位数
          onStation: {},
          offStation: {},
          contactName: '',
          contactTelephone: '',
          needInvoice: false,
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
        avaibleCar: '',
        startTime:'',
        startConfig: TOOL.getDateTimeConfig(),
        startPlace: '',
        endPlace: '',
        onAddress: TOOL.placeHolder.onStation,
        offAddress: TOOL.placeHolder.offStation,
        passengerIdCard: '', //旅客id
        disableBtn: true,
        price: 0,
        priceMore: false,
        showPriceDetail: false,
      }
    },
    computed: {
      totalPrice () {
        if(this.price > 0){
          this.priceMore = true

          if(this.orderData.integralExId){
            this.integralPrice = this.orderData.integralPrice * this.scoreRule.exchangeAmount / this.scoreRule.baseUseNum
          }else{
            this.integralPrice = 0
          }

          return this.price + this.cityProductOne.serviceFee - this.reducedAmount - this.orderCouponPrice - this.integralPrice
        }else{
          return this.price
        }
      }
    },
    watch: {
      'startTime' (newVal) {
        if(newVal && this.price){
          this.initActivityAndCoupon()
        }
      }
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.startPlace = this.$route.query.startPlace
      this.endPlace = this.$route.query.endPlace
      this.cityProductFindById()
    },
    methods: {

      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData
        localData.passengerIdCard = this.passengerIdCard
        localData.avaibleCar = this.avaibleCar
        localData.startTime = this.startTime
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 城际包车SKU查询
       */
      cityProductFindById () {
        api.cityProductFindById(this.productId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.cityProductOne = data.resultData;
            if(this.startPlace !== this.cityProductOne.aAddress.searchShowAddress) {
              let aTemp = Object.assign({}, this.cityProductOne.aAddress);
              let bTemp = Object.assign({}, this.cityProductOne.bAddress);
              this.cityProductOne.aAddress = bTemp;
              this.cityProductOne.bAddress = aTemp;
            }
            this.orderData.productId = this.productId
            this.orderData.productTypeLevelOne = this.cityProductOne.productTypeLevelOne
            this.startConfig = TOOL.getDateTimeConfig(this.cityProductOne.preOrderStartMinute, this.cityProductOne.preOrderEndMinute, this.cityProductOne.responseStartTime, this.cityProductOne.responseEndTime)

            this.getLocalData()
            this.sharePage()
            this.visitLog()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getLocalData () {
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))

          this.passengerIdCard = localData.passengerIdCard
          if(localData.avaibleCar){
            this.avaibleCar = localData.avaibleCar
            this.price = this.avaibleCar.price
            this.disableBtn = false
          }
          this.startTime = localData.startTime
          delete localData.passengerIdCard
          delete localData.avaibleCar
          delete localData.startTime

          this.orderData = localData
          this.orderData.carType = this.avaibleCar.carType
          this.orderData.totalSeats = this.avaibleCar.seats

          if (this.orderData.onStation.name) {
            this.onAddress = this.startPlace + ' ' + this.orderData.onStation.name
          }
          if (this.orderData.offStation.name) {
            this.offAddress = this.endPlace + ' ' + this.orderData.offStation.name
          }
        } else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.orderData.contactTelephone = usrInfo.phone
        }
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.price
        this.passengerNum = 1
        this.ticketTotalAmount = this.price
        this.activityAndCounponParam = {
          type: 'productId',
          id: this.productId,
          productId: this.productId,
          productTypeLevelOne: this.cityProductOne.productTypeLevelOne,
          productTypeLevelTwo: this.cityProductOne.productTypeLevelTwo,
          startupTime: this.startTime
        }
        if(this.cityProductOne.storeId && this.cityProductOne.storeId !== appStorage.get('StoreId')){
          this.showPrice = true
          return
        }
        this.getOptimalActivity()
      },

      /**
       * 跳转优惠券选择页面
       */
      jumpToSelectCoupon () {
        this.saveForm()
        let startupTime = TOOL.newGetDate({date: this.startTime, type: 'holeDate'})
        this.$router.push({
          name: 'selectCoupon',
          query: {
            pageRouter: this.pageRouter,
            productId: this.productId,
            productTypeLevelOne: this.cityProductOne.productTypeLevelOne,
            startupTime: startupTime,
            passengerNum: 1,
            ticketAmount: this.ticketAmount,
            ticketTotalAmount: this.ticketTotalAmount,
            activityId: this.orderData.discountInfo.activityId,
            price: this.ticketTotalAmount - this.reducedAmount
          }
        })
      },

      sharePage () {
        if(this.cityProductOne.shareThemes && this.cityProductOne.shareThemes.length){
          let max = this.cityProductOne.shareThemes.length - 1
          let random = Math.round(Math.random() * max);
          let shareTheme = this.cityProductOne.shareThemes[random]
          interfaceApi.share({
            share: true,
            shareUrl: location.href,
            shareTitle: shareTheme.title,
            shareDesc: shareTheme.description,
            shareImgUrl: shareTheme.image
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
          productId: this.productId,
          productTypeLevelOne: this.cityProductOne.productTypeLevelOne,
          productTypeLevelTwo: this.cityProductOne.productTypeLevelTwo
        })
      },

      /**
       * 跳转上下车点选择
       * @param dataKey 站点类型：onStation, offStation
       */
      jumpToAppointStation (dataKey) {
        this.saveForm()
        let query = {
          fromPage: this.pageRouter,
          dataKey: dataKey,
          productId: this.productId,
          productTypeLevelOne: this.cityProductOne.productTypeLevelOne,
        }
        
        if (dataKey === 'onStation') {
          query.searchCity = this.cityProductOne.aAddress.city
          query.searchAddress = this.cityProductOne.aAddress.detailAddress
        } else {
          query.searchCity = this.cityProductOne.bAddress.city
          query.searchAddress = this.cityProductOne.bAddress.detailAddress
        }
        this.$router.push({
          name: 'appointStation',
          query: query
        })
      },

    }
  }
</script>
