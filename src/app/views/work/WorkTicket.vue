<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="mar20">
      <div class="top-tip">
        <p>为避免订单失效，请在<span>5分钟内</span>完成支付</p>
      </div>
      <div class="detail-box line line-box radius-box">
        <div class="select-price" @click="jumpToSkuSelect">
          选择日期
          <span class="pull-right">{{ workSku.startupTime | formatDate('date') }}</span>
          <i class="icon icon-r-jt"></i>
        </div>
        <div class="order-box line line-x-t">
          <div class="start clearfix">
            <span class="time" v-text="ticketInfo.time">10:00</span>
            <span class="circle circle-bg-start">始</span>
            <span class="place" v-text="ticketInfo.aAddress">景江区</span>
            <div class="price" v-show="workSku.price">
              <p class="number" v-text="'¥' + workSku.price">¥2.5</p>
              <p class="remain" v-text="'余票' + workSku.availableSeats + '张'">余票6张</p>
            </div>
          </div>
          <div class="end clearfix">
            <span class="company" v-text="ticketInfo.firmName">灰狗运业</span>
            <span class="circle circle-bg-end">终</span>
            <span class="place" v-text="ticketInfo.bAddress">成都国际节能大厦</span>
          </div>
        </div>
      </div>
      <div class="form-box pad-0-inner-20 line line-box radius-box">
        <div class="input-x" @click="jumpToSkuStation('onStation')">
          <label>上车站点</label>
          <div class="value-x" v-text="orderData.onStation"></div>
        </div>
        <div class="input-x line line-x-t" @click="jumpToSkuStation('offStation')">
          <label>下车站点</label>
          <div class="value-x" v-text="orderData.offStation"></div>
        </div>

        <activity :optimal-activity="optimalActivity"
                  :activity-list="activityList"
                  :use-activity="orderData.useActivity"
                  @change="checkActivity"
                  @changeActivity="changeActivity">
        </activity>

        <coupon :order-coupon-price="orderCouponPrice" @jumpToSelectCoupon="jumpToSelectCoupon"></coupon>

        <ticket-notice class="notice-mar-t-0"
                       :custom-contents="workSku.customContents"
                       refund-notice-type="refundNotice1">
        </ticket-notice>

      </div>

    </div>
    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span v-if="showPrice">{{totalPrice | formatPrice}}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input class="button button-primary" type="button" @click="createSchoolWork" :disabled="disableBtn" value="支付"/>
        </div>
      </div>

      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">行程费用</span>
            <span>{{workSku.price | formatPrice('yuan')}}</span>
          </p>
          <p v-if="workSku.serviceFee">
            <span class="price-d-tit">服务费用</span>
            <span>{{workSku.serviceFee | formatPrice('yuan')}}</span>
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
  import MainBox from 'components/mainBox/index.vue'
  import Activity from 'appComponents/orderCreateService/activity'
  import Coupon from 'appComponents/orderCreateService/coupon'
  import TicketNotice from 'components/ticketNotice/index.vue'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      Activity,
      Coupon,
      TicketNotice
    },
    mixins: [service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        storeId: '',
        skuId:'',
        flightId: '',
        ticketInfo: '',
        workSku: {},
        orderData: {
          formId: TOOL.getTimeStamp(), //防重复提交字段
          skuId: '',
          productTypeLevelOne: '',
          onStation: TOOL.placeHolder.onStation,
          offStation: TOOL.placeHolder.offStation,
          needInvoice: false,
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
        },
        disableBtn: false,
        priceMore: false,
        showPriceDetail: false,
      }
    },
    computed: {
      totalPrice () {
        if(this.workSku.price){
          this.priceMore = true
          return this.workSku.price + this.workSku.serviceFee - this.reducedAmount - this.orderCouponPrice
        }else {
          this.priceMore = false
          return this.workSku.price
        }
      }
    },
    mounted () {
      this.storeId = this.$route.query.storeId
      this.flightId = this.$route.query.flightId
      this.ticketInfo = {
        time: this.$route.query.time,
        aAddress: this.$route.query.aAddress,
        firmName: this.$route.query.firmName,
        bAddress: this.$route.query.bAddress
      }

      this.skuId = this.$route.query.skuId
      if(this.skuId){
        this.workSkuFindById()
      }else{
        this.getLocalData(true)
      }

      this.workProductFindByFlight()
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.workSku
        localData.discountInfo = {}
        localData.discountInfo.userCouponId = this.orderData.discountInfo.userCouponId
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 根据id查找工作班车sku
       */
      workSkuFindById () {
        api.workSkuFindById(this.skuId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.workSku = data.resultData
            this.getLocalData()
            this.setLocalData ()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 获取本地数据
       */
      getLocalData (setData) {
        if (appStorage.get(this.pageRouter)) {
          this.workSku = JSON.parse(appStorage.get(this.pageRouter))
          if(setData){
            this.setLocalData ()
          }
        }
      },

      setLocalData () {
        this.orderData.skuId = this.workSku.id
        this.orderData.productTypeLevelOne = this.workSku.productTypeLevelOne
        this.orderData.onStation = this.getStationName(this.workSku, 'onStation')
        this.orderData.offStation = this.getStationName(this.workSku, 'offStation')

        this.initActivityAndCoupon()

        //统计产品详情页面pvuv
        if(this.orderData.skuId){
          TOOL.saveVisitLogs({
            url: this.$route.name,
            skuId: this.orderData.skuId,
            productTypeLevelOne: this.workSku.productTypeLevelOne
          })
        }
      },

      /**
       * 只有一个站点默认选中
       */
      getStationName (workSku, type) {
        if(workSku[type + 'List'].length === 1){
          return workSku[type + 'List'][0].name
        }else{
          return workSku[type] || TOOL.placeHolder[type]
        }
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.workSku.price
        this.passengerNum = 1
        this.ticketTotalAmount = this.workSku.price
        this.activityAndCounponParam = {
          type: 'skuId',
          id: this.workSku.id,
          productId: this.workSku.productId,
          productTypeLevelOne: this.workSku.productTypeLevelOne,
          productTypeLevelTwo: this.workSku.productTypeLevelTwo,
          startupTime: this.workSku.startupTime
        }
        if(this.workSku.storeId && this.workSku.storeId !== appStorage.get('StoreId')){
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
            skuId: this.workSku.id,
            productTypeLevelOne: this.workSku.productTypeLevelOne,
            startupTime: this.workSku.startupTime,
            passengerNum: 1,
            ticketAmount: this.ticketAmount,
            ticketTotalAmount: this.ticketTotalAmount,
            activityId: this.orderData.discountInfo.activityId,
            price: this.ticketTotalAmount - this.reducedAmount
          }
        })
      },

      /**
       * 根据班次id查询分享主题
       */
      workProductFindByFlight () {
        api.workProductFindByFlight(this.flightId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            if(data.resultData){
              interfaceApi.share({
                share: true,
                shareUrl: window.location.href,
                shareTitle: data.resultData.title,
                shareDesc: data.resultData.description,
                shareImgUrl: data.resultData.image
              });
            }else{
              interfaceApi.share({
                share: true,
                shareUrl: window.location.href
              });
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 跳转到日期界面选择车票
       */
      jumpToSkuSelect () {
        this.saveForm()
        this.$router.push({
          name: 'skuSelect',
          query: {
            pageRouter: this.pageRouter,
            storeId: this.storeId, //分销产品店铺id
            flightId: this.flightId
          }
        })
      },

      /**
       * 跳转到站点选择界面选择站点
       * @param dataKey
       */
      jumpToSkuStation (dataKey) {
        if (!this.workSku.id) {
          this.$store.dispatch('showError', '请先选择日期');
          return
        }
        this.saveForm()
        this.$router.push({
          name: 'skuStation',
          query: {
            pageRouter: this.pageRouter,
            dataKey: dataKey
          }
        })
      },

      /**
       * 新增订单
       */

      createSchoolWork () {
        if (!appStorage.get('X-Auth-Token')) {
          this.saveForm()
          TOOL.login()
          return;
        }

        let validata = TOOL.formValidate([
          {value: this.orderData.productTypeLevelOne, emptyTips: '请选择日期'},
          {value: this.orderData.onStation, emptyTips: '上车站点不能为空'},
          {value: this.orderData.offStation, emptyTips: '下车站点不能为空'}
        ])

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg)
          return false
        }

        this.disableBtn = true
        this.$store.commit('UPDATE_LOADING', true)
        if(appStorage.get('marketerId')){
          this.orderData.marketerId = appStorage.get('marketerId')
        }
        this.orderData.orderSource = TOOL.browserType()
        api.createSchoolWork(this.orderData).then(res => {
          const result = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (result.resultCode === '0') {
            this.deleteForm()
            this.$router.push({
              name: 'orderDetail',
              query: {
                orderId: result.resultData
              }
            })
          } else {
            this.disableBtn = false
            this.orderData.formId = TOOL.getTimeStamp()
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      }

    }
  }
</script>
<style lang="less" scoped>
  .notice-mar-t-0 .mar-t-20{
    margin-top:0!important;
  }
</style>
