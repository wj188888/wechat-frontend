<template>
  <main-box :title="title" :show-more="false" main-class="flex-box">
    <router-link
      slot="title"
      v-show="orderInfo.chStatus == 0 || orderInfo.chStatus == 1 || orderInfo.chStatus == 2"
      :to="{name: 'cancelCarhailing', query:{orderId: orderId, productTypeLevelOne: productTypeLevelOne}}"
      class="hd-cancel">
      取消用车
    </router-link>
    <driver-info :order-id="orderId" :product-type="orderInfo.productTypeLevelOne" :driver-info="orderInfo.dispatchDriverInfo"></driver-info>
    <div class="map-container map-box" id="container"></div>
    <div class="order-detail-box line line-x-b" v-if="orderInfo.productTypeLevelOne">
      <p class="order-type">
        <span>{{orderInfo.productTypeLevelOne | getProductOneName}}</span>
        <span v-if="orderInfo.startupTime">{{orderInfo.startupTime | formatDate('monthDayHour')}}</span>
        <span class="yellow">待出行</span>
      </p>
      <div class="order-detail-info">
        <ul class="driver-ticket-address" v-if="orderInfo.aAddress.city">
          <li>
            <i class="circle-bg-start">始</i>{{orderInfo.aAddress.city + '·' + orderInfo.aAddress.detailAddress}}
            <div class="shu"></div>
          </li>
          <li>
            <i class="circle-bg-end">终</i>{{orderInfo.bAddress.city + '·' + orderInfo.bAddress.detailAddress}}
          </li>
        </ul>
        <a class="driver-buy-button" v-if="orderInfo.payType !== 2 && orderInfo.estimatedPrice > 0">
          <i>预估 </i>
          <em>{{orderInfo.estimatedPrice | formatPrice('normal')}}</em>
          <i> 元</i>
        </a>
        <a class="driver-buy-button" v-if="orderInfo.payType === 2">现金支付</a>
        <div class="carhailing-price-tips" v-if="orderInfo.actualPayment > 0" @click="showDialog = true"></div>
      </div>
    </div>
    <a class="button button-empty-white button-no-radius" v-if="orderInfo.productTypeLevelOne">您的行程尚未开始，请耐心等待</a>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import DriverInfo from 'components/driver-info/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'
  import sharePic from 'static/pics/map.png'

  export default {
    components: {
      MainBox,
      DriverInfo,
    },
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        orderId: '',
        productTypeLevelOne:'',
        orderStatus: -1,
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
          zoom:16
        },
        startPoint:'',
        startPointer:'',
        endPoint:'',
        endPointer:'',
        mapRoute:'',
        resetControl:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 80,
            paddingBottom: 80,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        orderInfo:{
          dispatchDriverInfo:{},
          aAddress:{},
          bAddress:{}
        },
        pollingSatus:true
      }
    },
    mounted () {
      this.initialize()
    },
    destroyed () {
      this.reset()
    },
    methods:{
      initialize () {
        this.orderId = this.$route.query.orderId
        this.productTypeLevelOne = this.$route.query.productTypeLevelOne

        if(this.productTypeLevelOne === 'TAXI'){
          this.title = '出租的士'
        }else{
          this.title = '品牌约车'
        }
        this.orderPolling(this.orderId, this.orderStatus)
      },

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
            this.orderInfo = data.resultData.content
            if(this.orderStatus !== this.orderInfo.chStatus){
              this.orderStatus = this.orderInfo.chStatus
              this.orderPolling(this.orderId, this.orderStatus)
            }

            //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
            if(this.orderInfo.chStatus === 10){
              this.$router.replace({
                name: 'holdForCar',
                query:{
                  orderId: this.orderId,
                  productTypeLevelOne: this.productTypeLevelOne
                }
              })
            }else if(this.orderInfo.chStatus === 13){
              this.$store.dispatch('showAlert', {
                title: '取消成功',
                content: '今天'+ TOOL.newGetDate({date:this.orderInfo.startupTime, type: 'time'}) +'的行程已被司机取消<br/>重新预约试试吧。',
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
            }

            //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
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
          content: this.orderInfo.aAddress.detailAddress,
          tips: TOOL.newGetDate({date: this.orderInfo.startupTime, type: 'holeDate2'})
        })
        this._addEndPointer()
      },

      _addEndPointer () {
        this.endPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.endPoint.lat,
          lng: this.endPoint.lng,
          type: 1,
          content: this.orderInfo.bAddress.detailAddress
        })
        this._addGuideLayer ()
        this.bestView.controls = [this.startPointer, this.endPointer]
        this.setCenter()
        this._resetControl()
      },

      _addGuideLayer () {
        this.mapRoute = new qqMap.component.Route({
          map: this.map,
          startPoint:{
            lat: this.startPoint.lat,
            lng: this.startPoint.lng,
          },
          endPoint:{
            lat: this.endPoint.lat,
            lng: this.endPoint.lng,
          },
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
    }
  }
</script>
<style lang="less" scoped>
  .map-box{
    flex:1;
  }
  .order-detail-box{
    height: 220px;
    padding:20px 20px 30px;
    background-color:#fff;
    font-size:24px;
    color:#121212;
    .order-type{
      span{
        display: inline-block;
        margin-right:20px;
      }
      .yellow{
        color:#ff6600;
      }
    }
    .order-detail-info{
      position: relative;
    }
    .driver-ticket-address {
      padding-top:30px;
      padding-right: 300px;
      li {
        position: relative;
        line-height: 1.4;
        font-size:28px;
        color:#4c4c4c;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:first-child {
          margin-bottom: 50px;
        }
      }
      .shu {
        position: absolute;
        left: 12px;
        top: 34px;
        width: 0;
        height: 46px;
        border-left:1PX dashed #dbdedc;
      }
      i {
        display: inline-block;
        width: 26px;
        height: 26px;
        line-height: 26px;
        margin-right: 16px;
        font-size: 16px;
        text-align: center;
        color: #ffffff;
        border-radius: 50%;
      }
    }
    .driver-buy-button {
      position: absolute;
      right: 40px;
      top: 50%;
      margin-top:-24px;
      color: #4c4c4c;
      font-size:28px;
      em{
        font-size:48px;
      }
    }
    .carhailing-price-tips{
      position:absolute;
      top:10px;
      bottom:0;
      right:0;
      width:30px;
      background:url('../../../assets/carhailing/question.png') no-repeat right center;
      background-size:26px 26px;
    }
  }
  .anonymous-star{
    padding:34px 0;
    background-color:#fff;
    text-align:center;
    .any-star{
      display:inline-block;
      width: 50px;
      height:50px;
      margin-right:42px;
      &:last-child{
        margin-right:0;
      }
    }
    .star-no{
      background: url("../../../assets/car/star_gray.png") no-repeat 0 0;
      background-size:50px 50px;
    }
    .star-yes{
      background: url("../../../assets/car/star_yellow.png") no-repeat 0 0;
      background-size:50px 50px;
    }
  }

  .dialog-demo {
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1000;
  }

  .close-icon {
    position: fixed;
    bottom: 30px;
    left: 50%;
    width: 95px;
    height: 95px;
    background: url("../../../assets/charter/close.png") no-repeat;
    background-size: 91px 91px;
    margin-left: -45px;
    z-index: 2000;
  }

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
    color: #888;
    font-size: 36px;
  }

  .price-total{
    margin:80px 0 130px;
    text-align: center;
    font-size:70px;
    color:#4c4c4c;
    i{
      position: relative;
      top:-2px;
      font-size: 36px;
    }
  }

  .company-quote-table {
    padding: 0 40px;
    font-size: 28px;
    color: #4C4C4C;
  }

  .company-text {
    font-size:28px;
    color:#888;
    line-height: 50px;
    overflow: hidden;
  }

  .company-text p {
    float: left;
  }

  .company-text p:last-child {
    float: right;
  }

  .company-text.mar-t-10 {
    margin-top: 10px;
  }
</style>
