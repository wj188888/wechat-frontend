<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="order-ticket">
      <order-base-info :data="orderSku"></order-base-info>
      <div class="ticket-ewm line line-x mar-t-20">
        <div class="ewm-pic-box">
          <div class="ewm-pic">
            <img :src="ewmPic"/>
          </div>
          <div class="ticket-user" v-if="detailData.passengerName && detailData.passengerPhone">
            <p><i class="icon-username"></i>{{detailData.passengerName}}</p>
            <p><i class="icon-userphone"></i>{{detailData.passengerPhone}}</p>
            <p v-if="detailData.seatNo"><i class="icon-seats"></i>{{detailData.seatNo}}号座</p>
          </div>
        </div>
      </div>
      <!--<a class="btn-ewm-save">保存到手机</a>-->
    </div>
    <div class="ticket-info-box">
      <h2 class="ticket-h2 ticket-tips-tit"
          @click="ticketTipsShow = !ticketTipsShow"
          :class="{'dd-text-active': ticketTipsShow}">
        取票及验票须知<i class="icon-r-jt"></i>
      </h2>
      <div class="ticket-tips line line-x-t" v-show="ticketTipsShow">
        <h3>取票须知</h3>
        <P><span>1、</span>（车站班车）请提前到达乘车车站，找到自主取票机，打印纸质车票，完成取票；</P>
        <P><span>2、</span>（车站班车）如现场自主取票机故障，请联系车站工作人员或到售票柜台出示个人身份证，完成取票；</P>
        <P><span>3、</span>（车站班车）凭打印车票，在发车前10分钟到对应检票口验票上车；（部份车站可用二维码电子票）</P>
        <P><span>4、</span>（其他类型汽车车票）如购买时要求提供纸质发票的，请在上车时主动向当班工作人员索取发票。</P>
        <h3 class="h-2">二维码电子票验票</h3>
        <P><span>1、</span>车站班车以外汽车客运服务，均以二维码电子票为验票标准；</P>
        <P><span>2、</span>请在发车前10分钟，到约定地点向当班工作人员出示二维码电子票。</P>
        <p class="warning-tips">注：更多服务问题，请咨询当班工作人员。</p>
      </div>
    </div>

    <div class="ticket-info-order pad-0" v-if="detailData.serviceCar">
      <h2 class="ticket-h2 line line-x-b">服务信息</h2>
      <div class="pad-tb-20">
        <p v-if="detailData.serviceCar.firmName">
          <span class="left-span">运输公司</span>
          <span>{{detailData.serviceCar.firmName}}</span>
        </p>
        <p v-if="detailData.serviceCar.carLicensePlat">
          <span class="left-span">车牌号码</span>
          <span>
                {{detailData.serviceCar.carLicensePlatProvince}}{{detailData.serviceCar.carLicensePlat}}  <em
                  v-if="detailData.serviceCar.carLicensePlatType == 0">(黄)</em><em
                  v-if="detailData.serviceCar.carLicensePlatType == 1">(蓝)</em>
              </span>
        </p>
        <p v-if="detailData.serviceCar.carBrand">
          <span class="left-span">用车品牌</span>
          <span>{{detailData.serviceCar.carBrand}}</span>
        </p>
        <p v-if="detailData.serviceCar.carModel">
          <span class="left-span">用车型号</span>
          <span>{{detailData.serviceCar.carModel}}</span>
        </p>
        <p v-if="detailData.serviceCar.seats">
          <span class="left-span">旅客座位</span>
          <span>{{detailData.serviceCar.seats}}座</span>
        </p>
        <p v-if="detailData.serviceCar.responsibleName">
          <span class="left-span">服务责任人</span>
          <span>{{detailData.serviceCar.responsibleName}} <span
                  class="tel">{{detailData.serviceCar.responsibleTel}}</span></span>
        </p>
        <p v-if="detailData.serviceCar.driverName">
          <span class="left-span">司机</span>
          <span>{{detailData.serviceCar.driverName}} <span
                  class="tel">{{detailData.serviceCar.driverTel}}</span></span>
        </p>
        <p v-if="detailData.serviceCar.followCarContactName">
          <span class="left-span">随车联系人</span>
          <span>{{detailData.serviceCar.followCarContactName}} <span class="tel">{{detailData.serviceCar.followCarContactTel}}</span></span>
        </p>
        <div class="abs-tit-box orange" v-if="detailData.serviceCar.declaration">
          <p class="abs-tit">特别声明</p>
          <p class="right-text special-tips">{{detailData.serviceCar.declaration}}</p>
        </div>
      </div>
    </div>

    <ticket-notice
            :custom-contents="orderSku.customContents"
            :refund-notice-type="refundNotice">
    </ticket-notice>
    <div slot="footer">
      <div class="abs-bottom-box" v-if="detailData.status == 6">
        <div class="buy-right buy-w100">
          <a class="button button-gray" @click="againBuy">再次购买</a>
        </div>
      </div>

      <div class="abs-bottom-box" v-if="detailData.status == 1">
        <div class="buy-left clearfix">
          <input type="button" class="button"
                 :class="isRefund > 0 ? 'button-yellow': 'button-gray-lighter'" @click="openRefundTicket" value="退票"/>
        </div>
        <div class="buy-right">
          <input type="button" class="button button-primary" @click="againBuy" value="再次购买"/>
        </div>
      </div>

      <div class="abs-bottom-box" v-if="detailData.status==2">
        <div class="buy-right buy-w100">
          <router-link class="button button-primary" :to="{name:'trip', query:{taskId:detailData.taskId}}">查看行程</router-link>
        </div>
      </div>

      <div class="abs-bottom-box" v-if="detailData.status==5">
        <div class="buy-right buy-w100">
          <a class="button button-primary" @click="againBuy">再次购买</a>
        </div>
      </div>

      <div class="clear-white-back" @click="tuiDialog.showFal = false">
        <x-dialog :show="tuiDialog.showFal" class="dialog-demo">
          <img class="ticket-suc-fal" src="../../../assets/ticket/lose.png">
        </x-dialog>
      </div>
      <div class="clear-white-back" @click="tuiDialog.showSuc = false">
        <x-dialog :show="tuiDialog.showSuc" class="dialog-demo">
          <img class="ticket-suc-fal" src="../../../assets/ticket/success.png">
        </x-dialog>
      </div>
      <div id="tui-clear-over">
        <x-dialog :show="tuiDialog.showDialog" class="dialog-demo">
          <div class="return-title">
            <span>请选择退票原因</span>
            <i class="close" @click="tuiDialog.showDialog = false"></i>
          </div>
          <div class="mar-lr-20 tc-dialog">
            <div class="check-item line line-box radius-box" v-for="data in returnReson">
              <div class="check-box">
                <label>
                  {{data}}
                  <input class="hide" type="radio" :value="data" v-model="returnData.refundReason"/>
                  <i class="icon-com"></i>
                </label>
              </div>
            </div>

            <div class="check-item line line-box radius-box">
              <input type="button" value="确认" @click="retTicket" class="button button-primary return-mg">
            </div>
          </div>
        </x-dialog>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index.vue'
  import TicketNotice from 'components/ticketNotice/index.vue'
  import {XDialog} from 'vux'

  export default {
    components: {
      MainBox,
      OrderBaseInfo,
      TicketNotice,
      XDialog
    },
    data () {
      return {
        title: this.$route.meta.title,
        ticketId: '',
        detailData: {},
        orderSku: {
          aAddress:{},
          bAddress:{},
        },
        ewmPic: '',
        ticketTipsShow: false,
        ticketStatus: '',
        countTick: '',
        tuiDialog: {
          showDialog: false,
          showSuc: false,
          showFal: false
        },
        refundNotice: '', //购票须知
        returnReson: ['车辆故障', '车辆晚点太久', '车辆不符', '多次购票', '其他'],
        returnData: {
          orderId: '',
          ticketId: '',
          refundReason: ''
        },
        //再次购买
        againData: {
          startPlace: '',
          endPlace: '',
          startTime: ''
        },
      }
    },
    computed: {
      /**
       * 退票按钮控制
       */
      isRefund () {
        let now = TOOL.newGetDate({type: 'holeDate'})
        return TOOL.dateCompare(this.detailData.orderSku.startupTime, now, 'datetime')
      }
    },
    mounted () {
      this.ticketId = this.$route.query.ticketId
      this.ewmPic = api.getSrc(this.ticketId)
      this.findTicketDetail()
    },
    destroyed () {
      if (this.countTick) {
        clearInterval(this.countTick)
      }
    },
    methods: {
      findTicketDetail () {
        api.ticketDetailById(this.ticketId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.detailData = data.resultData
            this.returnData.orderId = data.resultData.orderId
            this.ticketStatus = data.resultData.status
            this.orderSku = data.resultData.orderSku
            this.refundNotice = (this.orderSku.productTypeLevelOne == 'LINE_BUS' || this.orderSku.productTypeLevelOne == 'CUSTOM_BUS')? 'refundNotice2' : 'refundNotice1'
            if (this.ticketStatus == 1) {
              this.findTicketStatus()
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      },
      findTicketStatus () {
        this.countTick = setInterval(()=> {
          api.ticketCheckById(this.ticketId).then(res=> {
            const data = TOOL.toJson(res.data)
            if (data.resultCode === '0') {
              this.tuiDialog.showSuc = true
              this.tuiDialog.showFal = false
              clearInterval(this.countTick)
            } else {
              this.tuiDialog.showFal = true
              this.tuiDialog.showFal = false

            }
          })
        }, 1000);
      },

      /**
       * 退票需判断发车时间是否大于当前时间
       * 退票规则：
       * 1.车辆已出发，不能进行退票
       * 2.发车前2小时内退票，收取20%的手续费，发车前大于等于2小时，收取10%的手续费
       */
      openRefundTicket () {
          api.checkCanRefundOrder({orderId: this.returnData.orderId}).then(res =>{
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (this.isRefund > 0) {
                  if (data.resultCode === '0') {
                      if (this.detailData.orderSku.productTypeLevelTwo === 'LINE_CAR_POOL_BUS') {
                          this.$store.dispatch('showError', TOOL.LINE_CAR_POOL_BUS + '不支持退票');
                          return
                      }
                      if (this.detailData.orderSku.productTypeLevelOne === 'CUSTOM_BUS') {
                          this.$store.dispatch('showError', '请联系公司线下为您办理退票');
                          return
                      }
                      this.tuiDialog.showDialog = true
                  }else {
                      if(data.resultCode === '40001') {
                          this.$store.dispatch('showAlert', {content: '该车次不支持线上退款，请联系所在车站管理员处理',buttonText:'好的'});
                      } else {
                          this.$store.dispatch('showError', data.resultMsg)
                      }
                  }
              }else if(this.isRefund <= 0){
                  this.$store.dispatch('showError', '车已出发啦，无法退票')
              }

          });

      },

      /**
       * 退票
       * 退票需企业后台审核
       */
      retTicket () {
        let _this = this
        this.returnData.ticketId = this.ticketId
        this.$store.commit('UPDATE_LOADING', true)
        api.ticketRefundNew(this.returnData).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.tuiDialog.showDialog = false
            this.$store.dispatch('showAlert', {
              title: '退票成功',
              content: '您的车票已退，车票款将于2个工作日内返还到您的账户上',
              buttonText: '好的',
              onHide: ()=> {
                _this.$router.push({
                  name: 'ticketList',
                  query: {
                    productTypeLevelOne: this.orderSku.productTypeLevelOne
                  }
                })
              }
            })
          } else {
            this.$store.dispatch('showError', data.resultMsg)
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
        let type = this.orderSku.productTypeLevelOne
        let queryData = {
          startPlace: this.getSearchKey(this.orderSku.aAddress),
          endPlace: this.getSearchKey(this.orderSku.bAddress),
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
            if (this.detailData.airportType === 0) {
              routeName = 'airportPickList'
            } else {
              routeName = 'airportSendList'
            }
            break;
          case 'TRAIN_STATION_BUS':
            if (this.detailData.shuttleType === 0) {
              routeName = 'trainPickList'
              queryData.startPlace = this.orderSku.aAddress.detailAddress
              queryData.endPlace = this.orderSku.bAddress.searchShowAddress
            } else {
              routeName = 'trainSendList'
              queryData.startPlace = this.orderSku.aAddress.searchShowAddress
              queryData.endPlace = this.orderSku.bAddress.detailAddress
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
              onStation: JSON.stringify(this.orderSku.onStation),
              offStation: JSON.stringify(this.orderSku.offStation)
            }
            break;
          case 'CUSTOM_BUS':
            routeName = 'charterList'
            queryData = {}
            break;
          case 'LINE_BUS':
            routeName = 'carpoolingList'
            queryData = {productId: this.orderSku.productId}
            break;
        }
        this.$router.push({
          name: routeName,
          query: queryData
        });
      }
    }
  }
</script>
<style scoped>
  .order-ticket {
    margin-bottom: 20px;
    overflow: hidden;
  }

  .ewm-pic-box {
    background-color: #fff;
  }

  .ewm-pic {
    width: 100%;
    padding: 80px 0 60px;
    text-align: center;
  }

  .ewm-pic img {
    width: 300px;
    height: 300px;
  }

  .ticket-user {
    display:flex;
    width: 100%;
    padding-bottom: 32px;
    text-align: center;
    font-size: 26px;
    color: #b2b2b2;
    overflow: hidden;
  }

  .ticket-user p {
    flex:1;
    height: 34px;
    line-height: 34px;
  }

  .ticket-user i {
    display: inline-block;
    vertical-align: bottom;
  }

  .icon-username {
    width: 40px;
    height: 34px;
    background: url('../../../assets/user.png') no-repeat 0 center;
    background-size: 27px 31px;
  }

  .icon-userphone {
    width: 32px;
    height: 34px;
    background: url('../../../assets/phone.png') no-repeat 0 center;
    background-size: 19px 31px;
  }

  .icon-seats {
    width: 32px;
    height: 34px;
    background: url('../../../assets/seats_active.png') no-repeat 0 center;
    background-size: 22px 30px;
  }

  .btn-ewm-save {
    display: block;
    height: 80px;
    line-height: 80px;
    font-size: 28px;
    color: #272a35;
    text-align: center;
  }

  .ticket-info-box {
    margin-bottom: 20px;
    background-color: #fff;
  }

  .ticket-h2 {
    height: 86px;
    line-height: 86px;
    padding: 0 20px;
    font-size: 28px;
    color: #272a35;
    font-weight: normal;
  }

  .ticket-h2 span {
    margin-left:5px;
    color: #999;
    font-size: 24px;
  }

  .ticket-tips-tit {
    position: relative;
    padding-left: 77px;
    background: url('../../../assets/ticket_tips.png') no-repeat 20px center;
    background-size: 37px 37px;
  }

  .ticket-tips-tit i:after {
    right: 20px;
  }

  .ticket-tips {
    padding: 0 20px 60px;
    overflow: hidden;
  }

  .ticket-tips h3 {
    margin: 30px 0 26px;
    font-size: 26px;
    color: #272a35;
  }

  .ticket-tips .h-2 {
    margin-top: 60px;
  }

  .ticket-tips p {
    position: relative;
    padding-left: 40px;
    margin-bottom: 20px;
    line-height: 1.414;
    font-size: 26px;
    color: #6b6c70;
  }

  .ticket-tips span {
    position: absolute;
    left: 0;
    top: 0;
  }

  .ticket-tips .warning-tips {
    padding-left: 0;
    color: #ff6600;
  }

  .ticket-info-order {
    padding: 28px 0;
    margin-bottom: 20px;
    background-color: #fff;
  }

  .ticket-info-order p {
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    margin-top: 20px;
    font-size: 26px;
    color: #272a35;
  }

  .ticket-info-order p:first-child {
    margin-top: 0;
  }

  .ticket-info-order .left-span {
    float: left;
    width: 160px;
    height: 30px;
    color: #999;
  }

  .ticket-info-order .right-span {
    float: right;
    height: 30px;
    color: #999;
  }

  .ticket-info-order .right-span em {
    color: #272a35;
  }

  .abs-tit-box {
    position: relative;
    color: #999;
  }

  .ticket-info-order .text-larger .left-span,
  .ticket-info-order .text-larger .right-span {
    font-size: 30px;
    color: #272a35;
  }

  .ticket-info-order .text-price-total {
    height: 88px;
    line-height: 88px;
  }

  .text-price-total .left-span,
  .text-price-total .right-span {
    height: 88px;
  }

  .text-mar-t-50 {
    margin-top: 38px !important;
  }

  .abs-tit-box .abs-tit {
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    color: #999;
  }

  .abs-tit-box .right-text {
    height: 30px;
    color: #999;
    text-align: right;
  }

  .abs-tit-box .special-tips {
    margin-left: 180px;
    padding-left: 0;
    height: auto;
    text-align: left;
    color: #272a35;
  }

  .abs-tit-box .right-text span {
    display: inline-block;
    width: 152px;
  }

  .abs-tit-box .right-text em {
    height: 30px;
    color: #272a35;
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
  }

  .orange {
    color: #ff6600 !important;
  }
</style>
