<template>
  <main-box :title="title" main-class="pad-20">
    <carhailing
      :page-router="pageRouter"
      :local-data="localData"
      :from="from"
      :to="to"
      :save-form="saveForm"
      :time-text="localData.timeText">
    </carhailing>

    <div class="carhailing-car-box mar-b-20 bg-fff line line-box radius-box">
      <h2>车型选择</h2>
      <div class="carhailing-car-scroll">
        <ul class="carhailing-car-list" :style="{'width': carList.length * 236 / 20 + 'rem'}">
          <li :class="[{active: localData.carGrade.code === car.code}, getCarClass(car.code)]"
              v-for="car in carList"
              @click="localData.carGrade = car">
            {{car.name}}<i v-show="estimatedPrice > 0"></i>
          </li>
        </ul>
      </div>
      <p class="carhailing-pre-price" :class="{'has-discount': (orderCouponPrice + reducedAmount) > 0}" v-show="estimatedPrice > 0">预估：<em>{{estimatedPrice}}</em>元</p>
      <p class="discount" v-if="(orderCouponPrice + reducedAmount) > 0">优惠券抵扣<em>{{(orderCouponPrice + reducedAmount)}}</em>元</p>
    </div>

    <div slot="footer">
      <div class="abs-bottom-box">
        <div class="buy-right buy-w100">
          <input type="button" class="button button-primary" :disabled="disableBtn" @click="chOrderCreate" value="立即约车" />
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import Carhailing from 'appComponents/carhailing/index'
  import { mapState } from 'vuex'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
      Carhailing
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        showTelDialog: false,
        errorPhoneText:'',
        isCarActive:'',
        carList:{},

        from:'定位中...',
        to:'',
        estimatedPrice:0,

        localData:{
          passengerIdCard:'',
          contactTelephone:'',
          from: {
            city: '',
            county: '',
            detailAddress: '',
            point: ''
          },
          to: {},
          carGrade: {},
          timeText: '现在',
          startTime: new Date().getTime(), //出发时间
          tripType: 0, // 0：实时 1：预约
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
        },

        orderStatus:'',
        orderId:'',
        orderData: {
          formId: TOOL.getTimeStamp(), //表单ID
          startCity: '', //出发地城市
          startCounty: '', //出发地区县
          startDetailAddress: '', //出发地具体地址
          startLongitude: '', //出发地经度
          startLatitude: '', //出发地纬度
          endCity: '', //目的地城市
          endCounty: '',
          endDetailAddress: '', //目的地具体地址
          endLongitude: '', //目的地经度
          endLatitude: '', //目的地纬度
          startTime: '', //出发时间
          tripType: 0, // 0：实时 1：预约
          contactPhone: '', //联系电话
          carGrade: '', //汽车所属级别：0.5座经济轿车、1.5座高级轿车、2.7座商务、3.经济SUV、4.高级SUV、5.小巴、6.中巴、7.大巴
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
        },
        disableBtn: true,
        unFinishedOrderTripType: ''
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      })
    },
    watch: {
      localData:{
        handler (newVal) {
          if(newVal.from && newVal.to){
            this.chOrderGetEstimated()
          }
        },
        deep:true
      }
    },
    created () {
      this.initialize()
      if(this.appAddress){
        if(this.localData.from.city){
          this.setStartPlace()
        }else if(this.appAddress !== TOOL.locationFail){
          this.successLocation(this.appAddress)
        }else{
          this.failLocation()
        }
      }else{
        this.$store.watch((state) => {
          return state.city.appAddress;
        }, (newVal, oldVal) => {
          if(newVal && newVal !== TOOL.locationFail){
            this.successLocation(newVal)
          }else{
            this.failLocation(true)
          }
        }, {deep: true});
      }
    },
    mounted () {
      let _this = this
      let $date = $('#date')
      this.time = new Date().getTime()
      $date.timePicker({
        title: '选择出行时间',
        delay: 15,
        day: {
          step: 1,
          len: 3,
          filter: ['今天', '明天', '后天'],
          format: 'M月d日'
        },
        hour: {
          step: 1,
          min: 0,
          max: 23
        },
        minute: {
          step: 10,
          min: 0,
          max: 50
        },
      }).on('timePicker.select', function (e, selectedTime, selectedText) {
        _this.localData.timeText = selectedText
        _this.localData.startTime = selectedTime
        if(selectedText !== '现在'){
          _this.localData.tripType = 1
        }else{
          _this.localData.tripType = 0
        }
      });
      $date.on('click', function () {
        $(this).timePicker('show');
      });
    },
    methods: {
      initialize () {
        if(appStorage.get(this.pageRouter)){
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.localData = Object.assign(this.localData, localData)
    
          if(this.localData.from && this.localData.from.city){
            this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.detailAddress
          }
          if(this.localData.to && this.localData.to.city){
            this.to = TOOL.getCityOrCounty(this.localData.to) + '·' + this.localData.to.detailAddress
          }
        }else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.localData.contactTelephone = usrInfo.phone
        }
        if(!appStorage.get(this.pageRouter)){
          this.chBaseOrderFindUnFinishedOrder()
        }
        this.chProductGetChCarGrade()
      },
      
      /**
       * 存储订单到本地数据
       */
      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },

      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },
  
      failLocation (isShowAlert) {
        this.from = ''
        if(!isShowAlert) return
        this.$store.dispatch('showConfirm', {
          title: '定位失败',
          confirmText: '手动选择',
          cancelText: '取消',
          content: '请检查您的定位服务是否开启',
          onConfirm: () => {
            this.jumpToSetPosition('from')
          },
          onCancel: () => {
          }
        })
      },
  
      jumpToSetPosition (dataKey) {
        this.saveForm()
        this.$router.push({
          name: 'setPosition',
          query:{
            pageRouter: this.pageRouter,
            dataKey: dataKey
          }
        })
      },
  
      successLocation (address) {
        let position = address.position
        this.localData.from = {
          city: address.city,
          county: address.district,
          detailAddress: address.detailAddress,
          lat: position.lat,
          lng: position.lng
        }
        this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.detailAddress
      },
      
      setStartPlace () {
        if(appStorage.get(this.pageRouter)){
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          let fromAddress = localData.from
          if(fromAddress && fromAddress.city){
            this.localData.from = fromAddress
            this.from = TOOL.getCityOrCounty(fromAddress) + '·' + fromAddress.detailAddress
          }
        }
      },

      //0生成订单, 1派单成功, 10预约订单司机开始任务, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
      chBaseOrderFindUnFinishedOrder () {
        this.$store.commit('UPDATE_LOADING', true)
        api.chBaseOrderFindUnFinishedOrder('CAR_HAILING').then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.orderStatus = data.resultData.chStatus
            this.orderId = data.resultData.orderId
            this.unFinishedOrderTripType = data.resultData.tripType
            this.orderProcess()
          }
        })
      },

      orderProcess () {
        let msg, pageName,confirmText, cancelText;
        switch (this.orderStatus){
          case 0:
            msg = '您还有未完成的行程'
            confirmText = '进入'
            cancelText = '取消'
            pageName = 'waitForCar'
            break;
          case 1:
            msg = '您还有未完成的行程'
            confirmText = '进入'
            cancelText = '取消'
            if(this.unFinishedOrderTripType === 1){
              pageName = 'waitForTime'
            }else{
              pageName = 'holdForCar'
            }
            break;
          case 2:
          case 3:
          case 10:
            msg = '您还有未完成的行程'
            confirmText = '进入'
            cancelText = '取消'
            pageName = 'holdForCar'
            break;
          default:
            msg = '您还有一个未支付订单'
            confirmText = '支付'
            cancelText = '取消'
            pageName = 'carhailingOrderDetail'
        }
        this.$store.dispatch('showConfirm', {
          title: '确认',
          confirmText: confirmText,
          cancelText: cancelText,
          content: msg,
          onConfirm: () => {
            this.$router.push({
              name: pageName,
              query:{
                orderId: this.orderId,
                productTypeLevelOne: 'CAR_HAILING'
              }
            })
          },
          onCancel: () => {
          }
        })
      },

      chProductGetChCarGrade () {
        this.$store.commit('UPDATE_LOADING', true)
        api.chProductGetChCarGrade().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.carList = data.resultData
            this.localData.carGrade = this.carList[0]
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getCarClass (code) {
        return 'icon-car-' + code
      },

      /**
       * 跳转到乘客列表新增乘客
       */
      jumpToPassenger () {
        this.saveForm()
        this.$router.push({
          name: 'passengerList',
          query: {
            page: this.pageRouter,
            dataKey: 'contact'
          }
        })
      },

      tanspoint () {
        let fromPoint = TOOL.tencentToBaidu({
          lat: this.localData.from.lat,
          lng: this.localData.from.lng,
        })
        let toPoint = TOOL.tencentToBaidu({
          lat: this.localData.to.lat,
          lng: this.localData.to.lng,
        })
        return {
          fromPoint,
          toPoint
        }
      },

      chOrderGetEstimated () {
        if(!this.localData.carGrade) return
        let validata = TOOL.formValidate([
          {value: this.localData.from.lat, emptyTips: '出发地不能为空'},
          {value: this.localData.to.lat, emptyTips: '目的地不能为空'},
          {value: this.localData.carGrade.name, emptyTips: '请选择车型'},
        ]);
        if (!validata.valid) {
          return false;
        }
        
        let fromPoint = this.tanspoint().fromPoint
        let toPoint = this.tanspoint().toPoint

        let origin = fromPoint.lat + ',' + fromPoint.lng
        let destination = toPoint.lat + ',' + toPoint.lng

        let originCity = TOOL.deleteCityShi(this.localData.from.city)

        api.chOrderGetEstimated({
          origin: origin,  // 起点经纬度，格式如："40.056878,116.30815"
          destination: destination, // 目的地经纬度
          originCity: originCity, // 出发地城市，不含市字
          originCounty: this.localData.from.county, //出发地县/区
          destinationCity: this.localData.to.city, //目的地城市 如：成都
          carGrade: this.localData.carGrade.code,  //车辆级别
          tripType: this.localData.tripType,
          orderTime: TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.estimatedPrice = data.resultData.estimatedPrice
            this.initActivityAndCoupon()
            this.disableBtn = false
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.estimatedPrice
        this.passengerNum = 1
        this.ticketTotalAmount = this.estimatedPrice
        this.activityAndCounponParam = {
          type: 'productId',
          id: this.productId,
          productId: this.productId,
          serviceCity: TOOL.deleteCityShi(this.localData.from.city),
          productTypeLevelOne: 'CAR_HAILING',
          startupTime: TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        }
        this.getOptimalActivity()
      },

      chOrderCreate () {
        if(this.disableBtn){
          this.$store.dispatch('showError', '查不到价格信息，暂不能约车')
        }

        if(this.orderId && this.unFinishedOrderTripType === 0){
          this.orderProcess()
          return
        }

        let fromPoint = this.tanspoint().fromPoint
        let toPoint = this.tanspoint().toPoint

        this.orderData.contactPhone = this.localData.contactTelephone
        this.orderData.startCity = TOOL.deleteCityShi(this.localData.from.city)
        this.orderData.startCounty = this.localData.from.county
        this.orderData.startDetailAddress = this.localData.from.detailAddress
        this.orderData.startLongitude = fromPoint.lng
        this.orderData.startLatitude = fromPoint.lat

        this.orderData.endCity = TOOL.deleteCityShi(this.localData.to.city)
        this.orderData.endCounty = this.localData.from.county
        this.orderData.endDetailAddress = this.localData.to.detailAddress
        this.orderData.endLongitude = toPoint.lng
        this.orderData.endLatitude = toPoint.lat

        this.orderData.carGrade = this.localData.carGrade.code
        this.orderData.startTime = TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        this.orderData.tripType = this.localData.tripType

        let validata = TOOL.formValidate([
          {value: this.orderData.contactPhone, emptyTips: '手机号码不能为空',regName: 'telephone',regTips: '手机号码格式不正确'},
          {value: this.orderData.startLongitude, emptyTips: '出发地点不能为空'},
          {value: this.orderData.endLongitude, emptyTips: '目的地不能为空'},
          {value: this.orderData.carGrade, emptyTips: '请选择车型'},
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.disableBtn = true
        if (!appStorage.get('X-Auth-Token')) {
          this.disableBtn = false
          this.saveOrder(this.pageRouter, this.orderData)
          return;
        }
        this.orderCreated(this.pageRouter)
      }

    }
  }
</script>
<style lang="less" scoped>
  .carhailing-car-box{
    text-align: center;
    h2{
      height:100px;
      line-height:100px;
      font-size:32px;
      color:#121212;
    }
    .carhailing-pre-price{
      height:120px;
      line-height:120px;
      font-size:28px;
      color:#ff6600;
      &.has-discount{
        line-height:100px;
      }
      em{
        position: relative;
        top:2PX;
        font-size:48px;
      }
    }
  }
  .carhailing-car-scroll{
    width:100%;
    overflow-x:auto;
    overflow-y:hidden;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      &:horizontal {
        display: none;
      }
    }
  }
  .carhailing-car-list {
    width:2000px;
    border-top:1PX solid #f2f2f2;
    border-bottom:1PX solid #f2f2f2;
    li {
      position: relative;
      display:inline-block;
      width: 236px;
      padding:136px 0 25px;
      background-repeat:no-repeat;
      background-position: center 30px;
      background-size:152px 86px;
      font-size:24px;
      color:#ccc;
      opacity:0.7;
      &.icon-car-0{
        background-image:url("../../../assets/carhailing/jingji_5.png")
      }
      &.icon-car-1{
        background-image:url("../../../assets/carhailing/haohua_5.png")
      }
      &.icon-car-2{
        background-image:url("../../../assets/carhailing/shangwu.png")
      }
      &.icon-car-3{
        background-image:url("../../../assets/carhailing/jingji_suv.png")
      }
      &.icon-car-4{
        background-image:url("../../../assets/carhailing/haohua_suv.png")
      }
      i{
        display: none;
        position:absolute;
        left:50%;
        bottom: -2PX;
        margin-left:-5PX;
        content: "";
        width: 0;
        height: 0;
        border: 10PX solid transparent;
        border-bottom-color: #eee;
        z-index:100;
        &:after{
          content: "";
          position:absolute;
          top:-8PX;
          left:-9PX;
          width: 0;
          height: 0;
          border: 9PX solid transparent;
          border-bottom-color: #fff;
        }
      }
      &.active{
        color:#121212;
        opacity:1;
        i{
          display:block;
        }
      }
    }
  }
  .discount{
    position: relative;
    top:-40px;
    font-size:24px;
    text-align:center;
    color:#888;
    em{
      color:#ff6600;
    }
  }
</style>
