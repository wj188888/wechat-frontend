<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom" :go-back="goBack">
    <order-base-info :data="ticketInfo">
      <p class="feeder-price" slot="price">{{ ticketPrice | formatPrice }}</p>
    </order-base-info>

    <div class="feeder-box mar20 radius-box">
      <ul class="feeder-type">
        <li v-if="serviceTypeDTO.deliveryService"
            @click="selectService('deliveryService')"
            :class="{'hold': isDeliveryService, 'active': tab === 'deliveryService'}">
          <span>到哪接我</span>
          <i class="feeder-yes"></i>
        </li>
        <li v-if="serviceTypeDTO.pickUpService"
            @click="selectService('pickUpService')"
            :class="{'hold': isPickUpService, 'active': tab === 'pickUpService'}">
          <span>送我去哪</span>
          <i class="feeder-yes"></i>
        </li>
      </ul>
      <div class="feeder-form line line-x-t"
           :class="{'text-gray': deliveryService.id && !isDeliveryService}"
           v-show="tab === 'deliveryService'">
        <div class="inline-box">
          <label class="icon-time"></label>
          <input type="text" placeholder="请选择用车时间" v-mobidatetime:startConfigStart="deliveryService.startupTime" readonly/>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-start"></label>
          <input type="text" placeholder="请选择你的出发地" v-model="deliveryService.onStation.name" readonly @click="jumpToAppointStation('onStation', 'deliveryService')"/>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-end"></label>
          <input type="text" placeholder="请选择目的地" v-model="deliveryService.offStation.name" readonly/>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-passenger"></label>
          <input type="text" v-model="deliveryService.passgerNumText" readonly placeholder="请输入乘车人数" @click="openPicker('deliveryService')"/>
          <i class="icon-r-jt"></i>
        </div>

        <div class="inline-box line line-x-t">
          <label class="icon-feeder-price"></label>
          <span class="feeder-price-placeholder" v-if="!deliveryService.id && !deliveryChargeType">填写以上信息后获得实际价格</span>
          <span class="feeder-price-total" v-else>
             <i>费用：
              <em v-if="deliveryService.actualPayment === 0">免费</em>
              <em v-else>{{deliveryService.actualPayment | formatPrice}}</em>
            </i>
          </span>
          <input class="unui-switch feeder-switch" v-if="deliveryService.id" type="checkbox" v-model="isDeliveryService"/>
        </div>
        <p class="feeder-notice" v-if="deliveryService.id" @click="jumpToFeederNotice(deliveryService.id)">接送服务须知</p>
      </div>

      <div class="feeder-form line line-x-t"
           :class="{'text-gray':pickUpService.id && !isPickUpService}"
           v-show="tab === 'pickUpService'">
        <div class="inline-box">
          <label class="icon-time"></label>
          <input type="text" placeholder="请选择用车时间" v-mobidatetime:startConfigEnd="pickUpService.startupTime" readonly/>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-start"></label>
          <input type="text" placeholder="请选择出发地" v-model="pickUpService.onStation.name" readonly/>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-end"></label>
          <input type="text" placeholder="请选择你的目的地" v-model="pickUpService.offStation.name" readonly @click="jumpToAppointStation('offStation', 'pickUpService')"/>
          <i class="icon-r-jt"></i>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-passenger"></label>
          <input type="text" v-model="pickUpService.passgerNumText" readonly placeholder="请输入乘车人数" @click="openPicker('pickUpService')"/>
          <i class="icon-r-jt"></i>
        </div>

        <div class="inline-box line line-x-t">
          <label class="icon-feeder-price"></label>
          <span class="feeder-price-placeholder" v-if="!pickUpService.id && !pickUpChargeType">填写以上信息后获得实际价格</span>
          <span class="feeder-price-total" v-else>
            <i>费用：
              <em v-if="pickUpService.actualPayment === 0">免费</em>
              <em v-else>{{pickUpService.actualPayment | formatPrice}}</em>
            </i>
          </span>
          <input class="unui-switch feeder-switch" type="checkbox" v-if="pickUpService.id" v-model="isPickUpService"/>
        </div>
        <p class="feeder-notice" v-if="pickUpService.id" @click="jumpToFeederNotice(pickUpService.id)">接送服务须知</p>
      </div>
    </div>
    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-left line line-x-t clearfix" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span v-if="showPrice">{{ totalPrice | formatPrice }}</span>
          <span class="detail" v-show="priceMore">详情</span>
          <i class="yellow-jt-up" v-show="priceMore"></i>
        </div>
        <div class="buy-right">
          <input type="button" @click="orderCreate" :disabled="disableBtn" class="button button-primary" value="立即下单"/>
        </div>
      </div>
      <div class="price-detail" v-show="priceMore && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">汽车票总价（共{{passgerNum}}张）</span>
            <span class="price-d-box">{{ticketPrice | formatPrice}}</span>
          </p>
          <p class="line line-x-t" v-if="deliveryService.id && isDeliveryService">
            <span class="price-d-tit">送站</span>
            <span class="price-d-box">
              <i v-if="deliveryService.actualPayment === 0">免费</i>
              <i v-else>{{deliveryService.actualPayment | formatPrice}}</i>
            </span>
          </p>
          <p class="line line-x-t" v-if="pickUpService.id && isPickUpService">
            <span class="price-d-tit">接站</span>
            <span class="price-d-box">
              <i v-if="pickUpService.actualPayment === 0">免费</i>
              <i v-else>{{pickUpService.actualPayment | formatPrice}}</i>
            </span>
          </p>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import Mobidatetime from 'directives/mobiDateTime'
  import MainBox from 'components/mainBox/index'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'
  import { Group, XSwitch } from 'vux'
  const now = new Date()

  export default {
    directives: {
      Mobidatetime,
    },
    components: {
      MainBox,
      OrderBaseInfo,
      Group,
      XSwitch
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        fromPage:'',
        CITY_EXPRESS_BUS: TOOL.CITY_EXPRESS_BUS,
        ticketInfo: {
          aAddress:{},
          bAddress:{},
          customContents:[],
        },
        serviceInfoDTOs:[],
        serviceTypeDTO:{
          deliveryService: false,
          pickUpService: false
        },
        priceMore: false,
        showPriceDetail: false,
        tab: '',
        orderData: {
          formId: '',
          skuId: '',
          productTypeLevelOne: '',
          passengers: [],
          onSiteId:'',
          onStation: {
            name: TOOL.placeHolder.onStation
          },
          offSiteId:'',
          offStation: {
            name: TOOL.placeHolder.offStation
          },
          contactName: '',
          contactTelephone: '',
          insureTypeId: '', // 保险id
          insureName: '', // 保险名称
          totalPrem: 0, // 保险价格
          discountInfo:{
            userCouponId:''
          },
          needInvoice: false,
          shuttleOrderDTOs: []
        },
        deliveryChargeType: '',
        isDeliveryService: false,
        deliveryService:{
          id: '',
          serviceType: 1, // 服务类型 0：到站接车 1：送车到站
          onStation: '',
          offStation: '',
          actualPayment: 0,
          passgerNum: 1,
          passgerNumText: '乘车人：1人',
          startupTime: '', // 用车时间
        },
        pickUpChargeType:'',
        isPickUpService: false,
        pickUpService:{
          id: '',
          serviceType: 0, // 服务类型 0：到站接车 1：送车到站
          onStation: '',
          offStation: '',
          actualPayment: 0,
          passgerNum: 1,
          passgerNumText: '乘车人：1人',
          startupTime: '', // 用车时间
        },
        ticketPrice: 0,
        disableBtn: false,
        showPrice: true,
        startConfigStart: {
          min: now,
          max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          dateWheels: '|MM dd DD|',
          dateFormat: 'yy-mm-dd',
          timeWheels: 'HHii',
          steps: {
            minute: TOOL.minuteStep,
            zeroBased: true
          }
        },
        startConfigEnd: {
          min: now,
          max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          dateWheels: '|MM dd DD|',
          dateFormat: 'yy-mm-dd',
          timeWheels: 'HHii',
          steps: {
            minute: TOOL.minuteStep,
            zeroBased: true
          }
        },
        picker: '',
        dataType:'',
        passgerNum: 0,
      }
    },
    computed: {
      totalPrice () {
        let price = this.ticketPrice
        if(this.deliveryService.id && this.isDeliveryService){
          this.priceMore = true
          price += this.deliveryService.actualPayment
        }

        if(this.pickUpService.id && this.isPickUpService){
          this.priceMore = true
          price += this.pickUpService.actualPayment
        }

        return price
      },
    },
    watch: {
      deliveryService: {
        handler (newVal) {
          this.shuttleCalPrice(newVal, 'deliveryService')
        },
        deep: true
      },
      pickUpService: {
        handler (newVal){
          this.shuttleCalPrice(newVal, 'pickUpService')
        },
        deep: true
      },
    },
    mounted () {
      this.orderData.skuId = this.$route.query.skuId
      this.fromPage = this.$route.query.fromPage
      if(appStorage.get('feederOrder')){
        this.orderData = Object.assign(this.orderData, JSON.parse(appStorage.get('feederOrder')))
        this.orderData.formId = TOOL.getTimeStamp()
        this.passgerNum = this.orderData.passengers.length
        this.ticketPrice = this.orderData.ticketPrice
        this.initPicker(this.orderData.passengers.length)
        this.citySkuFindById()
      }else{
        this.$router.go(-1)
      }
    },
    methods: {
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = {
          deliveryService: this.deliveryService,
          pickUpService: this.pickUpService,
          isDeliveryService: this.isDeliveryService,
          isPickUpService: this.isPickUpService,
          tab: this.tab,
        }
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      goBack () {
        this.saveForm()
        this.$router.go(-1)
      },

      jumpToFeederNotice (feederId) {
        this.saveForm()
        this.$router.push({
          name: 'feederNotice',
          query:{
              feederId: feederId
          }
        })
      },

      initPicker (maxNum) {
        let pikerData = []
        for(let i = 0; i < maxNum; i++){
          pikerData.push({
            text: `${i + 1}人`,
            value: i + 1,
          })
        }
        this.picker = new Picker({
          data: [pikerData],
          selectedIndex: [0],
          title: '人数选择'
        });

        this.picker.on('picker.select', (selectedVal, selectedIndex) => {
          let passgerNum = selectedVal[0]
          this[this.dataType].passgerNum = passgerNum
          this[this.dataType].passgerNumText = `乘车人：${passgerNum}人`
        })
      },

      openPicker (dataType) {
        this.dataType = dataType
        this.picker.show();
      },

      selectService (dataType) {
        this.tab = dataType
      },

      /**
       * 查询车票SKU信息
       */
      citySkuFindById () {
        this.$store.commit('UPDATE_LOADING', true)
        let routers = {
            'busDetail': 'citySkuFindById',
            'schBusDetail': 'schBusDetailById',
            'airportTicket': 'airportSkuFindById',
            'trainstationTicket': 'trainStationSkuFindById',
            'schoolBusExpress': 'schoolSkuFindById',
            'scenicBusExpress': 'scenicSkuFindById',
        }


        api[routers[this.fromPage]](this.orderData.skuId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            if(this.fromPage === 'schBusDetail' ){
              this.ticketInfo = data.resultData.stationSku
              this.serviceInfoDTOs = data.resultData.serviceInfoDTOs
              this.deliveryService.offStation = {
                latitude: '',
                longitude: '',
                name: this.ticketInfo.aAddress.detailAddress,
                rank:1
              }

              this.pickUpService.onStation = {
                latitude: '',
                longitude: '',
                name: this.ticketInfo.bAddress.detailAddress,
                rank:1
              }
            }else{
              this.ticketInfo = data.resultData
              this.serviceInfoDTOs = this.ticketInfo.serviceInfoDTOs

              if(this.ticketInfo.onStationList){
                for (let i =0; i < this.ticketInfo.onStationList.length; i++) {
                  let onStation = this.ticketInfo.onStationList[i]
                  if(onStation.siteId === this.orderData.onSiteId){
                    this.deliveryService.offStation = {
                      latitude: onStation.latitude,
                      longitude: onStation.longitude,
                      name: onStation.name,
                      rank:1
                    }
                  }
                }
              }

              if(this.ticketInfo.offStationList){
                for (let i =0; i < this.ticketInfo.offStationList.length; i++) {
                  let offStation = this.ticketInfo.offStationList[i]
                  if(offStation.siteId === this.orderData.offSiteId){
                    this.pickUpService.onStation = {
                      latitude: offStation.latitude,
                      longitude: offStation.longitude,
                      name: offStation.name,
                      rank:1
                    }
                  }
                }
              }
            }
            this.ticketInfo.onStation = {}
            this.ticketInfo.onStation.name = this.orderData.onStation
            this.ticketInfo.offStation = {}
            this.ticketInfo.offStation.name = this.orderData.offStation
            this.orderData.productTypeLevelOne = this.ticketInfo.productTypeLevelOne


            for(let i = 0; i < this.serviceInfoDTOs.length; i++){
              let feederService = this.serviceInfoDTOs[i]

              let startupTimeMs = TOOL.newGetDate({date: this.ticketInfo.startupTime, type: 'formatDate'}).getTime()
              if(feederService.serviceType === 1){
                this.deliveryChargeType = feederService.chargeType // 0：收费，1：免费
                this.serviceTypeDTO.deliveryService = true
                let nowMs = new Date().getTime()
                let minTime = feederService.preOrderStartTime
                minTime = nowMs + minTime * 60 * 1000
                let maxTime = startupTimeMs - 60 * 60 * 1000

                this.startConfigStart = {
                  min: new Date(minTime),
                  max: new Date(maxTime),
                  dateWheels: '|MM dd DD|',
                  dateFormat: 'yy-mm-dd',
                  timeWheels: 'HHii',
                  steps: {
                    minute: TOOL.minuteStep,
                    zeroBased: true
                  }
                }
                this.deliveryService.startupTime = TOOL.newGetDate({date: maxTime, type: 'holeDate'})
              }
              if(feederService.serviceType === 0){
                this.pickUpChargeType = feederService.chargeType
                this.serviceTypeDTO.pickUpService = true
                this.startConfigEnd = {
                  min: new Date(startupTimeMs),
                  max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
                  dateWheels: '|MM dd DD|',
                  dateFormat: 'yy-mm-dd',
                  timeWheels: 'HHii',
                  steps: {
                    minute: TOOL.minuteStep,
                    zeroBased: true
                  }
                }
              }
            }

            if(this.serviceTypeDTO.deliveryService && this.serviceTypeDTO.pickUpService){
              this.tab = 'deliveryService'
            }else if(this.serviceTypeDTO.pickUpService){
              this.tab = 'pickUpService'
            }else{
              this.tab = 'deliveryService'
            }

            this.getLocalData()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getLocalData () {
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.deliveryService =  Object.assign(this.deliveryService, localData.deliveryService)
          this.pickUpService =  Object.assign(this.pickUpService, localData.pickUpService)
          this.isDeliveryService = localData.isDeliveryService
          this.isPickUpService = localData.isPickUpService
          this.tab = localData.tab || 'deliveryService'
        }
      },

      shuttleCalPrice (param, dataType) {
        if(!param.onStation || !param.offStation || !param.passgerNum){
          return
        }
        let id
        let longitude
        let latitude
        for(let i = 0; i < this.serviceInfoDTOs.length; i++) {
          let feederService = this.serviceInfoDTOs[i]
          if(dataType === 'deliveryService' && feederService.serviceType === 1 ){
            id = feederService.id
          }
          if(dataType === 'pickUpService' && feederService.serviceType === 0 ){
            id = feederService.id
          }
        }

        if(dataType === 'deliveryService'){
          longitude = param.onStation.longitude
          latitude = param.onStation.latitude
        }else{
          longitude = param.offStation.longitude
          latitude = param.offStation.latitude
        }

        api.shuttleCalPrice(id, {
          longitude: longitude,
          latitude: latitude,
          passengerNum: param.passgerNum,
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this[dataType].id = id
            this[dataType].actualPayment = data.resultData
            if(dataType === 'deliveryService'){
              this.isDeliveryService = true
              if (appStorage.get(this.pageRouter)) {
                let localData = JSON.parse(appStorage.get(this.pageRouter))
                this.isPickUpService = localData.isPickUpService
              }
            }else{
              this.isPickUpService = true
              if (appStorage.get(this.pageRouter)) {
                let localData = JSON.parse(appStorage.get(this.pageRouter))
                this.isDeliveryService = localData.isDeliveryService
              }
            }
          }else{
            if(dataType === 'deliveryService'){
              this.isDeliveryService = false
            }else{
              this.isPickUpService = false
            }
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 跳转上下车点选择
       * @param dataType 接或送：deliveryService, pickUpService
       * @param dataKey 站点类型：onStation, offStation
       */
      jumpToAppointStation (dataKey, dataType) {
        this.saveForm()
        let feederId
        for(let i = 0; i < this.serviceInfoDTOs.length; i++) {
          let feederService = this.serviceInfoDTOs[i]
          if(dataType === 'deliveryService' && feederService.serviceType === 1 ){
            feederId = feederService.id
          }
          if(dataType === 'pickUpService' && feederService.serviceType === 0 ){
            feederId = feederService.id
          }
        }
        let query = {
          fromPage: this.pageRouter,
          dataType: dataType,
          dataKey: dataKey,
          feederId: feederId,
        }
        if (dataType === 'deliveryService') {
          query.searchCity = this.ticketInfo.aAddress.city
        } else {
          query.searchCity = this.ticketInfo.bAddress.city
        }
        this.$router.push({
          name: 'appointStation',
          query: query
        })
      },

      pushFeederData (dataType, isUsed) {
        if(dataType.id && isUsed){
          let feederService = Object.assign({}, dataType)
          delete feederService.passgerNumText
          feederService.startupTime = TOOL.newGetDate({date: feederService.startupTime, type: 'holeDate'})
          this.orderData.shuttleOrderDTOs.push(feederService)
        }
      },

      /**
       * 新增订单
       */
      orderCreate () {
        this.picker.hide();
        let orderData = Object.assign({}, this.orderData)
        this.pushFeederData(this.deliveryService, this.isDeliveryService)
        this.pushFeederData(this.pickUpService, this.isPickUpService)

        this.$store.commit('UPDATE_LOADING', true)

        delete this.orderData.ticketPrice

        if (!appStorage.get('X-Auth-Token')) {
          this.saveOrder(this.fromPage, this.orderData)
          return;
        }
        this.orderCreated(this.fromPage, orderData)
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  @import "../../../styles/switch.less";
  .feeder-price{
    position: absolute;
    top:22px;
    right:20px;
    color:#4c4c4c;
  }
  .feeder-box{
    background: #fff;
  }
  .feeder-type{
    display: flex;
    padding:22px 0;
    li{
      position: relative;
      flex:1;
      height:40px;
      line-height:40px;
      text-align:center;
      font-size:28px;
      color:#888;
      &:first-child{
        border-right:1px solid #f2f2f2;
      }
      .check-box{
        display:inline-block;
        width: 40px;
        height:40px;
        line-height:40px;
        vertical-align: bottom;
      }
    }
    .active{
      color:#121212;
      &:after{
        display:block;
        content: "";
        position:absolute;
        bottom: -21px;
        left:50%;
        margin-left:-50px;
        width:100px;
        height:4px;
        border-radius:2px;
        background:#ff6600;
      }
    }
    .feeder-yes{
      position: absolute;
      top:0;
      width:44px;
      height:40px;
      background:url("../../../assets/feeder_yes.png") no-repeat right center;
      background-size:24px 24px;
      vertical-align: middle;
      display:none;
    }
    .hold{
      color:#ff6600;
      .feeder-yes{
        display:inline-block;
      }
    }
  }
  .feeder-form{
    label{
      width: 60px;
    }
    .icon-time{
      background:url("../../../assets/order_time.png") no-repeat center center;
      background-size: 30px 30px;
    }
    .icon-start{
      background:url("../../../assets/order_start.png") no-repeat center center;
      background-size: 30px 30px;
    }
    .icon-end{
      background:url("../../../assets/order_end.png") no-repeat center center;
      background-size: 30px 30px;
    }
    .icon-passenger{
      background:url("../../../assets/feeder_user.png") no-repeat center center;
      background-size: 20px 20px;
    }
    .icon-feeder-price{
      background:url("../../../assets/feeder_price.png") no-repeat center center;
      background-size: 26px 26px;
    }
    .feeder-notice{
      position: absolute;
      right:0;
      bottom: -40px;
      padding-left: 36px;
      line-height:1.4;
      background: url("../../../assets/feeder-notice.png") no-repeat left center;
      background-size:26px 26px;
      color: @fc-2290f9;
    }
  }
  .feeder-price-placeholder{
    color:#888;
  }
  .feeder-price-total{
    em{
      color:#ff6600;
      font-size:36px;
    }
  }
  .price-detail-box{
    padding:0;
    p{
      margin:0;
      height:80px;
      overflow:hidden;
    }
    .price-d-tit{
      float:left;
      width:auto;
      line-height:80px;
      color:#121212;
    }
    .price-d-box{
      float:right;
      line-height:80px;
      text-align:right;
    }
  }
  .text-gray{
    span,
    em,
    input{
      color:#888!important;
    }
  }
</style>
