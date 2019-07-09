<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <carpooling-info
            :info-data="ticketInfo"
            :price-type="3"
            :show-service="false"
            :show-tips="true"
            :tips-type="pageRouter">
    </carpooling-info>

    <div class="form-box">
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
              {{ skuPrice.date | formatDate('monthDay') }}&nbsp;&nbsp;&nbsp;&nbsp;<em>¥{{skuPrice.charterPrice}}</em>
            </span>
        <span class="sig-date-price sig-date-tips" v-show="!skuPrice.date">请选择乘车时间</span>
        <i class="icon-r-jt"></i>
      </div>
      <div class="input-inline selector-input">
        <label>出发时间</label>
        <input type="text" placeholder="请选择出行时间" v-mobitime:startConfig="startupTime" readonly/>
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
    <div class="form-box line line-x-t line-x-b mar-t-20">
      <div class="input-inline line line-x-t">
        <label>手机号码</label>
        <input type="tel" v-model="orderData.contactTelephone" placeholder="必填，接收车票信息" maxlength="11"/>
      </div>
    </div>

    <activity :optimal-activity="optimalActivity"
              :activity-list="activityList"
              :use-activity="orderData.useActivity"
              @change="checkActivity"
              @changeActivity="changeActivity">
    </activity>

    <coupon :order-coupon-price="orderCouponPrice" @jumpToSelectCoupon="jumpToSelectCoupon"></coupon>

    <div class="form-box pad-0-inner-20 person-info line line-x-t mar-t-20">
      <div class="check-box line line-x-b" @click="checkPayType">
        全额支付、优先派车
        <input class="hide" type="checkbox" v-model="orderData.payType" :true-value="1" :false-value="2">
        <i class="icon-check"></i>
      </div>
      <div class="check-box line line-x-b" @click="handleNeedInvoice">
        <p v-if="!(orderData.needInvoice&&orderData.invoice)">
            是否需要发票
        </p>
        <p class="check-box-two clearfix" v-if="orderData.needInvoice&&orderData.invoice">
          <span class="check-box-up pull-left">是否需要发票</span>
          <br>
          <span class="check-box-down pull-left">发票抬头：{{orderData.invoice.invoiceTitle || ''}}</span>
        </p>
        <!--this.orderData.invoice-->
        <input class="hide" type="checkbox" v-model="orderData.needInvoice" :true-value="true" :false-value="false">
        <i class="icon-check"></i>
      </div>
      <div class="input-inline line line-x-b">
        <label>订票留言：</label>
        <input class="has-clear-value" type="text" id="remark" v-model="orderData.remark"
               placeholder="选填，可填写您的需求" maxlength="50"/>
        <div class="clear-value" v-show="showClearRemark" @click="clearRemark"></div>
      </div>
    </div>
    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left clearfix" @click="showPriceDetail = !showPriceDetail">
          <label v-text="orderData.payType === 1 ? '共计' : '最低首付'"></label>
          <span v-if="showPrice">{{ totalPrice | formatPrice }}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input type="button" @click="orderCreateCharterLine" :disabled="disableBtn" class="button button-primary" value="下一步"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">包车费用</span>
            <span v-text="">{{ orderData.price | formatPrice('yuan') }}</span>
          </p>
          <p v-if="ticketInfo.serviceFee > 0">
            <span class="price-d-tit">服务费用</span>
            <span>{{ticketInfo.serviceFee | formatPrice('yuan')}}</span>
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
      Activity,
      Coupon,
      CarpoolingInfo
    },
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        showClearRemark: false,
        ticketInfo: {
          sellPoints:[]
        }, //产品详情
        priceMore: false,
        showPriceDetail: false,
        orderData: {
          formId: TOOL.getTimeStamp(),
          productId: '',
          startupTime: '',
          contactName: '',
          carBrand: '', // 车辆品牌型号 ,
          price: 0, // 支付金额（主要用户支付定金判断） ,
          payType: 2, // 支付方式 1：全款 2：只支付定金 ,
          needInvoice: false, // 是否需要发票
          totalSeats: '', // 核载人数 ,
          contactTelephone: '',
          remark: '',
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
        charterPrice: 0, //全额支付金额
        charterPrePayPrice: 0, //最低预付金额
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
    computed: {
      /**
       * 计算总价格
       * 注： 只有付全款才享受优惠
       */
      totalPrice () {
        if (this.orderData.payType === 1 && this.skuPrice.charterPrice) {
          this.priceMore = true
          this.charterPrice = this.skuPrice.charterPrice
          this.orderData.price = this.skuPrice.charterPrice
          return this.orderData.price + (this.ticketInfo.serviceFee || 0) - this.reducedAmount - this.orderCouponPrice
        } else if (this.orderData.payType === 2 && this.skuPrice.charterPrePayPrice) {
          this.priceMore = true
          this.charterPrePayPrice = this.skuPrice.charterPrePayPrice
          this.orderData.price = this.skuPrice.charterPrePayPrice
          return this.orderData.price + (this.ticketInfo.serviceFee || 0)  - this.reducedAmount - this.orderCouponPrice
        } else {
          this.orderData.price = 0
          return 0
        }
      },
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
        }else{
          this.emptyData()
        }
      },
      'orderData.remark' (newVal, val) {
        if (newVal && newVal !== val) {
          this.showClearRemark = true
        }
      },
      startupTime () {
        this.initActivityAndCoupon()
      },
      'orderData.payType' (newVal) {
        if(newVal === 1){
          this.initActivityAndCoupon()
        }else{
          this.initActivityAndCoupon()
          this.reducedAmount = 0
          this.orderCouponPrice = 0
          this.orderData.discountInfo.userCouponId = ''
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

      // 处理是否需要发票
      handleNeedInvoice () {
        this.orderData.needInvoice = !this.orderData.needInvoice;
        appStorage.set('needInvoice', 0);
        if(this.orderData.needInvoice) {
            this.saveForm();
            this.$router.push({
                name: 'invoice',
                query: {
                    edit: 1
                }
            })
        } else {
            this.orderData.invoice = null;
        }
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
              selectData.push({
                text: lineServicePlan[i].carBrand + ' 载客' + lineServicePlan[i].seats + '人 ',
                value: lineServicePlan[i].totalSeats + '|' + lineServicePlan[i].carBrand + '|' + i
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
          if(appStorage.get('needInvoice') == '1') {
              this.orderData.needInvoice = true;
          } else {
              this.orderData.needInvoice = false;
          }
          if(this.orderData.needInvoice) {
            if(appStorage.get('invoice')) {
                this.orderData.invoice = JSON.parse(appStorage.get('invoice'));
            } else {
                this.orderData.invoice = null;
            }
          }
          this.initActivityAndCoupon()
        }else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.orderData.contactTelephone = usrInfo.phone
        }
      },

      initActivityAndCoupon () {
        this.showPrice = false
        if(this.orderData.payType === 1){
          this.ticketAmount = this.skuPrice.charterPrice
        }else{
          this.ticketAmount = this.skuPrice.charterPrePayPrice
        }

        this.ticketTotalAmount = this.ticketAmount
        this.passengerNum = 1
        let time = this.startupTime || '00:00'
        let startupTime = this.skuPrice.date + ' ' + time+ ':00'
        this.activityAndCounponParam = {
          type: 'productId',
          id: this.orderData.productId,
          productId: this.ticketInfo.productId,
          productTypeLevelOne: this.ticketInfo.productTypeLevelOne,
          productTypeLevelTwo: this.ticketInfo.productTypeLevelTwo,
          startupTime: startupTime
        }
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
            passengerNum: 1,
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
       * 拨打线路经理电话
       */
      callJingli (tel) {
        this.$store.dispatch('showConfirm', {
          content: '<p style="text-align:center;">线路经理电话：' + tel + '</p>',
          confirmText: '拨打',
          onConfirm: () => {
            location.href = 'tel:' + tel
          }
        })
      },

      jumpToSkuSelect () {
        if (!this.lineServicePlans) {
          this.$store.dispatch('showError', '请选择具体车辆');
          return;
        }
        this.saveForm()
        let nowStamp = Date.parse(TOOL.newGetDate({date: this.orderData.checkTime, type: 'formatDate'}))
        let startTime = new Date(nowStamp + this.ticketInfo.charterPreOrderMinTime * 24 * 60 * 60 * 1000)
        let endTime = new Date(nowStamp + this.ticketInfo.charterPreOrderMaxTime * 24 * 60 * 60 * 1000)

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
       * 跳转上下车站点选择
       * @param stationName 站点类型：onStation, offStation
       * 注：如只有一个站点不跳转站点选择页面
       */
      jumpToStation (stationName) {
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
       * 选择预付金额
       */
      checkPayType () {
        if (this.orderData.payType === 2) {
          this.orderData.payType = 1
        } else {
          this.orderData.payType = 2
        }
      },

      /**
       * 删除备注内容
       */
      clearRemark () {
        this.orderData.remark = ''
        this.showClearRemark = false
        $('#remark').focus()
      },

      /**
       * 新增订单
       */

      orderCreateCharterLine () {
        let validata = TOOL.formValidate([
          {value: this.lineServicePlans, emptyTips: '请选择具体车辆'},
          {value: this.skuPrice.date, emptyTips: '请选择乘车日期'},
          {value: this.startupTime, emptyTips: '请选择出发时间'},
          {value: this.orderData.onStation.name, emptyTips: '请选择上车地点'},
          {value: this.orderData.offStation.name, emptyTips: '请选择下车地点'},
          {value: this.orderData.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        if (this.orderData.payType == 2) {
          validata = TOOL.formValidate([
            {value: this.orderData.price, emptyTips: '预付金额不能为空', regName: 'floatNumber', regTips: '预付金额需为大于0的数字'},
          ]);

          if (!validata.valid) {
            this.$store.dispatch('showError', validata.msg);
            return false;
          }
        }

        let orderData = Object.assign({}, this.orderData)
        this.disableBtn = true
        this.$store.commit('UPDATE_LOADING', true)

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

  .icon-phone{
    display:block;
    flex:1;
    background:url("../../../../assets/charter/phone-carpooling-manage.png") no-repeat right center;
    background-size:50px 50px;
  }
</style>
