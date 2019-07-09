<template>
  <div>
    <c-header :title="title" :show-more="false">
      <router-link v-show="orderStatus == 1 || orderStatus == 2 || orderStatus == 10" :to="{name: 'cancelCarhailing', query:{orderId: orderId, productTypeLevelOne: productTypeLevelOne}}" class="hd-cancel">取消用车</router-link>
      <router-link v-show="orderStatus != 1 && orderStatus != 2 && orderStatus != 10" class="hd-cancel" :to="{name: 'userComplain', query:{orderId: orderId, productTypeLevelOne: orderInfo.productTypeLevelOne}}">帮助</router-link>
    </c-header>
    <div class="app-container">
      <div class="app-main flex-box">
        <driver-info :order-id="orderId" :product-type="orderInfo.productTypeLevelOne" :driver-info="orderInfo.dispatchDriverInfo"></driver-info>
        <div class="map-container map-box" id="container"></div>
        <div class="order-hold-box">
          <p class="p1" v-text="orderText.p1"></p>
          <p class="p2" v-html="orderText.p2"></p>
        </div>
      </div>
    </div>
    <x-dialog :show="showPayDialog" class="pay-dialog">
      <div class="pay-dialog-title line line-x-b">
        <span>行程账单</span>
      </div>
      <div class="pay-dialog-body">
        <p class="pay-price">
          共<em>{{orderInfo.actualPayment | formatPrice('normal')}}</em>元
        </p>
        <p class="pay-info" v-if="orderInfo.tripType === 1 && orderInfo.minConsumptionAmount > 0">
          <span>最低消费</span>{{orderInfo.minConsumptionAmount | formatPrice('normal')}}元
                </p>
        <p class="pay-info">
          <span>起步费</span>{{orderInfo.startupFee | formatPrice('normal')}}元
                </p>
        <p class="pay-info">
          <span>里程费（{{orderInfo.actualDistance}}公里）</span>{{orderInfo.mileageFee | formatPrice('normal')}}元
                </p>
        <p class="pay-info">
          <span>时长费（{{orderInfo.actualDuration}}分钟）</span>{{orderInfo.durationFee | formatPrice('normal')}}元
                </p>
        <p class="pay-info" v-if="orderInfo.actualLongJourneyDis">
          <span>远途费（{{orderInfo.actualLongJourneyDis}}公里）</span>{{orderInfo.longJourneyFee | formatPrice('normal')}}元
                </p>
        <p class="pay-info" v-if="orderInfo.nightFee">
          <span>夜间费</span>{{orderInfo.nightFee | formatPrice('normal')}}元
                </p>
        <p class="pay-info" v-if="discountPrice > 0">
          <span>优惠券抵扣</span> -{{discountPrice | formatPrice('normal')}}元
        </p>
        <input type="button" value="立即支付" @click="payOrder" class="button button-no-radius button-primary">
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'
  import DriverInfo from 'components/driver-info/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'
  import sharePic from 'static/pics/map.png'
  import {XDialog} from 'vux'

  export default {
    components: {
      CHeader,
      DriverInfo,
      XDialog
    },
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        orderId:'',
        productTypeLevelOne:'',
        orderStatus: -1,
        orderText:{
          p1:'',
          p2:''
        },
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
          zoom:14
        },
        startPoint:'',
        startPointer:'',
        endPoint:'',
        endPointer:'',
        mapRoute:'',
        resetControl:'',
        showTimerBox: true,
        showFailBox: false,
        distance:'',
        duration:'',
        carPosition:'',
        carPointer:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 80,
            paddingBottom: 80,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        showPayDialog: false,
        orderInfo:{
          dispatchDriverInfo:{},
          aAddress:{},
          bAddress:{},
        },
        pollingSatus:true,
        discountPrice: 0
      }
    },
    watch: {
      carPosition (newVal) {
        if(newVal){
          this._addGuideLayer()
        }
      }
    },
    mounted () {
      this.orderId = this.$route.query.orderId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      let shareUrl = TOOL.shareURL + 'holdForCarShare' + '?orderId=' + this.orderId + '&productTypeLevelOne=' + this.productTypeLevelOne
      interfaceApi.share({
        share: true,
        sharePic: sharePic,
        shareUrl: shareUrl,
        shareTitle: '我的行程分享',
        shareDesc: '想知道我在哪儿？点击进来围观吧！'
      });

      if(this.productTypeLevelOne === 'TAXI'){
        this.title = '出租的士'
      }else{
        this.title = '品牌约车'
      }
      this.orderPolling(this.orderId, this.orderStatus)
    },
    destroyed () {
      this.reset()
    },
    methods:{
      reset () {
        this.pollingSatus = false
        if(this.carPointer){
          this.carPointer.shutDownPolling()
        }
      },

      orderPolling (orderId, orderStatus) {
        if(!this.pollingSatus){
          return
        }

        api.chBaseOrderPolling(this.orderId, this.orderStatus).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.discountPrice = 0
            this.orderInfo = data.resultData.content
            if(this.orderInfo.discountInfo){
              if(this.orderInfo.discountInfo.activityAmount){
                this.discountPrice += +this.orderInfo.discountInfo.activityAmount
              }
              if(this.orderInfo.discountInfo.couponAmount){
                this.discountPrice += +this.orderInfo.discountInfo.couponAmount
              }
            }

            if(this.orderStatus != this.orderInfo.chStatus){
              this.orderStatus = this.orderInfo.chStatus
              this.distance = data.resultData.distance
              this.duration = data.resultData.duration
              this.orderPolling(this.orderId, this.orderStatus)
            }

            //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
            switch(this.orderInfo.chStatus){
              case 1:
              case 10:
                this.orderText.p1 = '司机正在来接你'
                this.orderText.p2 = `司机距您约${TOOL.getkilometer(this.distance)}，${TOOL.getViewTime(this.duration)}`
                break;
              case 2:
                if(this.mapRoute){
                  this.mapRoute.remove()
                }
                this.orderText.p1 = '司机已到达'
                this.orderText.p2 = '乘客您好，司机已到达上车地点，请您及时上车'
                break;
              case 3:
                this.orderText.p1 = '行程中'
                this.orderText.p2 = `距离${this.orderInfo.bAddress.detailAddress}${TOOL.getkilometer(this.distance)}<br/>${TOOL.getViewTime(this.duration)}`
                break;
              case 4:
                this.reset()
                if(this.productTypeLevelOne == 'TAXI'){
                  this.$router.replace({
                    name: 'carhailingOrderDetail',
                    query:{
                      orderId: this.orderId,
                      productTypeLevelOne: this.productTypeLevelOne
                    }
                  })
                }else{
                  this.orderText.p1 = '行程结束'
                  this.orderText.p2 = '已顺利将您送达目的地'
                  this.showPayDialog = true
                }
                break;
              case 14:
              case 15:
                this.reset()
                this.$router.replace({
                  name: 'carhailingOrderDetail',
                  query:{
                    orderId: this.orderId,
                    productTypeLevelOne: this.productTypeLevelOne
                  }
                })
                break;
              case 13:
                this.$store.dispatch('showAlert', {
                  title: '司机取消',
                  content: '今天'+ TOOL.newGetDate({data:this.orderInfo.startupTime, type: 'time'}) +'的行程已被司机取消<br/>重新预约试试吧。',
                  buttonText: '确定',
                  onHide: ()=> {
                    this.reset()
                    let router = 'carHailingSearch'
                    if(this.productTypeLevelOne == 'TAXI'){
                      router = 'taxiSearch'
                    }
                    this.$router.replace({name: router})
                  }
                })
                break;
              default:
                this.reset()
                let router = 'carHailingSearch'
                if(this.productTypeLevelOne == 'TAXI'){
                  router = 'taxiSearch'
                }
                this.$router.replace({name: router})
            }

            if(!this.map){
              this.startPoint = TOOL.baiduToTencent({
                lat: this.orderInfo.aAddress.latitude,
                lng: this.orderInfo.aAddress.longitude
              })
              this.endPoint = TOOL.baiduToTencent({
                lat: this.orderInfo.bAddress.latitude,
                lng: this.orderInfo.bAddress.longitude
              })
              this.mapConfig.lat = this.startPoint.lat;
              this.mapConfig.lng = this.startPoint.lng;
              this.map = new qqMap.createMap(this.container, this.mapConfig)
              this._addStartPointer()
            }
          }else{
            this.orderPolling(this.orderId, this.orderStatus)
          }
        })

      },

      _addStartPointer () {
        this.startPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.startPoint.lat,
          lng: this.startPoint.lng,
          type: 0,
          content: this.orderInfo.aAddress.detailAddress
        })
        this._addEndPointer()
        this._addCar()
      },

      _addEndPointer () {
        this.endPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.endPoint.lat,
          lng: this.endPoint.lng,
          type: 1,
          content: this.orderInfo.bAddress.detailAddress
        })
      },

      _addCar () {
        this.carPointer = new qqMap.component.Car({
          map: this.map,
          type: 260,
          lat: 0,
          lng: 0,
          orderId: this.orderId,
          productTypeLevelOne: this.orderInfo.productTypeLevelOne,
          callback: (t, e) => {
            if(e){
              this.carPosition = e.getPosition()
              this._addGuideLayer()
              this.carPointer = e;
              this.bestView.controls = [this.carPointer, this.startPointer]
              this.setCenter()
              this._resetControl()
            }else{
              if(this.mapRoute){
                this.carPosition = t.pointer
                this.mapRoute.remove()
                this._addGuideLayer()
              }
              this.distance = t.data.distance
              this.duration = t.data.duration
              //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
              switch(this.orderInfo.chStatus){
                case 1:
                  this.orderText.p2 = `司机距您约${TOOL.getkilometer(this.distance)}，${TOOL.getViewTime(this.duration)}`
                  break;
                case 3:
                  this.orderText.p2 = `距离${this.orderInfo.bAddress.detailAddress}${TOOL.getkilometer(this.distance)}<br/>${TOOL.getViewTime(this.duration)}`
                  break;
                case 4:
                  this.reset()
                  break;
              }
            }
          }
        })
      },

      _addGuideLayer () {
          let startPoint, endPoint
        if(this.orderInfo.chStatus === 1){
          startPoint = this.carPosition
          endPoint = this.startPoint
        }else{
          startPoint = this.carPosition
          endPoint = this.endPoint
        }
        this.mapRoute = new qqMap.component.Route({
          map: this.map,
          startPoint: startPoint,
          endPoint: endPoint,
          callback: (i, n) => {
            if(!i){
              this.mapRoute = n
            }
          }
        })
      },

      _resetControl () {
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          clickHandler: () => {
            this.setCenter()
          }
        })
      },

      setCenter () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },

      payOrder () {
        interfaceApi.wxPay({
          tradeNo: this.orderId,
          productTypeLevelOne: this.productTypeLevelOne,
          wxPaySuccess: TOOL.wxPaySuccess,
          wxPayFail: TOOL.wxPayFail,
          price: this.orderInfo.actualPayment
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .map-box{
    flex:1;
  }
  .order-hold-box{
    padding:46px;
    background-color:#fff;
    text-align:center;
    font-size:28px;
    color:#4c4c4c;
    .p1{
      font-size:36px;
      color:#ff6600;
      margin-bottom:44px;
    }
    .p2{
      line-height:1.6;
    }
  }
  .pay-dialog{
    text-align:center;
    .pay-dialog-title{
      height:98px;
      line-height:98px;
      font-size:36px;
      color:#121212;
    }
    .pay-dialog-body{
      overflow:hidden;
      .pay-price{
        margin:66px auto 100px;
        font-size:28px;
        color:#4c4c4c;
        em{
          padding:0 10px;
          font-size:48px;
        }
      }
      .pay-info{
        padding:0 50px;
        margin-bottom:30px;
        font-size:28px;
        color:#888;
        text-align:right;
        span{
          float:left;
        }
      }
      p:last-child{
        margin-bottom:110px;
      }
    }
  }
</style>
