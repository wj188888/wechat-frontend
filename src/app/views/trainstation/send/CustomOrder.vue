<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="inline-box" @click="jumpToAppointStation('onStation')">
      <label>上车地点</label>
      <span v-text="onAddress"></span>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t">
      <label>下车地点</label>
      <span v-text="offAddress"></span>
    </div>
    <div class="inline-box mar-b-20 line line-x">
      <label>出行时间</label>
      <input type="text" placeholder="请选择出行时间" v-mobidatetime:startConfig="orderData.startTime" readonly/>
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
      :custom-contents="productOne.customContents">
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
          <input type="button" class="button button-primary" :disabled="disableBtn" @click="orderCreateHandel('special')" value="立即叫车"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">行程费用</span>
            <span>{{price | formatPrice('yuan')}}</span>
          </p>
          <p v-if="productOne.serviceFee">
            <span class="price-d-tit">服务费用</span>
            <span>{{productOne.serviceFee | formatPrice('yuan')}}</span>
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
  import TicketNotice from 'components/ticketNotice/index'
  import CarTypeSelect from 'appComponents/carTypeSelect/index'
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
      TicketNotice,
      CarTypeSelect
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        productId:'',
        productOne: {
          customContents:[],
        },
        orderData: {
          formId: TOOL.getTimeStamp(),
          productId: '',
          productTypeLevelOne: '',
          shuttleType: 1, //接送站类型 0：接站，1：送站
          startTime: '',
          carType: '', //汽车所属级别：0.5座经济轿车、1.5座高级轿车、2.7座商务、3.经济SUV、4.高级SUV、5.小巴、6.中巴、7.大巴
          totalSeats:'', //车辆座位数
          onStation: '',
          offStation: '',
          contactName: '',
          contactTelephone: '',
          needInvoice: '',
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
        startConfig: TOOL.getDateTimeConfig(),
        onAddress: TOOL.placeHolder.onStation,
        offAddress: TOOL.placeHolder.offStation,
        passengerIdCard: '', //旅客id
        showDetails: {
          notice: false, //订票须知显示隐藏
          refundNotice: false, //退票须知显示隐藏
        },
        refundNotice: TOOL.refundNotice1, //退票须知
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
          return this.price + this.productOne.serviceFee && this.productOne.serviceFee > 0
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
    mounted(){
      this.productId = this.$route.query.productId
      this.orderData.formId = TOOL.getTimeStamp()
      this.trainStationProductFindById()
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData;
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
       * 接站专车SKU查询
       */
      trainStationProductFindById () {
        api.trainStationProductFindById(this.productId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.productOne = data.resultData
            this.orderData.productId = this.productId
            this.orderData.productTypeLevelOne = this.productOne.productTypeLevelOne
            this.orderData.offStation = {
              longitude: this.productOne.aAddress.longitude,
              latitude: this.productOne.aAddress.latitude,
              name: this.productOne.aAddress.detailAddress,
              rank: 1
            }
            this.offAddress = this.orderData.offStation.name

            this.startConfig = TOOL.getDateTimeConfig(this.productOne.preOrderStartMinute, this.productOne.preOrderEndMinute, this.productOne.responseStartTime, this.productOne.responseEndTime)

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

          delete localData.passengerIdCard
          delete localData.avaibleCar

          this.orderData = localData
          if (this.orderData.onStation.name) {
            this.onAddress = this.productOne.bAddress.city + ' ' + this.orderData.onStation.name
          }
          this.orderData.carType = this.avaibleCar.carType
          this.orderData.totalSeats = this.avaibleCar.seats

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
          productTypeLevelOne: this.productOne.productTypeLevelOne,
          productTypeLevelTwo: this.productOne.productTypeLevelTwo,
          startupTime: this.startTime
        }
        if(this.productOne.storeId && this.productOne.storeId !== appStorage.get('StoreId')){
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
            productTypeLevelOne: this.orderData.productTypeLevelOne,
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
        if(this.productOne.shareThemes && this.productOne.shareThemes.length){
          let max = this.productOne.shareThemes.length - 1
          let random = Math.round(Math.random() * max);
          let shareTheme = this.productOne.shareThemes[random]
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
          productTypeLevelOne: this.productOne.productTypeLevelOne,
          productTypeLevelTwo: this.productOne.productTypeLevelTwo
        })
      },

      /**
       * 根据id查找接站专线
       */
      showErrorTips () {
        if (!this.orderData.startTime) {
          this.$store.dispatch('showError', '请先选择出行时间');
          return
        }

        if (!this.showSelectCar) {
          this.$store.dispatch('showError', '暂无可用车辆，请更换出行时间');
        }
      },

      /**
       * 跳转上下车点选择
       * @param dataKey 站点类型：onStation, offStation
       */
      jumpToAppointStation (dataKey) {
        this.saveForm()
        this.$router.push({
          name: 'appointStation',
          query: {
            fromPage: this.pageRouter,
            dataKey: dataKey,
            productId: this.productId,
            productTypeLevelOne: this.productOne.productTypeLevelOne,
            searchCity: this.productOne.bAddress.city,
            searchAddress: this.productOne.bAddress.searchShowAddress
          }
        })
      },


    }
  }
</script>
