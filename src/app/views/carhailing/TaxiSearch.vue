<template>
    <main-box :title="title" main-class="pad-20">
        <carhailing
                :page-router="pageRouter"
                :local-data="localData"
                :from="from"
                :to="to"
                :time-text="localData.timeText"
                :save-form="saveForm">
        </carhailing>

        <div class="inline-box">
            <span class="text-center">计价器计价</span>
        </div>

        <div slot="footer">
            <div class="abs-bottom-box">
                <div class="buy-right buy-w100">
                    <input type="button" class="button button-primary" :disabled="disableBtn" @click="taxiOrderCreate" value="立即叫车" />
                </div>
            </div>
        </div>
    </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Carhailing from 'appComponents/carhailing/index.vue'
  import { mapState } from 'vuex'
  import checkLogin from 'mixins/checkLogin.js'
  import createOrder from 'mixins/createOrder.js'

  export default {
    components: {
      MainBox,
      Carhailing
    },
    mixins: [checkLogin, createOrder],
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
        },

        orderStatus:'',
        orderId:'',
        orderData: {
          formId: TOOL.getTimeStamp(),
          startCity: '',
          startCounty:'',
          startDetailAddress: '',
          startLongitude: '',
          startLatitude: '',
          endCity: '',
          endCounty:'',
          endDetailAddress: '',
          endLongitude: '',
          endLatitude: '',
          startTime: '',
          tripType: 0, // 0：实时 1：预约
          contactPhone: '',
        },
        disableBtn: true
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      })
    },
    watch: {
      localData: {
        handler (newVal) {
          if (newVal.from && newVal.from.lat && newVal.to && newVal.to.lat && this.localData.contactTelephone) {
            this.disableBtn = false
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
          this.localData.timeText = localData.timeText
          this.localData.startTime = localData.startTime
          this.localData.tripType = localData.tripType
        }else if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.localData.contactTelephone = usrInfo.phone
        }
        if(!appStorage.get(this.pageRouter)){
          this.chBaseOrderFindUnFinishedOrder()
        }
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

      //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
      chBaseOrderFindUnFinishedOrder () {
        this.$store.commit('UPDATE_LOADING', true)
        api.chBaseOrderFindUnFinishedOrder('TAXI').then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
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
                productTypeLevelOne: 'TAXI'
              }
            })
          },
          onCancel: () => {
          }
        })
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

      taxiOrderCreate () {
        if(this.orderId && this.unFinishedOrderTripType === 0){
          this.orderProcess()
          return
        }

        let fromPoint = this.tanspoint().fromPoint
        let toPoint = this.tanspoint().toPoint

        this.orderData.contactPhone = this.localData.contactTelephone
        this.orderData.startCity = TOOL.deleteCityShi(this.localData.from.city)
        this.orderData.startCounty = TOOL.deleteCityShi(this.localData.from.county)
        this.orderData.startDetailAddress = this.localData.from.detailAddress
        this.orderData.startLongitude = fromPoint.lng
        this.orderData.startLatitude = fromPoint.lat

        this.orderData.endCity = TOOL.deleteCityShi(this.localData.to.city)
        this.orderData.endCounty = TOOL.deleteCityShi(this.localData.to.county)
        this.orderData.endDetailAddress = this.localData.to.detailAddress
        this.orderData.endLongitude = toPoint.lng
        this.orderData.endLatitude = toPoint.lat

        this.orderData.startTime = TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        this.orderData.tripType = this.localData.tripType

        let validata = TOOL.formValidate([
          {value: this.orderData.contactPhone, emptyTips: '手机号码不能为空',regName: 'telephone',regTips: '手机号码格式不正确'},
          {value: this.orderData.startLongitude, emptyTips: '出发地点不能为空'},
          {value: this.orderData.endLongitude, emptyTips: '目的地不能为空'},
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
