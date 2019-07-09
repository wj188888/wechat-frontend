<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="inline-box" @click="jumpToAppointStation('onStation')">
      <label>上车地点</label>
      <span v-text="onAddress"></span>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t" @click="jumpToAppointStation('offStation')">
      <label>下车地点</label>
      <span v-text="offAddress"></span>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box mar-b-20 line line-x">
      <label>出行时间</label>
      <input type="text" placeholder="请选择出行时间" v-mobidatetime:startConfig="startTime" readonly/>
      <i class="icon-r-jt"></i>
    </div>

    <set-contact
      v-model="orderData.contactTelephone"
      @input="orderData.contactTelephone = arguments[0]"
      :page-router="pageRouter"
      :save-form="saveForm">
    </set-contact>

    <car-type-select
      v-model="avaibleCar"
      :product-id="productId"
      :product-type="orderData.productTypeLevelOne"
      :from-page-router="pageRouter"
      :save-form="saveForm">
    </car-type-select>

    <ticket-notice
      refund-notice-type="refundNotice2"
      :custom-contents="cityProductOne.customContents">
    </ticket-notice>

    <div slot="footer">
      <pay-dialog :show="showPayDialog" @verifyPayPassword="verifyPayPassword"></pay-dialog>
      <div class="abs-bottom-box">
        <div class="buy-left" @click="showPriceDetail = !showPriceDetail">
          <label>共计</label>
          <span>
            {{orderData.integralPrice}} <i class="small">积分</i>
             <em v-if="cityProductOne.serviceFee">
              <i class="small"> + ¥</i>{{cityProductOne.serviceFee}}
            </em>
          </span>
          <span class="detail" v-show="cityProductOne.serviceFee">详情</span>
          <i class="yellow-jt-up" v-show="cityProductOne.serviceFee"></i>
        </div>
        <div class="buy-right">
          <input class="button button-primary" type="button" :disabled="disableBtn" @click="orderCreateHandel('special')" value="立即叫车"/>
        </div>
      </div>
      <div class="price-detail" v-show="cityProductOne.serviceFee && showPriceDetail">
        <div class="price-mask" @click="showPriceDetail = false"></div>
        <div class="price-detail-box">
          <p>
            <span class="price-d-tit">行程费用</span>
            <span>{{orderData.integralPrice}}积分</span>
          </p>
          <p v-if="cityProductOne.serviceFee">
            <span class="price-d-tit">服务费用</span>
            <span>{{cityProductOne.serviceFee | formatPrice('yuan')}}</span>
          </p>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import Mobidatetime from 'directives/mobiDateTime'
  import MainBox from 'components/mainBox/index'
  import SetContact from 'appComponents/setContact/index'
  import CarTypeSelect from 'appComponents/carTypeSelect/index'
  import TicketNotice from 'components/ticketNotice/index'
  import PayDialog from 'appComponents/dialog/payDialog'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  const now = new Date()

  export default {
    directives: {
      Mobidatetime,
    },
    components: {
      MainBox,
      SetContact,
      CarTypeSelect,
      TicketNotice,
      PayDialog
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        productId: '',
        cityProductOne: {
          customContents:[]
        },
        orderData: {
          formId: TOOL.getTimeStamp(),
          productId: '',
          productTypeLevelOne: '',
          startTime: '',
          carType: '', //汽车所属级别：0.5座经济轿车、1.5座高级轿车、2.7座商务、3.经济SUV、4.高级SUV、5.小巴、6.中巴、7.大巴
          totalSeats:'', //车辆座位数
          onStation: {},
          offStation: {},
          contactName: '',
          contactTelephone: '',
          needInvoice: false,
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          integralExId: '',
          integralType: 0, // 积分兑换类型 0：兑换产品，1：积分抵现
          integralPrice: 0, //抵用积分
        },
        avaibleCar: '',
        startTime:'',
        startConfig: TOOL.getDateTimeConfig(),
        startPlace: '',
        endPlace: '',
        onAddress: TOOL.placeHolder.onStation,
        offAddress: TOOL.placeHolder.offStation,
        passengerIdCard: '', //旅客id
        disableBtn: true,
        price: 0,
        priceMore: false,
        showPriceDetail: false,
      }
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.startPlace = this.$route.query.startPlace
      this.endPlace = this.$route.query.endPlace
      this.orderData.integralExId = this.$route.query.integralExId
      this.orderData.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.productFindById()
    },
    methods: {

      /**
       * 存储订单到本地数据
       */
      saveForm () {
        let localData = this.orderData
        localData.passengerIdCard = this.passengerIdCard
        localData.avaibleCar = this.avaibleCar
        localData.startTime = this.startTime
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 城际包车SKU查询
       */
      productFindById () {
        let resource
        switch(this.orderData.productTypeLevelOne){
          case 'CITY_BUS':
            resource = 'cityProductFindById'
            break;
          case 'AIRPORT_BUS':
            resource = 'airportProductFindById'
            break;
          case 'TRAIN_STATION_BUS':
            resource = 'trainStationProductFindById'
            break;
          case 'SCHOOL_BUS':
            resource = 'schoolProductFindById'
            break;
          case 'SCENIC_BUS':
            resource = 'scenicProductFindById'
            break;
        }

        api[resource](this.productId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.cityProductOne = data.resultData;
            this.orderData.productId = this.productId

            this.startConfig = TOOL.getDateTimeConfig(this.cityProductOne.preOrderStartMinute, this.cityProductOne.preOrderEndMinute, this.cityProductOne.responseStartTime, this.cityProductOne.responseEndTime)

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

          this.passengerIdCard = localData.passengerIdCard
          if(localData.avaibleCar){
            this.avaibleCar = localData.avaibleCar
            this.price = this.avaibleCar.price
            this.disableBtn = false
          }
          this.startTime = localData.startTime
          delete localData.passengerIdCard
          delete localData.avaibleCar
          delete localData.startTime

          this.orderData = localData
          this.orderData.carType = this.avaibleCar.carType
          this.orderData.totalSeats = this.avaibleCar.seats
          this.orderData.integralPrice = this.avaibleCar.integralPrice || 0

          if (this.orderData.onStation.name) {
            this.onAddress = this.startPlace + ' ' + this.orderData.onStation.name
          }
          if (this.orderData.offStation.name) {
            this.offAddress = this.endPlace + ' ' + this.orderData.offStation.name
          }
        } else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.orderData.contactTelephone = usrInfo.phone
        }
      },

      sharePage () {
        if(this.cityProductOne.shareThemes && this.cityProductOne.shareThemes.length){
          let max = this.cityProductOne.shareThemes.length - 1
          let random = Math.round(Math.random() * max);
          let shareTheme = this.cityProductOne.shareThemes[random]
          interfaceApi.share({
            share: true,
            shareUrl: location.href,
            shareTitle: shareTheme.title,
            shareDesc: shareTheme.description,
            shareImgUrl: shareTheme.image
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
          productId: this.productId,
          productTypeLevelOne: this.cityProductOne.productTypeLevelOne,
          productTypeLevelTwo: this.cityProductOne.productTypeLevelTwo
        })
      },

      /**
       * 跳转上下车点选择
       * @param dataKey 站点类型：onStation, offStation
       */
      jumpToAppointStation (dataKey) {
        this.saveForm()
        let query = {
          fromPage: this.pageRouter,
          dataKey: dataKey,
          productId: this.productId,
          productTypeLevelOne: this.cityProductOne.productTypeLevelOne,
        }
        if (dataKey === 'onStation') {
          query.searchCity = this.cityProductOne.aAddress.city
          query.searchAddress = this.cityProductOne.aAddress.detailAddress
        } else {
          query.searchCity = this.cityProductOne.bAddress.city
          query.searchAddress = this.cityProductOne.bAddress.detailAddress
        }
        this.$router.push({
          name: 'appointStation',
          query: query
        })
      },

    }
  }
</script>
