<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <ticket-info
      :product-type="STATION_BUS"
      :ticketInfo="ticketInfo">
    </ticket-info>

    <ul class="ticket-info line line-x">
      <li class="line line-y-r">班次&nbsp;&nbsp;&nbsp;<span v-text="ticketInfo.schCode"></span></li>
      <li class="line line-y-r">
        <span v-if="ticketInfo.isFlow === 0">固定班</span>
        <span v-if="ticketInfo.isFlow === 1">流水班</span>
      </li>
      <li>里程&nbsp;&nbsp;&nbsp;<span v-text="ticketInfo.runDistance"></span>km</li>
    </ul>

    <div class="form-box mar-t-20 line line-x-t line-x-b" v-if="isAfterSale">
      <div class="input-x" @click="jumpToStation('onStation')">
        <label>上车地点</label>
        <div class="value-x pad-big">{{orderData.onStation}}</div>
      </div>
      <div class="input-x line line-x-t" @click="jumpToStation('offStation')">
        <label>下车地点</label>
        <div class="value-x pad-big">{{orderData.offStation}}</div>
      </div>
    </div>

    <passenger-add
      :carry-kid-setting="carryKidSetting"
      :max-buy-number="ticketInfo.maxBuyNumber"
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

    <div class="inline-box mar-t-20 line line-x-t"
         :class="{'dd-text-active': noticeShow}"
         @click="noticeShow = !noticeShow">
      <label>购票须知</label>
      <i class="icon-r-jt"></i>
    </div>
    <notice v-show="noticeShow">
      <h3 class="h3">购票须知</h3>
      <p class="p">1.成人及身高超过1.5米的儿童须购买全价票，供给座位。</p>
      <p class="p">2.身高1.2米至1.5米的儿童购买半价儿童票，供给座位。</p>
      <p class="p">
        3.身高1.2米以下儿童属免票儿童，须由购买了“成人票”，并点选了“携带儿童”的一名成人带领下免费乘车。一张“成人票”最多可以携带一名免票儿童，免票儿童无座位。一名成人携带免票儿童超出一名时，应为超出的儿童购买儿童半票，儿童半票供给座位。</p>
      <p class="p">
        4.旅客随身携带乘车的物品，每一张全票可免费10千克，每一张儿童票可免费5千克；体积不能超过0.05立方米，长度不能超过1.8米，并以能放置本人座位下或车内行李架上为限。超过规定时，其超过部分按行包收费；占用座位时，按实际占用座位数购票。</p>
      <p class="p">5.网上售票暂不支持网上改签。如需改签，请咨询车站，并以车站实际规则为准。</p>
      <p class="p">
        6.本售票渠道由我公司投资建设，采用自负盈亏的市场化机制运行，为了持续为旅客提供便捷服务，需要向使用购票服务的旅客收取一定的服务费。取票后可到车站综合窗口或服务台领取发票。由于您已经使用了本项服务，因此您如果退票时，服务费是不退还的。</p>
      <p class="p">7.军残票等特殊票请到始发车站专用窗口优先购票。</p>
      <p class="p">8.在同一个订单中，您最多可以购买5张车票，如果有多个乘车人，您可以分开多次购买。</p>
      <p class="p">
        9.网上购票时，为了保证您的合法权益和保障信息安全，你须注册后才能使用购票服务，请您务必如实填写相关个人资料（有效身份证件）及手机号码并认真核对，若因资料填写错误而造成经济损失，将由您自行承担。</p>
      <p class="p">10.根据联网车站相关规定，半票票价金额并不一定等于全票价格的一半，如有疑问请询问始发站服务台。</p>

      <h3 class="h3">取票须知</h3>
      <p class="p">1.您购买车票后，系统会自动生成二维码的电子票，您无需取票。</p>
      <p class="p">2.司机通过验票app即可对您的二维码电子票进行扫码验票，验票通过后，您即可上车。</p>
       
      <h3 class="h3">支付须知</h3>
      <p class="p">1.本客户端购票支持银联支付、支付宝支付和微信支付。</p>
      <p class="p">2.请您在生成订单后10分钟之内完成支付，超时未支付，该订单将在10分钟后失效。</p>
      <p class="p">
        3.请勿重复提交订单。当您进行支付后，请查询订单支付状态，系统如没有返回取票验证码等出现异常情况，切勿急于重复提交订单或者重复支付，请您拨打本客户端客服电话{{serviceTel}}咨询，以免造成不必要的损失。</p>
       
      <h3 class="h3">退票须知</h3>
      <p class="p">1.网上退票功能将在发车后关闭，关闭后不能办理退票手续。</p>
      <p class="p">2.根据交通运输部《汽车客运站收费规则》中第十五条关于规定退票手续费的标准如下所列（退票费直接从购票款中扣划）：<br/>
        A、当次客运班车开车时间两小时前办理退票，按票面金额的10%收取退票费，不足5角不计收，不足1元按5角计收；<br/>
        B、当次客运班车开车时间前两小时以内办理退票，按票面金额的20%收取退票费，不足5角不计收，不足1元按5角计收；<br/>
        C、当次客运班车发车后，不再办理退票；<br/>
        因各车站退票规定有差异，本网站将以各车站实际规定代扣退票手续费，若有疑问请咨询始发站。</p>
      <p class="p">3.因为您已经使用了本网站的购票服务，因此退票时，服务费是不退还的。</p>
      <p class="p">4.退票手续费发票须前往始发车站办理，具体领取时限及领取规则以各车站实际规定为准。</p>
    </notice>

    <p class="firm-name-box line line-x" v-if="ticketInfo.firmName">
      <span v-text="ticketInfo.firmName"></span>
      <i class="icon-v"></i>
    </p>

    <p class="warning-tips mar-t-20">1、当前产品暂不支持在线退票，若需退票，请至汽车站办理，以免耽误行程。</p>
    <p class="warning-tips">2、服务费包含手续费、短信费。</p>

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
          <input type="button" @click="orderCreateHandel('station')" :disabled="disableBtn" class="button button-primary" :value="isFeeder ? '下一步' : '提交订单'"/>
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
              {{stationTicketPrice | formatPrice}} × {{passengerNum}}人
            </span>
          </p>
          <p v-if="servicePrice > 0">
            <span class="price-d-tit">服务费用</span>
            <span>{{ servicePrice | formatPrice }}</span>
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
  import Notice from 'appComponents/notice/index'
  import TicketInfo from 'components/ticket-info/index'
  import PassengerAdd from 'appComponents/orderCreateService/passengerAdd'
  import InsureSelect from 'appComponents/orderCreateService/insureSelect'
  import Activity from 'appComponents/orderCreateService/activity'
  import Coupon from 'appComponents/orderCreateService/coupon'
  import Score from 'appComponents/orderCreateService/score'
  import ScoreRuleDialog from 'appComponents/dialog/scoreRuleDialog'
  import PayDialog from 'appComponents/dialog/payDialog'
  import { Group, PopupPicker } from 'vux'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      Notice,
      TicketInfo,
      PassengerAdd,
      InsureSelect,
      Activity,
      Coupon,
      Score,
      ScoreRuleDialog,
      PayDialog,
      Group,
      PopupPicker
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        STATION_BUS: TOOL.STATION_BUS,
        ticketInfo: {
          aAddress:{},
          bAddress:{},
        },
        carryKidSetting: {
          canCarryKid: false,
          maxNumber: 0
        },
        noticeShow: false, //订票、乘车、退票须知
        priceMore: false,
        showPriceDetail: false,
        orderData: {
          formId: TOOL.getTimeStamp(),
          skuId: '',
          productTypeLevelOne: '',
          passengers: [],
          onStation: TOOL.placeHolder.onStation,
          offStation: TOOL.placeHolder.offStation,
          onSiteId: '',
          offSiteId: '',
          contactName: '',
          contactTelephone: '',
          insureTypeId: '', //保险id
          totalPrem: 0, //保险价格
          needInvoice: false, //是否需要发票（0:不需要，1:需要）
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: false,
          useScore: false,
          integralExId: '',
          integralType: 1, // 积分兑换类型 0：兑换产品，1：积分抵现
          integralPrice: 0, //抵用积分
          outStation: false,
        },
        needServiceFee: '', //是否需要服务费
        servicePrice: 0, //服务费
        disableBtn: false,
        serviceTel: appStorage.get('serviceTel'),
        serviceTypeDTO:{},
        isAfterSale:'',
        stationTicketPrice: 0,
      }
    },
    computed: {
      totalPrice () {
        this.passengerNum = this.orderData.passengers.length
        if (this.passengerNum > 0) {
          let ticketPrice = this.stationTicketPrice * this.passengerNum

          if (this.needServiceFee) {
            if(this.orderData.onSiteId){
              this.servicePrice = this.ticketInfo.onStation.serviceFee || 0
            }else{
              //  票价： 10 ≥ N                 手续费：0.5
              //  票价： 10 < N ≤ 30          手续费：1.0
              //  票价： 30 < N ≤ 50          手续费：2.0
              //  票价： 50 < N                手续费：3.0
              if (ticketPrice <= 10) {
                this.servicePrice = 0.5
              } else if (ticketPrice > 10 && ticketPrice <= 30) {
                this.servicePrice = 1
              } else if (ticketPrice > 30 && ticketPrice <= 50) {
                this.servicePrice = 2
              } else {
                this.servicePrice = 3
              }
            }
          }

          if(this.orderData.integralExId){
            this.integralPrice = this.orderData.integralPrice * this.scoreRule.exchangeAmount / this.scoreRule.baseUseNum
          }else{
            this.integralPrice = 0
          }
          this.priceMore = true
          return this.stationTicketPrice * this.passengerNum  + this.servicePrice + this.orderData.totalPrem * this.passengerNum - this.reducedAmount - this.orderCouponPrice - this.integralPrice
        } else {
          this.priceMore = false
          return 0
        }
      },
      isFeeder () {
        let serviceInfoDTOs = this.serviceTypeDTO || []
        let deliveryService = false, pickUpService = false;
        for(let i = 0; i < serviceInfoDTOs.length; i++){
          if(serviceInfoDTOs[i].serviceType === 1){
            deliveryService = true
          }
          if(serviceInfoDTOs[i].serviceType === 0){
            pickUpService = true
          }
        }
        return deliveryService || pickUpService
      }
    },
    mounted () {
      this.orderData.skuId = this.$route.query.skuId
      if (appStorage.get('X-Auth-Token')) {
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        this.orderData.contactTelephone = usrInfo.phone
      }

      /**
       * 本地没有缓存数据才查询
       * 本地缓存数据后直接从本地获取数据
       */
      if (!appStorage.get(this.pageRouter)) {
        this.schBusDetailById()
      } else {
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        this.ticketInfo = localData.ticketInfo
        this.needServiceFee = localData.needServiceFee
        this.serviceTypeDTO = localData.serviceTypeDTO
        this.isAfterSale = localData.isAfterSale
        delete localData.ticketInfo
        delete localData.needServiceFee
        delete localData.serviceTypeDTO
        delete localData.isAfterSale
        this.orderData = Object.assign(this.orderData, localData)
        this.orderData.productTypeLevelOne = this.ticketInfo.productTypeLevelOne
        this.orderData.onStation = this.ticketInfo.aAddress.detailAddress
        this.orderData.offStation = this.ticketInfo.bAddress.detailAddress

        if(this.ticketInfo.onStation){
          this.orderData.onStation = this.ticketInfo.onStation.stationName
          this.orderData.onSiteId = this.ticketInfo.onStation.siteId
          this.orderData.outStation = this.ticketInfo.onStation.type !== 1
        }
        if(this.ticketInfo.offStation){
          this.orderData.offStation = this.ticketInfo.offStation.stationName
          this.orderData.offSiteId = this.ticketInfo.offStation.siteId
        }
        this.stationTicketPrice = this.ticketInfo.price
        if(this.orderData.onSiteId){
          this.stationTicketPrice = this.ticketInfo.onStation.price || this.ticketInfo.price
        }
        this.initActivityAndCoupon()
        this.visitLog()
        this.sharePage()
      }

    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData;
        localData.ticketInfo = this.ticketInfo
        localData.needServiceFee = this.needServiceFee
        localData.serviceTypeDTO = this.serviceTypeDTO
        localData.isAfterSale = this.isAfterSale
        appStorage.set(this.pageRouter, JSON.stringify(localData))
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
      schBusDetailById () {
        this.$store.commit('UPDATE_LOADING', true)
        api.schBusDetailById(this.orderData.skuId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.ticketInfo = data.resultData.stationSku
            this.serviceTypeDTO = data.resultData.serviceInfoDTOs
            this.needServiceFee = data.resultData.needServiceFee
            this.isAfterSale = data.resultData.isAfterSale
//            this.carryKidSetting = this.ticketInfo.carryKidSetting
            this.orderData.productTypeLevelOne = this.ticketInfo.productTypeLevelOne
            this.orderData.onStation = this.ticketInfo.aAddress.detailAddress
            this.orderData.offStation = this.ticketInfo.bAddress.detailAddres
            this.initActivityAndCoupon()
            this.visitLog()
            this.sharePage()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.stationTicketPrice
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
        this.saveForm()
        this.$router.push({
          name: 'station',
          query: {
            productId: this.ticketInfo.productId,
            fromPageRouter: this.pageRouter,
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
            maxBuyNumber: this.ticketInfo.maxBuyNumber,
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

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .ticket-info {
    display: flex;
    background-color: #fff;
    li {
      flex: 1;
      height: 30px;
      line-height: 30px;
      margin: 15px 0;
      text-align: center;
      font-size: 24px;
      color: #929292;
    }
  }

  .warning-tips{
    margin-bottom: 10px;
    line-height:1.5;
    font-size:24px;
    color:#999;
    padding:0 20px;
  }
</style>
