<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="order-status-box">
      <clocker class="clocker" :time="clocker.time" slot="value" @on-finish="finish" v-show="detailData.status == 0 && clocker.timeStatus">
        <span>%_M1</span>
        <span>%_M2</span>
        <span>:</span>
        <span>%_S1</span>
        <span>%_S2</span>
      </clocker>
      <p class="order-status">
          <span>
            {{detailData.status | rentStatusTxt}}
          </span>
      </p>
      <p class="order-status-tips">
        <!-- -订单状态：-1未知状态 0待支付，1已支付，2已失效，3已退款,4未评价（已还车-自驾租车状态），5已评价，6已过期 7已取消（自驾租车状态） 8已取车（自驾租车状态） -->
        <span v-if="detailData.status == 0">请在截止时间前完成付款，到期后订单将自动取消</span>
        <span v-if="detailData.status == 1">请您在规定的时间内前来取车</span>
        <span v-if="detailData.status == 2">期待您的下次光临</span>
        <span v-if="detailData.status == 3">已成功为您办理退票，车票款将于1-3个工作日内返还到您的账户上</span>
        <span v-if="detailData.status == 4">您的班车已准时出发，请您及时评价</span>
        <span v-if="detailData.status == 5">感谢您的支持</span>
        <span v-if="detailData.status == 6">您的订单已过期</span>
        <span v-if="detailData.status == 7">已为您取消订单，期待您的下次光临</span>
        <span v-if="detailData.status == 8">您已成功取车，祝你旅途愉快</span>
        <span v-if="detailData.status === 11">正在申请退款中，请您耐心等待</span>

      </p>
    </div>

    <rent-address :detailData="detailData"></rent-address>


    <div class="ticket-info-order pad-b-0 mar-t-20">
      <p>
        <span class="left-span">订单编号</span>
        <span class="right-span" v-text="detailData.code"></span>
      </p>
      <p>
        <span class="left-span">订单日期</span>
        <span class="right-span" v-text="detailData.createdTime"></span>
      </p>
      <div class="abs-tit-box orange">
        <p class="abs-tit">车辆租金</p>
        <p class="right-text">
          <span>{{detailData.rentalFee | formatPrice}}</span>
        </p>
      </div>
      <p v-if="detailData.baseInsurance > 0">
        <span class="left-span">基本保险费</span>
        <span class="right-span">
              {{detailData.baseInsurance | formatPrice}}
            </span>
      </p>
      <p v-if="detailData.serviceFee > 0">
        <span class="left-span">手续费</span>
        <span class="right-span">{{ detailData.serviceFee | formatPrice }}</span>
      </p>
      <p v-if="detailData.fullInsuranceService > 0">
        <span class="left-span">全面保障费</span>
        <span class="right-span">{{ detailData.fullInsuranceService | formatPrice }}</span>
      </p>
      <p class="text-larger text-price-total line line-x-t">
        <span class="left-span">实付款</span>
        <span class="right-span orange">{{ detailData.orderFee | formatPrice }}</span>
      </p>
    </div>

    <div class="ticket-info-order pad-t-0 mar-t-20">
      <h2 class="ticket-h2 line line-x-b">
        押金
        <span class="f-s-20 c-f-888">取车和还车时刷信用卡授权</span>
      </h2>
      <p>
        <span class="left-span">租车押金</span>
        <span class="right-span">{{ detailData.rentalDeposit | formatPrice }}</span>
      </p>
      <p>
        <span class="left-span">违章押金</span>
        <span class="right-span">{{ detailData.returnDeposit | formatPrice }}</span>
      </p>
    </div>

    <div class="ticket-info-order pad-t-0 mar-t-20"
         v-if="detailData.contactName||detailData.idNo||detailData.contactTelephone"
    >
      <h2 class="ticket-h2 line line-x-b">驾驶员信息</h2>
      <p v-if="detailData.contactName">
        <span class="left-span">司机</span>
        <span class="left-span c-f-121212">{{detailData.contactName}}</span>
      </p>
      <p v-if="detailData.idNo">
        <span class="left-span">证件号</span>
        <span class="left-span c-f-121212">{{detailData.idNo}}</span>
      </p>
      <p v-if="detailData.contactTelephone">
        <span class="left-span">联系方式</span>
        <span class="left-span c-f-121212">{{detailData.contactTelephone}}</span>
      </p>
    </div>

    <div class="border mar-tb-20">
      <router-link class="inline-box" :to="{name: 'rentNotice'}">
        <span>租车须知</span>
        <i class="icon-r-jt"></i>
      </router-link>
    </div>

    <div class="online-service mar-t-20">
      <input type="button" class="button button-primary" value="联系客服" @click="callService(serviceTel)">
    </div>


    <div slot="footer">
      <div class="abs-bottom-box line line-x-t" v-if="detailData.status == 0">
        <div class="buy-right buy-w100">
          <p class="order-tips price">共计 <span>{{ detailData.orderFee | formatPrice }}</span></p>
          <input type="button" class="button button-empty-primary button-small radius-box" @click="payMoney" value="立即支付"/>
          <input type="button" class="button button-empty-gray button-small radius-box"  @click="cancleOrderAndTicket" value="取消订单"/>
        </div>
      </div>

      <div class="abs-bottom-box  line line-x-t" v-if="detailData.status == 1">
        <div class="buy-right buy-w100">
          <p class="order-tips price">共计 <span>{{ detailData.orderFee | formatPrice }}</span></p>
          <!--<input type="button" class="button button-empty-primary button-small radius-box" @click="showShare = true" value="邀请好友"/>-->
          <a @click="rentRefund"  class="button button-empty-gray button-small radius-box">申请退款</a>
        </div>
      </div>

      <!--<div class="abs-bottom-box  line line-x-t" v-if="detailData.status == 2 || detailData.status == 3 || detailData.status == 5 || detailData.status == 6">
        <div class="buy-right buy-w100">
          <a class="button button-primary" @click="againBuy">重新购买</a>
        </div>
      </div>-->

      <div class="abs-bottom-box line line-x-t" v-if="detailData.status == 4">
        <div class="buy-right buy-w100">
          <p class="order-tips icon-tips">为我们的车辆做个评价吧</p>
          <a class="button button-empty-primary button-small radius-box" @click="jumpToOederEval">去评价</a>
        </div>
      </div>
      <share-modal :show="showShare" @closeShare="showShare = false"></share-modal>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index.vue'
  import GroupStatus from 'appComponents/groupStatus/index.vue'
  import TicketNotice from 'components/ticketNotice/index.vue'
  import ShareModal from 'appComponents/shareModal/index.vue'
  import RentAddress from 'appComponents/rentAddress/index.vue'
  import phone from 'mixins/phone'

  import { Clocker, Swiper, SwiperItem, XDialog } from 'vux'

  export default {
    components: {
      MainBox,
      OrderBaseInfo,
      GroupStatus,
      TicketNotice,
      Clocker,
      Swiper,
      SwiperItem,
      XDialog,
      ShareModal,
      RentAddress
    },
    mixins: [phone],
    data () {
      //        订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期
      return {
        title: this.$route.meta.title,
        serviceTel: '',
        orderId: '',
        detailData: {
          aAddress:{},
          bAddress:{},
          allTime:{}
        },
        dispatchVehicles: [],
        ticketList: [], //可用车票列表，拼车为未成团不展示车票
        insurePrice: 0, //保险金额
        insuranceNum: 0, //购买保险数
        adultNum: 0,
        childNum: 0,
        ticketTipsShow: false, //退票须知
        refundNotice: '', //购票须知
        countState: false,
        clocker: {
          time: TOOL.newGetDate({date: new Date(), type: 'future'}),
          timeStatus: true
        },
        showDialog: false, // 控制弹窗
        dialogServiceCar: '',// 弹窗要显示的服务车辆信息
        showShare: false
      }
    },
    computed: {
      orderAmount () {
        let commissionPrice = this.detailData.commissionPrice || 0
        let invoicePrice = this.detailData.invoicePrice|| 0
        return this.detailData.amount - this.insurePrice * this.insuranceNum - commissionPrice - this.detailData.serviceFee - invoicePrice
      },
      /**
       * 退票按钮控制
       */
      isRefund () {
        let now = TOOL.newGetDate({type: 'holeDate'})
        let refund = true

        if(this.detailData.productTypeLevelOne === 'STATION_BUS' ||
          this.detailData.productTypeLevelTwo === 'LINE_CAR_POOL_BUS' ||
          this.detailData.productTypeLevelOne === 'CUSTOM_BUS'){
          refund = false
        }
//      && refund
        return TOOL.dateCompare(this.detailData.startupTime, now, 'datetime') > 0
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        if(appStorage.get('serviceTel')) {
          this.serviceTel = appStorage.get('serviceTel');
        }
        this.orderId = this.$route.query.orderId;
        this.orderDetailById();
//        this.dispatchVehicle();
      },
      getCarClass(type) {
        return 'car-type-'+type;
      },
      /**
       * 查找订单详情
       */
      orderDetailById () {
        this.$store.commit('UPDATE_LOADING', true)
        api.rentOrderDetailById({
          orderId:this.orderId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.detailData = data.resultData

            this.dateCompare(this.detailData.startTime,this.detailData.endTime);

            this.refundNotice = (this.detailData.productTypeLevelOne == 'LINE_BUS' || this.detailData.productTypeLevelOne == 'CUSTOM_BUS')? 'refundNotice2' : 'refundNotice1'

            this.adultNum = 0
            this.childNum = 0
            this.insuranceNum = 0

            if (data.resultData.status == 0) {
              this.clocker.time = data.resultData.paymentInvalidTime
              this.countState = true
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      dateCompare(startTime, endTime) {
        startTime = TOOL.changeDateStyle(startTime);
        endTime = TOOL.changeDateStyle(endTime);
        let compareMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        let days = Math.floor(compareMs/(3600000*24));
        let hours = Math.ceil((compareMs%(3600000*24))/3600000);
        this.detailData.allTime = {day: days, hour: hours};
        return {day: days, hour: hours}
      },


      finish () {
        this.clocker.timeStatus = false;
        this.initialize();
      },

      groupFinish () {
        this.orderDetailById();
      },

      /**
       *  订单支付
       */
      payMoney () {
        interfaceApi.wxPay({
          tradeNo: this.orderId,
          productTypeLevelOne: this.detailData.productTypeLevelOne,
          wxPaySuccess: TOOL.wxPaySuccess,
          wxPayFail: TOOL.wxPayFail,
          price: this.detailData.orderFee
        })
      },

      /**
       *  取消订单
       */
      cancleOrderAndTicket () {
          this.$router.push({
              name: 'rentCancelReason',
              query: {
                  orderId: this.orderId
              }
          })
      },

      /*
      * 申请退款
      * */
      rentRefund() {
        this.$store.dispatch('showConfirm', {
          title: '温馨提醒',
          content: '是否确定要申请退款？',
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.cancelRentOrder({
              orderId:this.orderId
            }).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode == '0') {
                this.$store.dispatch('showSuccess', '申请退款成功')
                setTimeout(() => {
                  location.reload(true);
                }, 1000);

                /*this.$router.replace({
                  name:'rentOrderDetail',
                  query: {
                    orderId: this.orderId
                  }
                })*/
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          },
          onCancel: () => {

          }
        })
      },

      /**
       * 再次购买
       */
      getSearchKey (address) {
        if(address.county) {
          if(address.town){
            return address.county + '('+ address.town +')'
          }else{
            return address.county
          }
        }
        return address.city
      },

      againBuy () {
        let routeName
        let type = this.detailData.productTypeLevelOne
        let queryData = {
          startPlace: this.getSearchKey(this.detailData.aAddress),
          endPlace: this.getSearchKey(this.detailData.bAddress),
          startTime: TOOL.newGetDate({type: 'holeDate'})
        }
        if(this.detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'){
          queryData = {
            startPlace: this.detailData.aAddress.searchShowAddress,
            endPlace: this.detailData.bAddress.searchShowAddress,
            startTime: TOOL.newGetDate({type: 'holeDate'})
          }
        }
        switch (type) {
          case 'CITY_BUS':
          case 'STATION_BUS':
            if(this.detailData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'){
              if(appStorage.get('indexRouter') === 'carpoolbusMap'){
                routeName = 'carpoolbusMap'
              }else{
                routeName = 'list'
              }
            }else{
              routeName = 'list'
            }
            break;
          case 'AIRPORT_BUS':
            if (this.detailData.airportType == 0) {
              routeName = 'airportPickList'
            } else {
              routeName = 'airportSendList'
            }
            break;
          case 'TRAIN_STATION_BUS':
            if (this.detailData.shuttleType == 0) {
              routeName = 'trainPickList'
              queryData.startPlace = this.detailData.aAddress.detailAddress
              queryData.endPlace = this.detailData.bAddress.searchShowAddress
            } else {
              routeName = 'trainSendList'
              queryData.startPlace = this.detailData.aAddress.searchShowAddress
              queryData.endPlace = this.detailData.bAddress.detailAddress
            }
            break;
          case 'SCENIC_BUS':
            routeName = 'scenicList'
            break;
          case 'SCHOOL_BUS':
            routeName = 'schoolList'
            break;
          case 'TOUR_BUS':
            routeName = 'sights'
            break;
          case 'WORK_BUS':
            routeName = 'workList'
            queryData = {
              onStation: JSON.stringify(this.detailData.onStation),
              offStation: JSON.stringify(this.detailData.offStation)
            }
            break;
          case 'CUSTOM_BUS':
            routeName = 'charterList'
            queryData = {}
            break;
          case 'LINE_BUS':
            routeName = 'carpoolingList'
            queryData = {productId: this.detailData.productId}
            break;
          case 'CAR_RENTAL':
            routeName = 'rent'
            queryData = {}
            break;
        }
        this.$router.push({
          name: routeName,
          query: queryData
        });
      },

      /**
       * 跳转评价
       */
      jumpToOederEval () {
        if (this.detailData.productTypeLevelOne == 'CUSTOM_BUS') {
          this.$store.dispatch('showError', TOOL.CUSTOM_BUS + '不支持评价')
          return
        }
        this.$router.push({
          name:'rentOrderEval',
          query: {
            orderId: this.detailData.id,
            productTypeLevelOne: this.detailData.productTypeLevelOne
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>



  .order-status-box {
    height: 170px;
    margin-bottom: 20px;
    padding: 20px;
    background-color: #ff9900;
    color: #fff;
    .order-status {
      margin: 22px 0 28px;
      font-size: 36px;
    }
    .order-status-tips {
      font-size: 24px;
      line-height: 1.414;
    }
    .clocker{
      position:absolute;
      right:20px;
      top:42px;
      font-size:28px;
    }
  }


  .ticket-h2 {
    height: 86px;
    line-height: 86px;
    padding: 0 20px;
    font-size: 28px;
    color: #272a35;
    font-weight: normal;
  &.ticket-tips-tit {
     position: relative;
     padding-left: 77px;
     background: url('../../../assets/ticket_tips.png') no-repeat 20px center;
     background-size: 37px 37px;
  i:after {
    right: 20px;
  }
  }
  span {
    margin-left:5px;
    color: #999;
    font-size: 24px;
  }
  }



  .ticket-info-order {
    padding: 28px 0;
    margin-bottom: 20px;
    background-color: #fff;
  p {
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    margin-top: 20px;
    font-size: 26px;
    color: #272a35;
  &:first-child {
     margin-top: 0;
   }
  }
  .left-span {
    float: left;
    width: 160px;
    height: 30px;
    color: #999;
  }
  .right-span {
    float: right;
    height: 30px;
    color: #999;
  em {
    color: #272a35;
  }
  }
  .name {
    display: inline-block;
    min-width: 140px;
  }
  .tel {
    display: inline-block;
    padding-left: 20px;
    margin-left: 16px;
    background: url('../../../assets/phone2.png') no-repeat 0 center;
    background-size: 15px 24px;
  }
  .text-larger .left-span,
  .text-larger .right-span {
    font-size: 30px;
    color: #272a35;
  }
  .text-larger .gray {
    color: #999;
  }
  .text-price-total {
    height: 88px;
    line-height: 88px;
  .left-span,
  .right-span {
    height: 88px;
  }
  }
  .abs-tit-box {
    position: relative;
    color: #999;
  .abs-tit {
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    color: #999;
  }
  .right-text {
    height: 30px;
    color: #999;
    text-align: right;
  }
  .special-tips {
    margin-left: 180px;
    padding-left: 0;
    height: auto;
    text-align: left;
    color: #272a35;
  }
  .right-text span {
    display: inline-block;
  }
  .right-text em {
    height: 30px;
    color: #272a35;
  }
  }
  }

  .tag-age {
    display: inline-block;
    margin-left: 20px;
    line-height: 1;
    padding: 4px 8px;
    background-color: #FF9900;
    color: #fff;
    font-size: 20px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    vertical-align: top;
  &.tag-age-child {
     background-color: #2772CC;
   }
  }
  .orange {
    color: #ff6600 !important;
  }
  .abs-bottom-box{
  .order-tips{
    float:left;
    line-height:90px;
    padding-left:20px;
    font-size:24px;
    color:#4c4c4c;
  }
  .price{
    font-size:28px;
  span{
    font-size: 30px;
    color: #ff6600;
  }
  }
  .icon-tips{
    padding-left:60px;
    background:url("../../../assets/i.png") no-repeat 20px center;
    background-size:30px 30px;
  }
  .button-small{
    float:right;
    margin-right:20px;
    margin-top:23px;
    font-size: 28px;
    width: auto;
    padding:0 20px;
    height: 50px !important;
    line-height: 50px
  }
  }

  .online-service {
    padding: 0 20px;
    input {
      height: 80px;
      background-color: #fff;
      font-size: 28px;
      color: #4c4c4c;
      border-color: #e5e5e5;
    }
  }




</style>
