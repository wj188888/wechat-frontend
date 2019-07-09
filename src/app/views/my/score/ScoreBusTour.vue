<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="white-back" style="padding-bottom:0;">
      <div class="sight-desc">
        <div class="theme" v-text="detailInfo.productTheme">摄影之旅丹巴+新都桥+稻城7日六晚跟团游向导+央视达人策划+16人Vip纯玩团
        </div>
        <div class="time-pany clearfix">
          <i class="pany-icon"></i>
          <span style="margin-right:20px;" v-text="detailInfo.firmName"></span>
        </div>
      </div>
    </div>
    <div class="form-box" style="margin-top:1rem;">
      <div class="input-inline line line-x-b" @click="jumpToSkuSelect">
        <label>{{ date | formatDate('dateWeek') }}</label>
        <span class="sig-date-price" v-if="integralPrice">{{integralPrice}}积分</span>
        <i class="icon-r-jt"></i>
      </div>
    </div>

    <passenger-add
      :carry-kid-setting="carryKidSetting"
      :max-buy-number="1"
      :order="orderData"
      @jumpToPassenger="jumpToPassenger"
      @deletPassenger="deletPassenger"
      @checkCarryKid="checkCarryKid">
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

    <div slot="footer">

      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPassword"></pay-dialog>

      <div class="abs-bottom-box">
        <div class="buy-left clearfix" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span>
            {{ totalPrice }}<i class="small">积分</i>
            <em v-if="servicePrice"><i class="small"> + ¥</i>{{servicePrice}}</em>
          </span>
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
          <p v-if="detailInfo.serviceFee > 0">
            <span class="price-d-tit">服务费用</span>
            <span>
            {{detailInfo.serviceFee | formatPrice('yuan')}} × {{passengerNum}}人
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
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      PassengerAdd,
      InsureSelect,
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
        detailInfo: '',
        priceMore: false, //是否显示订单详情
        showPriceDetail: false,
        datePrice: '',
        storeId: '',
        flightId: '',
        disableBtn: false,
        date: '',
        servicePrice:0,
        myScore: 0,
      }
    },
    computed: {
      totalPrice () {
        this.adultNum = this.orderData.passengers.length
        this.childrenNum = this.orderData.children.length
        this.passengerNum = this.adultNum + this.childrenNum

        if (this.passengerNum) {
          this.priceMore = true

          let insureprice = this.orderData.totalPrem * this.passengerNum
          let servicePrice = this.detailInfo.serviceFee * this.passengerNum
          this.servicePrice = insureprice + servicePrice

          this.orderData.integralPrice = this.integralPrice * this.passengerNum
          return this.orderData.integralPrice
        } else {
          this.priceMore = false
          return 0
        }

      }
    },
    mounted(){
      this.orderData.productId = this.$route.query.productId
      this.orderData.integralExId = this.$route.query.integralExId
      let usrInfo = JSON.parse(appStorage.get('userInfo'))
      this.myScore = usrInfo.points || 0

      if (appStorage.get(this.pageRouter)) {
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        console.log(localData)
        this.orderData.passengers = localData.passengers || []
        this.orderData.children = localData.children || []
        this.orderData.needInvoice = localData.needInvoice
        this.orderData.price = localData.price || 0

        if(localData.id){
          this.orderData.skuId = localData.id
        }else{
          this.orderData.skuId = localData.skuId
        }

        this.integralPrice = localData.integralPrice
        this.orderData.childPrice = localData.childPrice || 0
        if (localData.startupTime) {
          this.date = localData.startupTime
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
        saveData.startupTime = this.date
        saveData.integralPrice = this.integralPrice
        appStorage.set(this.pageRouter, JSON.stringify(saveData))
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
            this.detailInfo = data.resultData
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
        this.ticketTotalAmount = this.orderData.price * 1
        this.insurancePlanTypeFind(this.ticketAmount)
      },

      sharePage () {
        if(this.detailInfo.shareTheme){
          interfaceApi.share({
            share: true,
            shareUrl: location.href,
            shareTitle: this.detailInfo.shareTheme.title,
            shareDesc: this.detailInfo.shareTheme.description,
            shareImgUrl: this.detailInfo.shareTheme.image
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
          productTypeLevelOne: this.detailInfo.productTypeLevelOne,
          productTypeLevelTwo: this.detailInfo.productTypeLevelTwo
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
            maxBuyNumber: 1
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
