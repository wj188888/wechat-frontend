<template>
  <main-box :title="title" :show-more="false" main-class="flex-box">
    <driver-info :order-id="orderId" :product-type="orderInfo.productTypeLevelOne" :driver-info="orderInfo.dispatchDriverInfo"></driver-info>
    <div class="map-container map-box" id="container"></div>
    <div class="order-detail-box line line-x-b" v-if="orderInfo.productTypeLevelOne">
      <p class="order-type">
        <span>{{orderInfo.productTypeLevelOne | getProductOneName}}</span>
        <span v-if="orderInfo.getOffTime">{{orderInfo.getOffTime | formatDate('monthDayHour')}}</span>
        <span v-if="orderInfo.chStatus == 11 || orderInfo.chStatus == 13">{{orderInfo.createdTime | formatDate('monthDayHour')}}</span>
        <span>{{chStatusText}}</span>
      </p>
      <div class="order-detail-info">
        <ul class="driver-ticket-address" v-if="orderInfo.aAddress.city">
          <li><i class="circle-bg-start">始</i>{{orderInfo.aAddress.city + '·' + orderInfo.aAddress.detailAddress}}<div class="shu"></div></li>
          <li><i class="circle-bg-end">终</i>{{orderInfo.bAddress.city + '·' + orderInfo.bAddress.detailAddress}}</li>
        </ul>
        <a class="driver-buy-button" v-if="orderInfo.payType != 2 && orderInfo.actualPayment > 0">
          <em>{{orderInfo.actualPayment | formatPrice('normal')}}</em>
          <i> 元</i>
        </a>
        <a class="driver-buy-button" v-if="orderInfo.payType == 2">现金支付</a>
        <div class="carhailing-price-tips" v-if="orderInfo.actualPayment > 0" @click="showDialog = true"></div>
      </div>
    </div>
    <input class="button button-primary button-no-radius" type="button" value="立即支付" v-if="orderInfo.chStatus == 4" @click="payOrder"/>
    <router-link class="button button-empty-white button-no-radius"
                 :to="{name:'orderEval', query:{orderId: orderId, productTypeLevelOne: orderInfo.productTypeLevelOne}}"
                 v-if="orderInfo.chStatus == 14">立即评价</router-link>
    <div class="anonymous-star clearfix" v-if="orderInfo.chStatus == 15">
      <div class="any-star star-no" :class="{'star-yes': (score || 5) >= i}" v-for="i in 5"></div>
    </div>
    <p class="button button-empty-white button-no-radius" v-if="orderInfo.chStatus == 11 || orderInfo.chStatus == 13">
      {{orderInfo.chStatus == 11 ? '订单已由旅客取消' : '订单已由司机取消'}}
        </p>
    <div class="dialog-demo" v-show="showDialog" slot="footer">
      <div class="company-quote">
        <h1 class="company-quote-tit">行程费用</h1>
        <p class="price-total">
          <em>{{orderInfo.actualPayment | formatPrice('normal')}}</em>
          <i> 元</i>
        </p>
        <div class="company-quote-table" v-if="productTypeLevelOne !== 'TAXI'">
          <div class="company-text mar-t-10" v-if="orderInfo.tripType === 1 && orderInfo.minConsumptionAmount > 0">
            <p>最低消费</p>
            <p>{{orderInfo.minConsumptionAmount | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10">
            <p>起步费</p>
            <p>{{orderInfo.startupFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10">
            <p>里程费（{{orderInfo.actualDistance}}公里）</p>
            <p>{{orderInfo.mileageFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10">
            <p>时长费（{{orderInfo.actualDuration}}分钟）</p>
            <p>{{orderInfo.durationFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10" v-if="orderInfo.actualLongJourneyDis">
            <p>远途费（{{orderInfo.actualLongJourneyDis}}公里）</p>
            <p>{{orderInfo.longJourneyFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10" v-if="orderInfo.nightFee">
            <p>夜间费</p>
            <p>{{orderInfo.nightFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10"  v-if="discountPrice > 0">
            <p>优惠券抵扣</p>
            <p>-{{discountPrice | formatPrice('normal')}}元</p>
          </div>
        </div>
        <div class="company-quote-table" v-if="productTypeLevelOne === 'TAXI'">
          <div class="company-text mar-t-10">
            <p>车费</p>
            <p>{{orderInfo.mileageFee | formatPrice('normal')}}元</p>
          </div>
          <div class="company-text mar-t-10">
            <p>路桥费</p>
            <p>{{orderInfo.roadFee | formatPrice('normal')}}元</p>
          </div>
        </div>
      </div>
      <div class="close-icon" @click="showDialog = false"></div>
    </div>
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
        productTypeLevelOne: '',
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
        showDialog: false,
        score:5,
        chStatusText:'',
        picker:'',
        discountPrice: 0
      }
    },
    watch: {
      $route () {
        this.initialize()
      }
    },
    created () {
      this.initialize()
    },
    methods:{
      initialize () {
        this.orderId = this.$route.query.orderId
        this.productTypeLevelOne = this.$route.query.productTypeLevelOne

        let shareUrl = TOOL.shareURL + 'carhailingOrderShare' + '?orderId=' + this.orderId + '&productTypeLevelOne=' + this.productTypeLevelOne
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
        this.orderFindById()

        this.picker = new Picker({
          data: [
            [
              {text: '在线支付',value: 1},
              {text: '现金支付',value: 2}
            ]
          ],
          selectedIndex: [0],
          title: '选择支付方式'
        });

        this.picker.on('picker.select', (selectedVal, selectedIndex) => {
          let payType = selectedVal[0]
          if(payType === 1){
            this.$router.push({
              name: 'onlinePayment',
              query:{
                orderId: this.orderId,
                productTypeLevelOne: this.productTypeLevelOne,
                payType: payType,
                startupTime: this.orderInfo.startupTime,
                productId: this.orderInfo.productId
              }
            })
          }else{
            this.$store.dispatch('showConfirm', {
              title: '确认现金支付吗',
              confirmText: '支付',
              cancelText: '取消',
              content: '确认使用现金支付吗？',
              onConfirm: () => {
                interfaceApi.wxPay({
                  tradeNo: this.orderId,
                  productTypeLevelOne: this.productTypeLevelOne,
                  payType: payType,
                  mileageFee: 0,
                  roadFee: 0,
                  callBack: this.initialize,
                  wxPaySuccess: TOOL.wxPaySuccess,
                  wxPayFail: TOOL.wxPayFail,
                  price: this.orderInfo.actualPayment
                })
              },
              onCancel: () => {
              }
            })
          }
        })
      },

      orderFindById () {
        api.chBaseOrderFindById(this.orderId, this.productTypeLevelOne).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.orderInfo = data.resultData.chOrder
            this.score = data.resultData.score
            if(this.orderInfo.discountInfo){
              if(this.orderInfo.discountInfo.activityAmount){
                this.discountPrice += this.orderInfo.discountInfo.activityAmount
              }
              if(this.orderInfo.discountInfo.couponAmount){
                this.discountPrice += this.orderInfo.discountInfo.couponAmount
              }
            }
            //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
            switch(this.orderInfo.chStatus){
              case 1:
              case 2:
              case 3:
                this.chStatusText = '行程中'
                break;
              case 4:
                this.chStatusText = '待支付'
                break;
              case 11:
              case 13:
                this.chStatusText = '已取消'
                break;
              case 14:
                this.chStatusText = '未评价'
                break;
              default:
                this.chStatusText = '已评价'
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
          } else {
            this.$store.dispatch('showError', data.resultMsg);
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

      payOrder () {
        if(this.productTypeLevelOne === 'TAXI'){
          this.picker.show();
        }else{
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
