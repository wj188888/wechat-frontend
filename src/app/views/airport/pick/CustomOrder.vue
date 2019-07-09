<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="flight-number line line-x-b" v-if="!orderData.variflight" @click="jumpToFlightChoose">
      <div class="number">航班号</div>
      <div class="choose">
        <p class="title">选择航班号</p>
        <p class="tip">不清楚航班号&nbsp;&nbsp;可根据起始地进行搜索</p>
      </div>
    </div>

    <div class="line line line-x-b" v-if="orderData.variflight" @click="jumpToFlightChoose">
      <div class="flight-number mar-b-0">
        <div class="number f-black">航班号</div>
        <div class="choose-result clearfix">
          <p class="top-word" v-text="orderData.variflight.airline">FM9265</p>
          <p class="bot-word f-black">
            <span>预计到达</span>
            <span>{{ variflightDate | formatDate('flightTime') }}</span>
          </p>
        </div>
      </div>
      <div class="flight-number">
        <div class="number f-black">预计时间</div>
        <div class="choose-result clearfix">
          <div class="air-place">
            <div class="place-left">
              <p class="top-word" v-text="orderData.variflight.startPlace">上海</p>
              <p class="bot-word">
                <span class="pull-left">起飞</span>
                <span class="pull-right" v-text="orderData.variflight.takeoffTime"></span>
              </p>
            </div>
            <div class="border">
              <i class="right"></i>
            </div>
            <div class="place-right">
              <p class="top-word" v-text="orderData.variflight.endPlace">成都</p>
              <p class="bot-word">
                <span class="pull-left">到达</span>
                <span class="pull-right" v-text="orderData.variflight.reachTime"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="inline-box">
      <label>上车地点</label>
      <span v-text="onAddress"></span>
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
      :custom-contents="airportProductOne.customContents">
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
          <input type="button" class="button button-primary" @click="orderCreateHandel('special')" :disabled="disableBtn" value="立即叫车"/>
        </div>
      </div>

      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">行程费用</span>
            <span>{{price | formatPrice('yuan')}}</span>
          </p>
          <p v-if="airportProductOne.serviceFee">
            <span class="price-d-tit">服务费用</span>
            <span>{{airportProductOne.serviceFee | formatPrice('yuan')}}</span>
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
    directives:{
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
        airportProductOne:{
          customContents:[],
        },
        orderData:{
          formId: TOOL.getTimeStamp(), //防重复提交字段
          productId:'',
          productTypeLevelOne:'',
          airportType: 0,
          startTime:'',
          carType: '', //汽车所属级别：0.5座经济轿车、1.5座高级轿车、2.7座商务、3.经济SUV、4.高级SUV、5.小巴、6.中巴、7.大巴
          totalSeats:'', //车辆座位数
          variflight:'',
          onStation:'',
          offStation: '',
          contactName:'',
          contactTelephone:'',
          needInvoice:false,
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
        startPlace:'',
        endPlace:'',
        variflightDate:'',
        onAddress: TOOL.placeHolder.onStation,
        offAddress: TOOL.placeHolder.offStation,
        airportCode:'',
        passengerIdCard:'', //旅客id
        disableBtn:true,
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

          return this.price + this.airportProductOne.serviceFee - this.reducedAmount - this.orderCouponPrice - this.integralPrice
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
      this.startPlace = this.$route.query.startPlace
      this.endPlace = this.$route.query.endPlace
      this.airportCode = this.$route.query.airportCode
      this.airportProductFindById()
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData
        localData.passengerIdCard = this.passengerIdCard
        localData.carTypeId = this.carTypeId
        localData.avaibleCar = this.avaibleCar
        localData.startTime = this.startTime
        if(this.variflightDate){
          localData.variflightDate = this.variflightDate.split(' ')[0]
        }
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 机场包车SKU查询
       */
      airportProductFindById () {
        api.airportProductFindById(this.productId).then(res => {
          const data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.airportProductOne = data.resultData;
            this.orderData.productId = this.productId
            this.orderData.productTypeLevelOne = this.airportProductOne.productTypeLevelOne

            this.orderData.onStation = {
              longitude: this.airportProductOne.aAddress.longitude,
              latitude: this.airportProductOne.aAddress.latitude,
              name: this.airportProductOne.aAddress.detailAddress,
              rank:1
            }
            this.onAddress = this.orderData.onStation.name

            this.startConfig = TOOL.getDateTimeConfig(this.airportProductOne.preOrderStartMinute, this.airportProductOne.preOrderEndMinute, this.airportProductOne.responseStartTime, this.airportProductOne.responseEndTime)

            this.getLocalData()
            this.sharePage()
            this.visitLog()
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getLocalData () {
        if(appStorage.get(this.pageRouter)){
          let localData = JSON.parse(appStorage.get(this.pageRouter))

          this.passengerIdCard = localData.passengerIdCard
          this.variflightDate = localData.variflightDate + ' ' + localData.variflight.reachTime
          if(localData.avaibleCar){
            this.avaibleCar = localData.avaibleCar
            this.price = this.avaibleCar.price
            this.disableBtn = false
          }
          this.startTime = localData.startTime
          delete localData.passengerIdCard
          delete localData.variflightDate
          delete localData.avaibleCar
          delete localData.startTime

          this.orderData = localData
          if (this.orderData.offStation.name) {
            this.offAddress = this.airportProductOne.bAddress.city + ' ' + this.orderData.offStation.name
          }

          this.orderData.carType = this.avaibleCar.carType
          this.orderData.totalSeats = this.avaibleCar.seats

        }else if(appStorage.get('X-Auth-Token')){
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
          productTypeLevelOne: this.airportProductOne.productTypeLevelOne,
          productTypeLevelTwo: this.airportProductOne.productTypeLevelTwo,
          startupTime: this.startTime
        }
        if(this.airportProductOne.storeId && this.airportProductOne.storeId !== appStorage.get('StoreId')){
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
            productTypeLevelOne: this.airportProductOne.productTypeLevelOne,
            startupTime: startupTime,
            passengerNum: 1,
            ticketAmount: this.ticketTotalAmount,
            ticketTotalAmount: this.ticketTotalAmount,
            activityId: this.orderData.discountInfo.activityId,
            price: this.ticketTotalAmount - this.reducedAmount
          }
        })
      },

      sharePage () {
        if(this.airportProductOne.shareThemes && this.airportProductOne.shareThemes.length){
          let max = this.airportProductOne.shareThemes.length - 1
          let random = Math.round(Math.random() * max);
          let shareTheme = this.airportProductOne.shareThemes[random]
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
          productTypeLevelOne: this.airportProductOne.productTypeLevelOne,
          productTypeLevelTwo: this.airportProductOne.productTypeLevelTwo
        })
      },

      /**
       *  跳转到航班号选择
       */
      jumpToFlightChoose () {
        this.saveForm()
        this.$router.push({
          name:'flightChoose',
          query: {
            pageRouter: this.pageRouter,
            endPlace: this.endPlace,
            airportCode: this.airportCode
          }
        })

      },

      /**
       * 跳转上下车点选择
       * @param dataKey 站点类型：onStation, offStation
       */
      jumpToAppointStation (dataKey) {
        this.saveForm()
        this.$router.push({
          name:'appointStation',
          query: {
            fromPage: this.pageRouter,
            dataKey: dataKey,
            productId: this.productId,
            productTypeLevelOne: this.airportProductOne.productTypeLevelOne,
            searchCity: this.airportProductOne.bAddress.city
          }
        })
      },

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .flight-number{
    display:flex;
    margin-bottom:20px;
    background-color: @fc-fff;
    .number{
      flex: 1;
      font-size:24px;
      color: @fc-929292;
      height:130px;
      line-height:130px;
      padding-left:20px;
      &.f-black{
        color: @fc-393a3e;
      }
    }
    .choose{
      flex:4;
      .title{
        font-size:32px;
        height:35px;
        line-height:35px;
        margin-top:30px;
        a{
          color: @fc-121212;
        }
      }
      .tip{
        font-size:24px;
        color: @fc-929292;
        height:35px;
        line-height:35px;
        margin-top:10px;
      }
    }
    .choose-result{
      flex:4;
      .top-word{
        font-size:32px;
        color: @fc-121212;
        margin-top:30px;
      }
      .bot-word{
        font-size:24px;
        color: @fc-ff6600;
        &.f-black{
          font-size:26px;
          color: @fc-121212;
        }
      }
      p{
        height:40px;
        line-height:40px;
      }
      .air-place{
        margin-bottom:20px;
        overflow:hidden;
        .place-left{
          float: left;
        }
        .place-right{
          float: left;
        }
      }
      .border{
        border:1PX solid @bc-121212;
        height:1PX;
        width:50px;
        float: left;
        margin-top:45px;
        margin-left:30px;
        margin-right:30px;
        position: relative;
        i{
          position: absolute;
          top: -6px;
          right: -2px;
          height: 1PX;
          width: 10px;
          border: 1PX solid @bc-121212;
          display: inline-block;
          transform: rotate(40deg);
        }
      }
    }
  }
</style>
