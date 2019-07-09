<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <ticket-info
      :product-type="EXPRESS_BUS"
      :ticketInfo="ticketInfo">
    </ticket-info>
    <ul class="ticket-info line line-x" v-if="ticketInfo.flightCode && ticketInfo.distance">
      <li class="line line-y-r">班次 {{ticketInfo.flightCode}}</li>
      <li class="line line-y-r">长期班</li>
      <li>里程 {{ticketInfo.distance}}km</li>
    </ul>

    <div class="form-box mar-t-20 line line-x-t line-x-b">
      <div class="input-x" @click="jumpToStation('onStation')">
        <label>上车地点</label>
        <div class="value-x pad-big">{{orderData.onStation.name}}</div>
      </div>
      <div class="input-x line line-x-t" @click="jumpToStation('offStation')">
        <label>下车地点</label>
        <div class="value-x pad-big">{{orderData.offStation.name}}</div>
      </div>
    </div>

    <passenger-add
      :carry-kid-setting="carryKidSetting"
      max-buy-number="1"
      :order="orderData"
      @jumpToPassenger="jumpToPassenger"
      @deletPassenger="deletPassenger"
      @checkCarryKid="checkCarryKid">
    </passenger-add>

    <div class="inline-box mar-tb-20 line line-x">
      <label>手机号码</label>
      <input type="tel" v-model="orderData.contactTelephone" placeholder="必填，接收车票信息" maxlength="11"/>
    </div>

    <insure-select
      :insure-type-id="orderData.insureTypeId"
      :total-prem="orderData.totalPrem"
      :passenger-num="passengerNum"
      :ticket-amount="ticketAmount"
      :save-form="saveForm"
      :from-page="pageRouter">
    </insure-select>

    <ticket-notice
      :custom-contents="ticketInfo.customContents"
      refund-notice-type="refundNotice1"
      :firmName="ticketInfo.firmName">
    </ticket-notice>

    <div slot="footer">

      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPassword"></pay-dialog>

      <div class="abs-bottom-box">
        <div class="buy-left clearfix" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span>
            {{ totalPrice }}<i class="small">积分</i>
            <em v-if="servicePrice">
              <i class="small"> + ¥</i>{{servicePrice}}
            </em>
          </span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input type="button" @click="orderCreateHandel('express')" :disabled="disableBtn" class="button button-primary" value="提交订单"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">旅客人数</span>
            <span>{{passengerNum}}人</span>
          </p>
          <p>
            <span class="price-d-tit">成人票价</span>
            <span>
              {{integralPrice}}积分 × {{passengerNum}}人
            </span>
          </p>
          <p v-if="orderData.insureTypeId && passengerNum">
            <span class="price-d-tit">保险费用</span>
            <span>
              {{orderData.totalPrem | formatPrice}} × {{passengerNum}}人
            </span>
          </p>
          <p v-if="ticketInfo.serviceFee > 0">
            <span class="price-d-tit">服务费用</span>
            <span>
              {{ticketInfo.serviceFee | formatPrice}} × {{passengerNum}}人
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
  import PayDialog from 'appComponents/dialog/payDialog'
  import TicketInfo from 'components/ticket-info/index'
  import TicketNotice from 'components/ticketNotice/index'
  import { Group, PopupPicker } from 'vux'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      PassengerAdd,
      InsureSelect,
      PayDialog,
      TicketInfo,
      TicketNotice,
      Group,
      PopupPicker
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        EXPRESS_BUS: '',
        ticketInfo: {
          aAddress:{},
          bAddress:{},
          customContents:[]
        },
        carryKidSetting: {
          canCarryKid: false
        },
        priceMore: false,
        showPriceDetail: false,
        orderData: {
          formId: TOOL.getTimeStamp(),
          skuId: '',
          productTypeLevelOne: '',
          passengers: [],
          onSiteId:'',
          onStation: {
            name: TOOL.placeHolder.onStation
          },
          offSiteId:'',
          offStation: {
            name: TOOL.placeHolder.offStation
          },
          contactName: '',
          contactTelephone: '',
          insureTypeId: '', // 保险id
          totalPrem: 0, // 保险价格
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          needInvoice: false,
          integralExId: '',
          integralType: 1, // 积分兑换类型 0：兑换产品，1：积分抵现
          integralPrice: 0, //抵用积分
        },
        integralPrice: 0,
        servicePrice: 0,
        myScore: 0,
        disableBtn: false,
      }
    },
    computed: {
      totalPrice () {
        this.passengerNum = this.orderData.passengers.length
        if (this.passengerNum > 0) {
          this.priceMore = true
          let insureprice = this.orderData.totalPrem * this.passengerNum
          let servicePrice = this.ticketInfo.serviceFee * this.passengerNum
          this.servicePrice = insureprice + servicePrice
          this.orderData.integralPrice = this.integralPrice * this.passengerNum
          return this.orderData.integralPrice
        } else {
          this.priceMore = false
          return 0
        }
      },
    },
    mounted () {
      let usrInfo = JSON.parse(appStorage.get('userInfo'))
      this.orderData.contactTelephone = usrInfo.phone
      this.myScore = usrInfo.points || 0
      this.integralPrice = this.$route.query.integralPrice
      this.orderData.skuId = this.$route.query.skuId
      this.orderData.integralExId = this.$route.query.integralExId
      this.orderData.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.skuFindById()
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.orderData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 查询车票SKU信息
       */
      skuFindById () {
        let resource
        switch(this.orderData.productTypeLevelOne){
          case 'CITY_BUS':
            resource = 'citySkuFindById'
            this.EXPRESS_BUS = TOOL.CITY_EXPRESS_BUS
            break;
          case 'AIRPORT_BUS':
            resource = 'airportSkuFindById'
            this.EXPRESS_BUS = TOOL.AIRPORT_EXPRESS_BUS
            break;
          case 'TRAIN_STATION_BUS':
            resource = 'trainStationSkuFindById'
            this.EXPRESS_BUS = TOOL.TRAIN_EXPRESS_BUS
            break;
          case 'SCHOOL_BUS':
            resource = 'schoolSkuFindById'
            this.EXPRESS_BUS = TOOL.SCHOOL_EXPRESS_BUS
            break;
          case 'SCENIC_BUS':
            resource = 'scenicSkuFindById'
            this.EXPRESS_BUS = TOOL.SCENIC_EXPRESS_BUS
            break;
        }
        this.$store.commit('UPDATE_LOADING', true)
        api[resource](this.orderData.skuId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.ticketInfo = data.resultData
            this.carryKidSetting = data.resultData.carryKidSetting
            this.orderData.productTypeLevelOne = this.ticketInfo.productTypeLevelOne

            //上下车站点只有一个自动填充不选择
            if (this.ticketInfo.onStationList.length === 1) {
              this.orderData.onStation = this.ticketInfo.onStationList[0]
            }

            if (this.ticketInfo.offStationList.length === 1) {
              this.orderData.offStation = this.ticketInfo.offStationList[0]
            }

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
          this.orderData = Object.assign(this.orderData, localData)
        }
        this.initActivityAndCoupon()
      },

      initActivityAndCoupon () {
        let stationPrice = (this.orderData.onStation.slidingScalePrice || 0) + (this.orderData.offStation.slidingScalePrice || 0)
        this.integralPrice = +this.integralPrice + (this.orderData.onStation.slidIntegral || 0) + (this.orderData.offStation.slidIntegral || 0)
        this.ticketAmount = stationPrice + this.ticketInfo.price
        this.passengerNum = this.orderData.passengers.length
        this.ticketTotalAmount = this.ticketAmount * this.passengerNum
        this.insurancePlanTypeFind(this.ticketAmount)
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
       * 跳转上下车站点选择
       * @param stationName 站点类型：onStation, offStation
       * 注：如只有一个站点不跳转站点选择页面
       */
      jumpToStation (stationName) {
        if (this.ticketInfo[stationName + 'List'].length === 1) {
          return
        }
        this.saveForm()
        this.$router.push({
          name: 'pageStation',
          query: {
            skuId: this.orderData.skuId,
            fromPageRouter: this.pageRouter,
            productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
            productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
            stationType: stationName,
            startupTime: this.ticketInfo.startupTime
          }
        })
      },

      /**
       * 跳转到乘客列表新增乘客
       */
      jumpToPassenger () {
        this.saveForm()
        this.$router.push({
          name: 'passengerList',
          query: {
            page: this.pageRouter,
            dataKey: 'passengers',
            maxBuyNumber: 1
          }
        })
      },

      /**
       *  删除联系人
       */
      deletPassenger (passenger) {
        for (let i in this.orderData.passengers) {
          if (passenger.idCard === this.orderData.passengers[i].idCard) {
            this.orderData.passengers.splice(i, 1)
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
          if (this.orderData.passengers.hasOwnProperty(i)) {
            if (this.orderData.passengers[i].carryKid) {
              carryKidNum++
            }
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
<style lang="less" scoped>
  @import "../../../../styles/theme.less";
  .ticket-info {
    display: flex;
    background-color: #fff;
  }

  .ticket-info li {
    flex: 1;
    height: 30px;
    line-height: 30px;
    margin: 15px 0;
    text-align: center;
    font-size: 24px;
    color: #929292;
  }

  .isflow-time {
    font-size: 24px !important;
  }

  .isflow-time span:last-child {
    font-size: 20px;
  }

  .warning-tips{
    margin-bottom: 10px;
    line-height:1.5;
    font-size:24px;
    color:#999;
    padding:0 20px;
  }
</style>
