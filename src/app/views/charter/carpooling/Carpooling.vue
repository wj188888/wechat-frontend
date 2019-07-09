<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <carpooling-info
            :info-data="ticketInfo"
            :price-type="1"
            :show-service="true"
            :show-tips="true"
            :min-member="minTeamMember"
            :tips-type="pageRouter">
    </carpooling-info>

    <div class="form-box line line-box radius-box">
      <div class="input-inline selector-input">
        <label>选择用车</label>
        <input type="text" placeholder="请选择具体车辆" v-selector:selectConfig="lineServicePlans" readonly/>
        <i class="icon-r-jt"></i>
      </div>
    </div>
    <div class="form-box">
      <div class="input-inline line line-x-b" @click="jumpToSkuSelect">
        <label>乘车日期</label>
        <span class="sig-date-price" v-show="skuPrice.date">
              {{ skuPrice.date | formatDate('monthDay') }}&nbsp;&nbsp;&nbsp;&nbsp;<em>¥{{skuPrice.carPoolPrice}}</em>
            </span>
        <span class="sig-date-price sig-date-tips" v-show="!skuPrice.date">请选择乘车时间</span>
        <i class="icon-r-jt"></i>
      </div>
      <div class="input-inline selector-input">
        <label>出发时间</label>
        <input type="text" placeholder="请选择出发时间" v-mobitime:startConfig="startupTime" readonly/>
        <i class="icon-r-jt"></i>
      </div>
    </div>
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
        <div class="buy-right" @click="orderCreateLine">
          <p class="p1">{{ orderData.price | formatPrice('yuanren') }}</p>
          <p class="p2">发起拼车</p>
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
          <p>
            <span class="price-d-tit">成人票价</span>
            <span>
            {{orderData.price | formatPrice}}  × {{passengerNum}}人
          </span>
          </p>
          <p v-if="ticketInfo.serviceFee > 0">
            <span class="price-d-tit">服务费用</span>
            <span>{{ticketInfo.serviceFee | formatPrice}} × {{passengerNum}}人</span>
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
  import Mobitime from 'directives/mobiTime'
  import selector from 'directives/select'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    directives: {
      Mobitime,
      selector
    },
    mixins: [checkLogin, createOrder, service],
    components: {
      MainBox,
      PassengerAdd,
      InsureSelect,
      Activity,
      Coupon,
      CarpoolingInfo
    },
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        ticketInfo: {
          sellPoints:[]
        }, //产品详情
        carryKidSetting: {
          canCarryKid: false,
          maxNumber: 0
        },
        noticeShow: false, //订票、乘车、退票须知
        priceMore: false,
        showPriceDetail: false,
        orderData: {
          formId: TOOL.getTimeStamp(),
          productId: '',
          passengers: [],
          startupTime: '', // 出发时间
          couponId: '', // 优惠id
          contactName: '',
          contactTelephone: '',
          totalSeats: 0, // 核载人数
          carBrand: '', // 车辆品牌型号
          price: 0, // 支付金额（主要用户支付定金判断）
          payType: 1, //支付方式 1：全款 2：订金+尾款
          insureTypeId: '', // 保险类型id
          totalPrem: 0, //保险价格
          checkTime: '', //服务器当前时间
          needInvoice: false,
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
        minTeamMember: '', //最小成团数
        maxBuyNumber: '', //最大购票数
        lineServicePlans: '',  //用车计划
        skuPrice: '',
        startupTime: '',
        selectConfig: {
          data: [{
            text: '请选择具体车辆',
            value: ''
          }]
        },
        startConfig: {
          timeFormat: 'HH:ii',
          steps: {
            minute: TOOL.minuteStep,
            zeroBased: true
          }
        },
        disableBtn: false,
      }
    },
    watch: {
      lineServicePlans () {
        let localData = {}
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        if (this.lineServicePlans) {
          if (localData.lineServicePlans && this.lineServicePlans !== localData.lineServicePlans) {
            this.emptyData()
          }
          let lineServicePlan = this.lineServicePlans.split('|')
          this.orderData.totalSeats = lineServicePlan[0]
          this.orderData.carBrand = lineServicePlan[1]
          this.maxBuyNumber = lineServicePlan[2]
          this.minTeamMember = lineServicePlan[3]
          let canCarryKid = lineServicePlan[4] === 'true'
          let maxNumber = parseInt(lineServicePlan[5])
          this.carryKidSetting = {
            canCarryKid: canCarryKid,
            maxNumber: maxNumber
          }
        }else{
          this.emptyData()
        }
      },
      startupTime () {
        this.initActivityAndCoupon()
      }
    },
    computed: {
      totalPrice () {
        this.passengerNum = this.orderData.passengers.length;
        if (this.passengerNum > 0) {
          this.priceMore = true
          let passengerPrice = this.orderData.price * this.passengerNum
          let insureprice = this.orderData.totalPrem * this.passengerNum
          let servicePrice = this.ticketInfo.serviceFee * this.passengerNum
          return passengerPrice + insureprice + servicePrice - this.reducedAmount - this.orderCouponPrice
        } else {
          this.priceMore = false
          return 0
        }
      }
    },
    mounted(){
      this.orderData.productId = this.$route.query.productId
      this.lineProductFindById(this.orderData.productId)

    },
    methods: {
      emptyData () {
        this.skuPrice = ''
        this.orderData.passengers = []
        this.reducedAmount = 0
        this.orderCouponPrice = 0
        this.orderData.discountInfo.userCouponId = ''
      },

      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData
        localData.skuPrice = this.skuPrice
        localData.startupTime = this.startupTime
        localData.lineServicePlans = this.lineServicePlans
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 根据id查找线路包车详情
       *  @param productId 产品id
       */
      lineProductFindById (productId) {
        this.$store.commit('UPDATE_LOADING', true)
        api.lineProductFindById(productId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.ticketInfo = data.resultData

            //车辆选择指令初始化
            let lineServicePlan = data.resultData.lineServicePlans
            let selectData = [{text: '请选择具体车辆', value: ''}]
            for (let i = 0; i < lineServicePlan.length; i++) {
              let canCarryKid = false
              let maxNumber = 0
              if (lineServicePlan[i].carryKidSetting) {
                canCarryKid = lineServicePlan[i].carryKidSetting.canCarryKid
                maxNumber = lineServicePlan[i].carryKidSetting.maxNumber
              }

              selectData.push({
                text: lineServicePlan[i].carBrand + ' 载客' + lineServicePlan[i].seats + '人',
                value: lineServicePlan[i].totalSeats + '|' + lineServicePlan[i].carBrand + '|' + lineServicePlan[i].seats + '|' + lineServicePlan[i].minTeamMember + '|' + canCarryKid + '|' + maxNumber
              })
            }
            this.selectConfig = {
              theme: 'ios',
              lang: 'zh',
              display: 'bottom',
              data: selectData
            }

            this.title = data.resultData.aAddress.city + ' — ' + data.resultData.bAddress.city
            this.orderData.checkTime = data.resultData.checkTime

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
          this.skuPrice = localData.skuPrice
          this.startupTime = localData.startupTime
          this.lineServicePlans = localData.lineServicePlans

          delete localData.skuPrice
          delete localData.startupTime
          delete localData.lineServicePlans

          this.orderData = localData
          this.orderData.price = this.skuPrice.carPoolPrice
          this.initActivityAndCoupon()
        }else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.orderData.contactTelephone = usrInfo.phone
        }
      },

      initActivityAndCoupon () {
        if(!this.orderData.price) return
        this.showPrice = false
        this.ticketAmount = this.orderData.price
        this.passengerNum = this.orderData.passengers.length
        this.ticketTotalAmount = this.ticketAmount * this.passengerNum

        let time = this.startupTime || '00:00'
        let startupTime = this.skuPrice.date + ' ' + time+ ':00'
        this.activityAndCounponParam = {
          type: 'productId',
          id: this.orderData.productId,
          productId: this.orderData.productId,
          productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
          productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
          startupTime:startupTime
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
        let time = this.startupTime || '00:00'
        let startupTime = this.skuPrice.date + ' ' + time+ ':00'
        this.saveForm()
        this.$router.push({
          name: 'selectCoupon',
          query: {
            pageRouter: this.pageRouter,
            productId: this.orderData.productId,
            productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
            startupTime: startupTime,
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

      jumpToSkuSelect () {
        if (!this.lineServicePlans) {
          this.$store.dispatch('showError', '请选择具体车辆');
          return;
        }
        this.saveForm()
        let nowStamp = Date.parse(TOOL.newGetDate({date: this.orderData.checkTime, type: 'formatDate'}))
        let startTime = new Date(nowStamp + this.ticketInfo.carPoolPreOrderMinTime * 24 * 60 * 60 * 1000)
        let endTime = new Date(nowStamp + this.ticketInfo.carPoolPreOrderMaxTime * 24 * 60 * 60 * 1000)
        startTime = TOOL.newGetDate({date: startTime, type: 'date'})
        endTime = TOOL.newGetDate({date: endTime, type: 'date'})
        this.$router.push({
          name: 'skuSelect',
          query: {
            pageRouter: this.pageRouter,
            productId: this.orderData.productId,
            carBrand: this.orderData.carBrand,
            totalSeats: this.orderData.totalSeats,
            startDate: startTime,
            endDate: endTime
          }
        })
      },

      /**
       * 跳转到乘客列表新增乘客
       */
      jumpToPassenger () {
        if (!this.lineServicePlans) {
          this.$store.dispatch('showError', '请选择具体车辆');
          return;
        }
        this.saveForm()
        this.$router.push({
          name: 'passengerList',
          query: {
            page: this.pageRouter,
            dataKey: 'passengers',
            maxBuyNumber: this.maxBuyNumber
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
            skuId: this.orderData.productId,
            fromPageRouter: this.pageRouter,
            productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
            stationType: stationName
          }
        })
      },

      /**
       * 新增订单
       */
      orderCreateLine () {
        let validata = TOOL.formValidate([
          {value: this.lineServicePlans, emptyTips: '请选择具体车辆'},
          {value: this.skuPrice.date, emptyTips: '请选择乘车日期'},
          {value: this.startupTime, emptyTips: '请选择出发时间'},
          {value: this.orderData.onStation.name, emptyTips: '请选择上车地点'},
          {value: this.orderData.offStation.name, emptyTips: '请选择下车地点'},
          {value: this.orderData.passengers, emptyTips: '至少添加一个旅客',minlength:1},
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
        this.orderData.startupTime = this.skuPrice.date + ' ' + this.startupTime + ':00'

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

  .sig-date-price em {
    color: #ff6600;
  }

  .sig-date-tips {
    font-size: 28px;
    color: #999;
  }

  .buy-right {
    position: relative;
    background-color: #ff6600;
    text-align: center;
  }

  .p1 {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #fff;
    font-size: 28px;
  }

  .p2 {
    color: #fff;
    font-size: 32px;
  }

  .icon-phone{
    display:block;
    flex:1;
    background:url("../../../../assets/charter/phone-carpooling-manage.png") no-repeat right center;
    background-size:50px 50px;
  }
</style>
