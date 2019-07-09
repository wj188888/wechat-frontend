<template>
  <div>
    <c-header :title="title"></c-header>
    <div class="app-container">
      <div class="app-main scrollingBox has-abs-bottom">
        <div class="order-ticket line-x-b">
          <order-base-info :data="detailData">
            <p class="more-charter-info" @click="jumpToCharterQuoteInfo">查看需求信息</p>
          </order-base-info>
          <div class="charter-price-box line line-x-t" @click="showDialog = true">
            <p>企业报价</p>
            <p>{{quoteData.totalPrice | formatPrice}} <i class="icon-charter-price"></i></p>
          </div>
          <p class="carpooling-warning-tips line line-x">无论是全额付还是预付包车款，只要您对最终报价方案不接受，均会自动全额退款。</p>
        </div>
        <div class="form-box line line-x-t line-x-b mar-t-20">
          <div class="input-inline line line-x-t">
            <label>手机号码</label>
            <input type="tel" v-model="detailData.contactTelephone" placeholder="必填，接收车票信息" readonly/>
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
            <input class="hide" type="checkbox" v-model="orderData.payType" :true-value="1"
                   :false-value="2">
            <i class="icon-check"></i>
          </div>
          <div class="input-inline line line-x-t" :class="{'dd-text-active': noticeShow}"
               v-if="detailData.preOrderNotice" @click="noticeShow = !noticeShow">
            <label>包车预定须知</label>
            <i class="icon-r-jt"></i>
          </div>

          <notice :show="detailData.preOrderNotice && noticeShow" :text="detailData.preOrderNotice"></notice>
        </div>
      </div>
    </div>

    <div class="abs-bottom-box">
      <div class="buy-left clearfix" @click="showPriceDetail = !showPriceDetail">
        <label v-text="orderData.payType === 1 ? '共计' : '最低首付'"></label>
        <span v-if="showPrice">{{ totalPrice | formatPrice }}</span>
        <span class="detail" v-show="priceMore">详情</span>
        <i class="yellow-jt-up" v-show="priceMore"></i>
      </div>
      <div class="buy-right">
        <input type="button" @click="createCustomerCharter" :disabled="disableBtn" class="button button-primary" value="下一步"/>
      </div>
    </div>

    <div class="price-detail" v-show="priceMore && showPriceDetail">
      <div class="price-mask" @click="showPriceDetail = false"></div>
      <div class="price-detail-box">
        <p v-if="orderData.payType === 1">
          <span class="price-d-tit">企业报价</span>
          <span>{{quoteData.totalPrice | formatPrice }}</span>
        </p>
        <p v-if="orderData.payType === 2">
          <span class="price-d-tit">定金要求</span>
          <span>{{ detailData.totalPrice | formatPrice }}</span>
        </p>
        <p v-if="detailData.depositAmount > 0">
          <span class="price-d-tit">包车订金</span>
          <span class="price-reduce">- {{detailData.depositAmount | formatPrice}}</span>
        </p>
        <p v-if="quoteData.serviceFee > 0&&orderData.payType === 2">
          <span class="price-d-tit">服务费用</span>
          <span class="price-reduce">+ {{quoteData.serviceFee | formatPrice}}</span>
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

    <div class="dialog-demo" v-show="showDialog">
      <div class="company-quote">
        <h1 class="company-quote-tit">企业报价</h1>
        <div class="company-quote-table">
          <table>
            <tr>
              <td class="text-left">品牌名</td>
              <td>座位数</td>
              <td>车辆数</td>
              <td class="text-right">价格</td>
            </tr>
            <tr v-for="dataList in quoteData.dataList">
              <td class="text-left" v-text="dataList.carBrand">别克</td>
              <td v-text="dataList.seats">7座</td>
              <td v-text="dataList.carNum">1辆</td>
              <td class="text-right">{{dataList.charterPrice}}{{quoteData.type === 1 ? '元':'元/天'}}</td>
            </tr>
          </table>
          <div class="company-text mar-t-10">
            <p>使用天数</p>
            <p v-if="quoteData.type === 1">{{enquiryData.travelDays}}天</p>
            <p v-else>&times;{{enquiryData.travelDays}}</p>
          </div>
          <div class="company-text mar-t-10" v-if="quoteData.invoicePrice > 0">
            <p>发票费用</p>
            <p>{{ quoteData.invoicePrice | formatPrice }}</p>
          </div>
          <div class="company-text mar-t-10" v-if="quoteData.subsidizedFood > 0">
            <p>餐饮补贴</p>
            <p>{{ quoteData.subsidizedFood | formatPrice }}</p>
          </div>
          <div class="company-text mar-t-10" v-if="quoteData.subsidizedAccommodation > 0">
            <p>住宿补贴</p>
            <p>{{ quoteData.subsidizedAccommodation | formatPrice }}</p>
          </div>
          <div class="company-text mar-t-10" v-if="quoteData.serviceFee > 0">
            <p>服务费用</p>
            <p>{{ quoteData.serviceFee | formatPrice }}</p>
          </div>
          <div class="company-text mar-t-30">
            <p>合计</p>
            <p>{{ quoteData.totalPrice | formatPrice }}</p>
          </div>
        </div>
      </div>
      <div class="close-icon" @click="showDialog = false"></div>
    </div>
  </div>

</template>
<script>
  import CHeader from 'components/c-header/index'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index'
  import Activity from 'appComponents/orderCreateService/activity'
  import Coupon from 'appComponents/orderCreateService/coupon'
  import Notice from 'appComponents/notice/index'
  import service from 'mixins/service'

  export default {
    components: {
      CHeader,
      OrderBaseInfo,
      Activity,
      Coupon,
      Notice
    },
    mixins: [service],
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        detailData: {
          aAddress:{},
          bAddress:{},
        },
        showPriceDetail:false,
        priceMore: false,
        noticeShow: false,
        orderData: {
          formId: TOOL.getTimeStamp(),
          productTypeLevelOne: '',
          enqueryId: '',
          productId: '',
          payType: 2, // 支付方式 1：全款 2：最小预定金,
          price: '',
          firmQuoteId: '',
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
        },
        disableBtn: false,
        showDialog: false,
        quoteData: {
          dataList:[]
        },  //报价信息
        enquiryData: {}, //报价信息
      }
    },
    computed: {
      /**
       * 计算总价格
       * 注： 只有付全款才享受优惠
       */
      totalPrice () {
        this.priceMore = this.quoteData.serviceFee > 0 || this.reducedAmount > 0 || this.orderCouponPrice > 0  || this.detailData.depositAmount > 0
        if (this.orderData.price > 0) {
            if(this.orderData.payType == 2) {
                return this.orderData.price + (this.quoteData.serviceFee || 0) - this.reducedAmount - this.orderCouponPrice
            } else if (this.orderData.payType == 1) {
                return this.orderData.price - this.reducedAmount - this.orderCouponPrice
            }

        } else {
          this.priceMore = false
          return 0
        }
      }
    },
    watch: {
        'detailData.serviceFee'(newVal) {
            console.log(newVal);
        }
    },
    mounted(){
      this.orderData.enqueryId = this.$route.query.enqueryId
      this.orderData.firmQuoteId = this.$route.query.firmQuoteId
      this.enquiryFindGenerateOrderInfo()
      this.quoteFind()
      this.enquiryFind()
    },
    methods: {

      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      enquiryFindGenerateOrderInfo () {
        api.enquiryFindGenerateOrderInfo({
          enquiryId: this.orderData.enqueryId,
          firmQuoteId: this.orderData.firmQuoteId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.detailData = data.resultData
              console.log(this.detailData);
            this.title = data.resultData.aAddress.city + ' — ' + data.resultData.bAddress.city

            this.orderData.productTypeLevelOne = this.detailData.productTypeLevelOne
            this.orderData.productId = this.detailData.productId
            if(this.detailData.minPrePrice > 0){
              this.orderData.price = this.detailData.minPrePrice
            }else{
              this.orderData.price = this.detailData.totalPrice
              this.orderData.payType = 1
            }
            console.log(this.orderData.price);
            this.initActivityAndCoupon()
            this.visitLog()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.orderData.price
        this.ticketTotalAmount = this.ticketAmount
        this.passengerNum = 1
        this.activityAndCounponParam = {
          type: 'productId',
          id: this.detailData.productId,
          productId: this.detailData.productId,
          productTypeLevelOne: this.detailData.productTypeLevelOne,
          productTypeLevelTwo: this.detailData.productTypeLevelTwo,
          startupTime: this.detailData.startupTime
        }
        if(this.detailData.storeId && this.detailData.storeId !== appStorage.get('StoreId')){
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
            productId: this.detailData.productId,
            productTypeLevelOne: this.detailData.productTypeLevelOne,
            startupTime: this.detailData.startupTime,
            passengerNum: 1,
            ticketAmount: this.ticketAmount,
            ticketTotalAmount: this.ticketTotalAmount,
            activityId: this.orderData.discountInfo.activityId,
            price: this.ticketTotalAmount - this.reducedAmount
          }
        })
      },

      visitLog () {
        TOOL.saveVisitLogs({
          url: this.$route.name,
          productId: this.detailData.productId,
          productTypeLevelOne: this.detailData.productTypeLevelOne,
          productTypeLevelTwo: this.detailData.productTypeLevelTwo
        })
      },

      /**
       * 跳转需求详情页面
       */
      jumpToCharterQuoteInfo () {
        this.saveForm()
        this.$router.push({
          name: 'companyQuoteInfo',
          query: {
            enqueryId: this.$route.query.enqueryId
          }
        })
      },

      /**
       * 选择预付金额
       */
      checkPayType () {
        if (this.orderData.payType === 2) {
          this.orderData.price = this.detailData.totalPrice
          this.orderData.payType = 1
        } else {
          if(this.detailData.minPrePrice === 0){
            this.$store.dispatch('showError', '抱歉，预付状态不可用')
            return
          }
          this.orderData.price = this.detailData.minPrePrice
          this.orderData.payType = 2
        }
        this.initActivityAndCoupon ()
      },

      /**
       * 司机企业报价
       */
      createCustomerCharter () {
        if (!appStorage.get('X-Auth-Token')) {
          this.$store.dispatch('showError', TOOL.notLoginText)
          store.dispatch('UPDATE_SHOWLOGIN', true)
          return;
        }
        /*let aipData = Object.assign({},this.orderData);
        aipData.price = this.totalPrice.toFixed(2);*/

        this.disableBtn = true
        this.$store.commit('UPDATE_LOADING', true)
        api.createCustomerCharter(this.orderData).then(res => {
          const result = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (result.resultCode === '0') {
            this.$router.push({
              name: 'orderDetail',
              query: {
                orderId: result.resultData
              }
            })
          } else if (result.resultCode === '40001') {
            this.disableBtn = false
            this.orderData.formId = TOOL.getTimeStamp()
            this.$store.dispatch('showConfirm', {
              title: '确认',
              content: '您有一个尚未支付的包车订单，是否立即支付',
              confirmText:'立即支付',
              cancelText:'查看详情',
              onConfirm: ()=>{
                interfaceApi.wxPay({
                  tradeNo: result.resultMsg,
                  productTypeLevelOne: this.orderData.productTypeLevelOne,
                  wxPaySuccess: TOOL.wxPaySuccess,
                  wxPayFail: TOOL.wxPayFail,
                  price: this.totalPrice
                })
              },
              onCancel: () =>{
                this.$router.push({
                  name: 'orderDetail',
                  query: {
                    orderId: result.resultMsg
                  }
                })
              }
            })
          } else {
            this.disableBtn = false
            this.orderData.formId = TOOL.getTimeStamp()
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 查询询价报价列表
       */
      enquiryFind () {
        api.enquiryFindById(this.$route.query.enqueryId).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode === '0') {
            this.enquiryData = result.resultData
            //this.clocker.time = result.resultData.enquiryInvalidTime
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

      /**
       * 查询询价报价列表
       */
      quoteFind () {
        api.quoteFind({
          enquiryId: this.$route.query.enqueryId
        }).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode === '0') {
            if(result.resultData.content.length){
              this.quoteData = result.resultData.content[0]
                console.log(this.quoteData);
            }else{
              this.$router.replace({
                name: 'charterFail',
                query: {
                  enqueryId: this.$route.query.enqueryId
                }
              })
            }
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      },

    }
  }
</script>
<style lang="less" scoped>
  .sig-date-price {
    font-size: 28px;
    color: #121212;
  }
  .order-ticket {
    margin-bottom: 20px;
    background-color: #fff;
    overflow: hidden;
  }

  .more-charter-info {
    position: relative;
    height: 60px;
    line-height: 60px;
    margin-top: 10px;
    text-align: center;
    font-size: 24px;
    color: #272a35;
    &:after {
       content: ' ';
       display: inline-block;
       margin: 0 5px;
       border: 10px solid transparent;
       border-left-color: #121212;
       vertical-align: middle;
     }
  }

  .charter-price-box {
    height: 88px;
    line-height: 88px;
    padding: 0 20px;
    background-color: #f9f9f9;
    p {
      float: left;
      width: 50%;
      height: 100%;
      font-size: 28px;
      color: #272a35;
      &:last-child {
         text-align: right;
         color: #ff6600;
       }
    }
    .icon-charter-price {
      display: inline-block;
      width: 30px;
      height: 100%;
      background: url('../../../../assets/charter/info-on.png') no-repeat right center;
      background-size: 24px 24px;
      vertical-align: middle;
    }
  }

  .dialog-demo {
    width: 100%;
    height: 100%;
    background: #fff;
    position: fixed;
    z-index: 1000;
    .company-quote {
      padding: 20px 30px;
      overflow: hidden;
      margin-top: 150px;
    }
    .company-quote-tit {
      display: block;
      height: 96px;
      line-height: 96px;
      text-align: center;
      color: #121212;
      font-size: 30px;
    }
    .company-quote-table {
      padding: 0 40px;
      font-size: 28px;
      color: #4C4C4C;
      table {
        width: 100%;
      }
      td {
        line-height: 50px;
        text-align: center;
      }
      .text-left {
        text-align: left;
      }
      .text-right {
        text-align: right;
      }
      .company-text {
        line-height: 50px;
        overflow: hidden;
        p {
          float: left;
          &:last-child {
             float: right;
          }
        }
      }
      .mar-t-30 {
        margin-top: 30px;
      }
      .mar-t-10 {
        margin-top: 10px;
      }
    }
    .close-icon {
      position: fixed;
      bottom: 30px;
      left: 50%;
      width: 95px;
      height: 95px;
      background: url("../../../../assets/charter/close.png") no-repeat;
      background-size: 91px 91px;
      margin-left: -45px;
      z-index: 2000;
    }
  }
</style>
