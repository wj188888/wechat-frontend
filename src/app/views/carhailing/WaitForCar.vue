<template>
  <main-box :title="title" :show-more="false">
    <router-link
      slot="title"
      v-show="orderStatus == 0 || orderStatus == 1 || orderStatus == 2"
      :to="{name: 'cancelCarhailing', query:{orderId: orderId, productTypeLevelOne: productTypeLevelOne}}"
      class="hd-cancel">
      取消用车
    </router-link>
    <div class="map-top-box" v-show="showTimerBox">
      <p class="map-time">{{totalTime}}秒</p>
      <p class="map-tips">正在为您安排附近的车辆，请稍等...</p>
    </div>
    <div class="map-top-box" v-show="showFailBox">
      <p class="map-warning line line-x-b">抱歉，周围暂时没有可用车辆</p>
      <input type="button" class="map-bottom" :disabled="disableBtn" @click="orderCreate" value="重新约车" />
    </div>
    <div class="map-container" id="container"></div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        orderId:'',
        productTypeLevelOne:'',
        orderStatus: -1, //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
        totalTime:0,
        verifyTimer:'',
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
        },
        bestView: {
          controls: [],
          pos: {
            paddingTop: 160,
            paddingBottom: 40,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        orderData:{
          formId: TOOL.getTimeStamp(), //表单ID
        },
        startPoint:'',
        startPointer:'',
        endPoint:'',
        endPointer:'',
        resetControl:'',
        showTimerBox: true,
        showFailBox: false,
        orderDetail:{},
        pollingSatus:true,
        disableBtn: false,
//                isSavelog: false
      }
    },
    watch: {
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    destroyed () {
      this.pollingSatus = false
      if (this.verifyTimer) {
        clearInterval(this.verifyTimer)
      }
    },
    methods: {
      initialize () {
        this.orderId = this.$route.query.orderId
        this.productTypeLevelOne = this.$route.query.productTypeLevelOne
        this.orderStatus = -1
        if(this.productTypeLevelOne === 'TAXI'){
          this.title = '出租的士'
        }else{
          this.title = '品牌约车'
        }


        this.orderPolling()
        this.verifyTimer = window.setInterval(()=> {
          if (this.totalTime < 120) {
            this.totalTime++
          } else {
            this.changeStatus()
          }
        }, 1000)
      },
      changeStatus () {
        if(this.orderStatus === 12){
          if(this.verifyTimer){
            window.clearInterval(this.verifyTimer)
          }
          this.showTimerBox = false
          this.showFailBox = true
        }
      },

      orderPolling () {
        if(!this.pollingSatus){
          return
        }
        api.chBaseOrderPolling(this.orderId, this.orderStatus).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.orderDetail = data.resultData.content
//                        if(!this.isSavelog){
//                            this.isSavelog = true
//                            //统计产品详情页面pvuv
//                            TOOL.saveVisitLogs({
//                                url: this.$route.name,
//                                skuId: this.orderDetail.productId,
//                                productTypeLevelOne: this.orderDetail.productTypeLevelOne,
//                                productTypeLevelTwo: this.orderDetail.productTypeLevelTwo
//                            })
//                        }
            if(this.orderStatus !== this.orderDetail.chStatus){
              this.orderStatus = this.orderDetail.chStatus
              if(this.orderStatus === 12){
                this.changeStatus()
              }else{
                this.orderPolling()
              }
            }
            if(this.orderDetail.chStatus === 1){
              if(this.orderDetail.tripType === 1){
                this.$router.replace({
                  name: 'waitForTime',
                  query:{
                    orderId: this.orderId,
                    productTypeLevelOne: this.productTypeLevelOne
                  }
                })
              }else{
                this.$router.replace({
                  name: 'holdForCar',
                  query:{
                    orderId: this.orderId,
                    productTypeLevelOne: this.productTypeLevelOne
                  }
                })
              }
            }
            if(!this.map){
              this.startPoint = TOOL.baiduToTencent({
                lat: this.orderDetail.aAddress.latitude,
                lng: this.orderDetail.aAddress.longitude
              })
              this.endPoint = TOOL.baiduToTencent({
                lat: this.orderDetail.bAddress.latitude,
                lng: this.orderDetail.bAddress.longitude
              })
              this.mapConfig.lat = this.startPoint.lat;
              this.mapConfig.lng = this.startPoint.lng;
              this.map = new qqMap.createMap(this.container, this.mapConfig)
              this._addStartPointer()
              this._resetControl()
            }
          }else{
            this.orderPolling()
          }
        })

      },

      _addStartPointer () {
        this.startPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.startPoint.lat,
          lng: this.startPoint.lng,
          type: 0,
          content: this.orderDetail.aAddress.detailAddress
        })
        this._addEndPointer ()
      },

      _addEndPointer () {
        this.endPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.endPoint.lat,
          lng: this.endPoint.lng,
          type: 1,
          content: this.orderDetail.bAddress.detailAddress
        })
        this.bestView.controls = [this.startPointer, this.endPointer]
        this.setCenter()
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

      orderCreate () {
        this.$store.commit('UPDATE_LOADING', true)
        let orderData = {
          startCity: this.orderDetail.aAddress.city, //出发地城市
          startDetailAddress: this.orderDetail.aAddress.detailAddress, //出发地具体地址
          startLongitude: this.orderDetail.aAddress.longitude, //出发地经度
          startLatitude: this.orderDetail.aAddress.latitude, //出发地纬度
          endCity: this.orderDetail.bAddress.city, //目的地城市
          endDetailAddress: this.orderDetail.bAddress.detailAddress, //目的地具体地址
          endLongitude: this.orderDetail.bAddress.longitude, //目的地经度
          endLatitude: this.orderDetail.bAddress.latitude, //目的地纬度
          startTime: TOOL.newGetDate({type: 'holeDate'}),
          contactPhone: this.orderDetail.contactTelephone,
          tripType: this.orderDetail.tripType
        }
        this.orderData = Object.assign(this.orderData, orderData)

        if(this.orderDetail.tripType === 1){
          this.orderData.startTime = this.orderDetail.startupTime
        }

        let resource
        if(this.productTypeLevelOne !== 'TAXI'){
          this.orderData.startCounty = this.orderDetail.aAddress.county
          this.orderData.carGrade = this.orderDetail.carGrade //汽车所属级别：0.5座经济轿车、1.5座高级轿车、2.7座商务、3.经济SUV、4.高级SUV、5.小巴、6.中巴、7.大巴
          this.orderData.tripType = this.orderDetail.tripType
          resource = api.chOrderCreate(this.orderData)
        }else{
          this.orderData.startCounty = this.orderDetail.aAddress.county
          this.orderData.endCounty = this.orderDetail.bAddress.county
          resource = api.taxiOrderCreate(this.orderData)
        }

        this.disableBtn = true
        resource.then(res => {
          const data = TOOL.toJson(res.data)
          this.orderData.formId = TOOL.getTimeStamp()
          this.$store.commit('UPDATE_LOADING', false)
          this.disableBtn = false
          if (data.resultCode === '0') {
            this.totalTime = 0
            this.showTimerBox = true
            this.showFailBox = false
            this.orderStatus = -1
            if (this.verifyTimer) {
              clearInterval(this.verifyTimer)
            }
            this.$router.replace({
              name: 'waitForCar',
              query:{
                orderId: data.resultData,
                productTypeLevelOne: this.productTypeLevelOne
              }
            })
          } else {
            this.orderData.formId = TOOL.getTimeStamp()
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .map-top-box{
    position:absolute;
    top:20px;
    left:25px;
    right:25px;
    background-color: @c-fff;
    box-shadow: 0 1PX 3PX rgba(0,0,0,.1);
    text-align:center;
    z-index:10;
    .map-time{
      padding-top:54px;
      font-size:48px;
      color:@c-ff6600;
    }
    .map-tips{
      margin-top:44px;
      padding-bottom:44px;
      font-size:32px;
      color: #888;
    }
    .map-warning{
      padding-top:128px;
      padding-bottom:32px;
      background:url("../../../assets/carhailing/tixing.png") no-repeat center 20px;
      background-size:84px 85px;
      font-size:32px;
      color: @c-4c4c4c;
    }
    .map-bottom{
      display:block;
      width: 100%;
      height:84px;
      line-height:84px;
      font-size:32px;
      color: @c-ff6600;
      text-align: center;
    }
  }
</style>
