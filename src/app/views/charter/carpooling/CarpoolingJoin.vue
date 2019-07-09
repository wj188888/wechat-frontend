<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <carpooling-info
            :info-data="ticketInfo"
            :price-type="2"
            :show-service="false"
            :show-tips="false">
    </carpooling-info>

    <div class="form-box mar-t-20 line line-x-t line-x-b">
      <div class="input-x" @click="jumpToStation('onStation')">
        <label>上车地点</label>
        <div class="value-x pad-big" v-text="orderData.onStation.name"></div>
      </div>
      <div class="input-x line line-x-t" @click="jumpToStation('offStation')">
        <label>下车地点</label>
        <div class="value-x pad-big" v-text="orderData.offStation.name"></div>
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

    <div class="form-box line line-x-t line-x-b mar-t-20">
      <div class="input-inline line line-x-t">
        <label>手机号码</label>
        <input type="tel" v-model="orderData.contactTelephone" placeholder="必填，接收车票信息" maxlength="11"/>
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

    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left clearfix" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span v-if="showPrice">{{ totalPrice | formatPrice }}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input type="button" @click="orderCreateExistLine" :disabled="disableBtn" class="button button-primary" value="下一步"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">旅客人数</span>
            <span>{{passengerNum}}人</span>
          </p>
          <p v-if="orderData.insureTypeId">
            <span class="price-d-tit">保险费用</span>
            <span>
              {{orderData.totalPrem | formatPrice}} × {{passengerNum}}人
            </span>
          </p>
          <p>
            <span class="price-d-tit">成人票价</span>
            <span>
            {{ticketInfo.price | formatPrice('yuan')}} × {{passengerNum}}人
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
  import CarpoolingInfo from 'appComponents/carpoolingInfo/index'
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
      CarpoolingInfo
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        ticketInfo: {

        },
        carryKidSetting: {
          canCarryKid: false
        },
        showPriceDetail: false,
        orderData: {
          formId: TOOL.getTimeStamp(),
          skuId: '',
          passengers: [],
          insureTypeId: '', // 保险类型id
          totalPrem: 0, //保险价格
          needInvoice: '',
          contactName: '',
          contactTelephone: '',
          onStation: {
            longitude: '',
            latitude: '',
            name: TOOL.placeHolder.onStation,
            rank: 1
          },
          offStation: {
            longitude: '',
            latitude: '',
            name: TOOL.placeHolder.offStation,
            rank: 1
          },
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
        },
        maxBuyNumber: '', //最大购票数
        disableBtn: false,
        noticeShow: false,
        priceMore: false,
      }
    },
    computed: {
      totalPrice () {
        this.passengerNum = this.orderData.passengers.length;
        if (this.passengerNum > 0) {
          this.priceMore = true
          let passengerPrice = this.ticketInfo.price * this.passengerNum
          let insureprice = this.orderData.totalPrem * this.passengerNum
          let servicePrice = this.ticketInfo.serviceFee * this.passengerNum
          return passengerPrice + insureprice + servicePrice - this.reducedAmount - this.orderCouponPrice
        } else {
          this.priceMore = false
          return 0
        }
      }
    },
    mounted () {
      this.orderData.skuId = this.$route.query.skuId
      this.lineSkuFindById(this.orderData.skuId)
    },
    methods: {
      /**
       * 根据skuId查找线路包车
       *  @param skuId 产品skuId
       */
      lineSkuFindById (skuId) {
        this.$store.commit('UPDATE_LOADING', true)
        api.lineSkuFindById(skuId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.ticketInfo = data.resultData
            this.orderData.price = this.ticketInfo.price
            this.carryKidSetting = data.resultData.carryKidSetting
            this.title = data.resultData.aAddress.city + ' — ' + data.resultData.bAddress.city
            this.maxBuyNumber = data.resultData.availableSeats

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
          this.orderData = JSON.parse(appStorage.get(this.pageRouter))
          this.initActivityAndCoupon()
        } else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.orderData.contactTelephone = usrInfo.phone
        }
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.orderData.price
        this.passengerNum = this.orderData.passengers.length
        this.ticketTotalAmount = this.ticketAmount * this.passengerNum
        this.activityAndCounponParam = {
          type: 'skuId',
          id: this.orderData.skuId,
          productId: this.ticketInfo.productId,
          productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
          productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
          startupTime: this.ticketInfo.startupTime
        }
        this.insurancePlanTypeFind(this.ticketAmount)
        if(this.ticketInfo.storeId && this.ticketInfo.storeId !== appStorage.get('StoreId')){
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
        this.$router.push({
          name: 'selectCoupon',
          query: {
            pageRouter: this.pageRouter,
            skuId: this.orderData.skuId,
            productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
            startupTime: this.ticketInfo.startupTime,
            passengerNum: this.passengerNum,
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
          productId: this.orderData.productId,
          productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
          productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo
        })
      },

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
       * 跳转上下车站点选择
       * @param stationName 站点类型：onStation, offStation
       * 注：如只有一个站点不跳转站点选择页面
       */
      jumpToStation (stationName) {
        let tips = stationName === 'onStation' ? '上车地点' : '下车地点'
        if (this.ticketInfo[stationName + 'List'].length === 1) {
          this.$store.dispatch('showError', '当前线路只有一个' + tips);
          return
        }
        this.saveForm()
        this.$router.push({
          name: 'pageStation',
          query: {
            skuId: this.ticketInfo.productId,
            fromPageRouter: this.pageRouter,
            productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
            stationType: stationName
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
            maxBuyNumber: this.maxBuyNumber,
          }
        })
      },

      /**
       *  删除联系人
       *  注：需重新计算购买保险人数
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

      /**
       * 新增订单
       */
      orderCreateExistLine () {
        if (!appStorage.get('X-Auth-Token')) {
          this.saveForm()
          TOOL.login()
          return;
        }

        let validata = TOOL.formValidate([
          {value: this.orderData.onStation.name, emptyTips: '请选择上车地点'},
          {value: this.orderData.offStation.name, emptyTips: '请选择下车地点'},
          {value: this.orderData.passengers.length, emptyTips: '至少添加一个旅客'},
          {value: this.orderData.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.disableBtn = true
        this.$store.commit('UPDATE_LOADING', true)

        this.setPassengerInsure()

        let orderData = Object.assign({}, this.orderData)

        delete this.orderData.totalPrem

        if (!appStorage.get('X-Auth-Token')) {
          this.disableBtn = false
          this.saveOrder(this.pageRouter, this.orderData)
          return;
        }
        this.orderCreated(this.pageRouter, orderData)
      }

    }
  }
</script>
<style scoped>

  .sig-date-price {
    font-size: 28px;
    color: #121212;
  }
</style>
