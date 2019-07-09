<template>
  <div class="pad-b-100 width-100">
    <div class="swiper-box car-hailing-indexbg">
      <div class="line line-x-t line-x-b banner">
        <swiper class="index-swiper" dots-position="center" :auto="true" :loop="true">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in swiper" :key="index">
            <a @click="jumpToURI(item.url)" v-if="!item.productId">
              <img :src="item.imageUrl" :title="item.title">
            </a>
            <a @click="jumpToProduct(item)" v-else>
              <img :src="item.imageUrl" :title="item.title">
            </a>
          </swiper-item>
        </swiper>
        <div class="banner_advert">
          <img src="../../../assets/advert1.png" alt="">
        </div>
      </div>
    </div>
    <div class="bg-fff radius-box">
      <div class="inline-box border-top">
        <label class="icon-carhailing-start">
          <i></i>
        </label>
        <input type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToSetPosition('from')"/>
      </div>
      <div class="inline-box">
        <label class="icon-carhailing-end">
          <i></i>
        </label>
        <input type="text" class="border-top" placeholder="您要去哪里" v-model="to" readonly @click="jumpToSetPosition('to')"/>
      </div>
      <div class="inline-box">
        <label class="icon-carhailing-phone"></label>
        <input type="tel" class="border-top" placeholder="请输入手机号码" v-model="localData.contactTelephone" readonly @click="inputTelphone()"/>
        <!--<span class="change-passenger" @click="jumpToPassenger">更换乘车人</span>-->
        <i class="now datePiker">{{localData.timeText === '现在' ? '现在' : '预约'}}</i>
      </div>
      <div class="inline-box datePiker" v-show="localData.timeText !== '现在'">
        <label class="icon-carhailing-time">
          <i></i>
        </label>
        <span class="border-top">{{localData.timeText}} 出发</span>
      </div>
    </div>
    <div class="carhailing-car-box mar-b-20 bg-fff line line-box radius-box">
      <h2>左右滑动选择车型</h2>
      <div class="carhailing-car-scroll">
        <ul class="carhailing-car-list">
          <li :class="[{active: localData.carGrade.code === car.code}, getCarClass(car.code)]"
              v-for="car in carList"
              @click="localData.carGrade = car">
            <i v-show="estimatedPrice > 0"></i>
          </li>
        </ul>
      </div>
      <div class="carhailing-pre-price" v-show="estimatedPrice > 0">
        <div class="content">
          <span v-for="car in carList" v-if="localData.carGrade.code === car.code">{{car.name}}</span>
        </div>
        <div class="content">预估：<em>{{estimatedPrice}}</em>元</div>
      </div>
    </div>
    <div class="button-content">
      <input type="button" class="button button-primary" :disabled="disableBtn" @click="chOrderCreate" value="立即约车" />
    </div>
    <flexbox :gutter="0" class="nav-margin-top" v-if="shortcutMenu === 'true'">
      <flexbox-item>
        <router-link class="city-bus-nav-box" :to="{name:'tripList'}">
          <img src="../../../assets/theme/cityBus/journey.png">
          <p>行程</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link class="city-bus-nav-box" :to="{name:'checkList'}">
          <img src="../../../assets/theme/cityBus/ticket_checking.png">
          <p>验票</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link class="city-bus-nav-box" :to="{name:'network'}">
          <img src="../../../assets/theme/cityBus/website.png">
          <p>网点</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <a class="city-bus-nav-box" @click="callService('')">
          <img src="../../../assets/theme/cityBus/service.png">
          <p>客服</p>
        </a>
      </flexbox-item>
    </flexbox>
    <pic-link type="top"></pic-link>
    <div class="mar-t-20" v-if="menuLength">
      <button-nav></button-nav>
    </div>
    <pic-link type="bottom"></pic-link>
    <text-link></text-link>
    <x-dialog v-model="showTelDialog" class="tel-dialog">
      <div class="tel-dialog-body line line-x-b">
        <a class="close" @click="showTelDialog = false"></a>
        <p class="tips">
          请输入乘车人联系电话
                  <span class="error" v-show="errorPhoneText">{{errorPhoneText}}</span>
        </p>
        <div class="telephone line line-x-b">
          <input type="tel" placeholder="请输入手机号码" maxlength="11" v-model="telephone">
        </div>
      </div>
      <input type="button" value="确定" @click="setThisTelePhone" class="button button-no-radius button-empty-white">
    </x-dialog>
  </div>
</template>.
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ThemeNavBar from 'appComponents/themeNavBar/index.vue'
  import buttonNav from 'appComponents/buttonNav/index.vue'
  import PicLink from 'appComponents/theme/picLink'
  import TextLink from 'appComponents/theme/textLink'
  import { Flexbox, FlexboxItem, XDialog, Swiper, SwiperItem } from 'vux'
  import { mapState } from 'vuex'

  import phone from 'mixins/phone.js'
  import checkLogin from 'mixins/checkLogin.js'
  import createOrder from 'mixins/createOrder.js'
  import service from 'mixins/service.js'

  export default {
    mixins: [phone, checkLogin, createOrder, service],
    components: {
      MainBox,
      Flexbox,
      FlexboxItem,
      XDialog,
      ThemeNavBar,
      buttonNav,
      PicLink,
      TextLink,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        swiper: [
          {urlName: 'city', imageUrl: 'static/pics/bannerCarhailing.png'}
        ],
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        showTelDialog: false,
        errorPhoneText:'',
        telephone:'',
        shortcutMenu: appStorage.get('shortcutMenu'),
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
          telephone:'',
          timeText: '现在',
          startTime: new Date().getTime(), //出发时间
          tripType: 0, // 0：实时 1：预约
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
        unFinishedOrderTripType: '',
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
      menuLength () {
        if(appStorage.get('productAliasItems')) {
          let productAliasItems = JSON.parse(appStorage.get('productAliasItems'))
          return productAliasItems.length
        }else{
          return 0
        }
      }
    },
    watch: {
      telephone () {
        this.$emit('on-change', this.telephone)
      },
      telephone (newVal){
        if(newVal.length === 11 && !TOOL.regExp['telephone'].test(newVal)){
          this.errorPhoneText = '手机号码格式不正确'
        }else{
          this.errorPhoneText = ''
        }
      },
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
    mounted() {
      let _this = this
      let $date = $('.datePiker')
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
      this.findAds()
    },
    methods: {
      initialize () {
        if(appStorage.get(this.pageRouter)){
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.localData.passengerIdCard = localData.passengerIdCard
          this.localData.contactTelephone = localData.contactTelephone
          this.localData.from = localData.from
          if(this.localData.from && this.localData.from.city){
            this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.detailAddress
          }
          this.localData.to = localData.to
          if(this.localData.to && this.localData.to.city){
            this.to = TOOL.getCityOrCounty(this.localData.to) + '·' + this.localData.to.detailAddress
          }
          this.localData.carGrade = localData.carGrade
          this.localData.timeText = localData.timeText
          this.localData.startTime = localData.startTime
          this.localData.tripType = localData.tripType
        }else if (appStorage.get('userInfo')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.localData.contactTelephone = usrInfo.phone
        }
        if(!appStorage.get(this.pageRouter)){
          this.chBaseOrderFindUnFinishedOrder()
        }
        this.chProductGetChCarGrade()
      },
      
      /**
       * 查询首页轮播图片
       */
      findAds () {
        api.findAdByPostion({postion: '0001'}).then(res => {
          this.$store.commit('UPDATE_LOADING', true)
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.$store.commit('UPDATE_LOADING', false)
            if (data.resultData.length > 0) {
              this.swiper = data.resultData
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
      /**
       * 轮播图跳转外链
       * @param url
       */
      jumpToURI (url) {
        interfaceApi.jumpToURI(url)
      },
      
      /**
       * 根据轮播图的产品类型跳转到指定的产品
       * @param data
       */
      jumpToProduct (data) {
        let type = data.productType;
        if (type === 'TOUR_BUS') {
          this.$router.push({
            name: 'productDetail',
            query: {id: data.productId}
          })
        } else if (type === 'LINE_BUS') {
          this.$router.push({
            name: 'carpoolingList',
            query: {productId: data.productId}
          })
        }
      },
      inputTelphone () {
        this.showTelDialog = true
        if(this.localData.contactTelephone){
          this.telephone = this.localData.contactTelephone
        }
      },

      setThisTelePhone () {
        let validata = TOOL.formValidate([
          {value: this.telephone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.errorPhoneText = validata.msg
          return false;
        }
        this.localData.contactTelephone = this.telephone
        this.showTelDialog = false
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
        api.chBaseOrderFindUnFinishedOrder('CAR_HAILING').then(res => {
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
          if (data.resultCode == '0') {
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

        this.orderData.endCity = this.localData.to.city
        this.orderData.endDetailAddress = this.localData.to.detailAddress
        this.orderData.endLongitude = toPoint.lng
        this.orderData.endLatitude = toPoint.lat

        this.orderData.carGrade = this.localData.carGrade.code

        this.orderData.carGrade = this.localData.carGrade.code
        this.orderData.startTime = TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        this.orderData.tripType = this.localData.tripType

        let validata = TOOL.formValidate([
          {value: this.orderData.contactPhone, emptyTips: '手机号码不能为空',regName: 'telephone',regTips: '手机号码格式不正确'},
          {value: this.orderData.startLongitude, emptyTips: '出发地不能为空'},
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
          this.saveOrder('carHailingSearch', this.orderData)
          return;
        }
        this.orderCreated('carHailingSearch')
      }

    }
  }
</script>

<style lang="less" scoped>
  .swiper-box {
    .index-swiper {
      height: 240px;
      .vux-swiper {
        height: 240px !important;
      }
    }
  }
  .car-hailing-indexbg{
    width: 100%;
    height: 240px;
    margin-bottom: 20px;
    padding: 0px;
    img{
      width: 100%;
      height: 240px;
    }
  }
  .border-top {
    border-top: 1PX solid #e5e5e5;
    border-radius: 0px;
  }
  .inline-box {
    position: relative;
    padding: 0px;
    height: 88px;
    input  {
      padding-right: 20px;
    }
    label {
      width:86px;
      padding-left: 20px;
      background-repeat:no-repeat;
      background-position:30px center;
      background-size:26px 26px;
      position: relative;
      i{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -8px;
        margin-left: -8px;
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 100%;
      }
    }
    .now {
      width: 80px;
      height: 42px;
      border: 1PX solid #e5e5e5;
      border-radius: 42px;
      font-size: 24px;
      color: #333333;
      line-height: 42px;
      text-align: center;
      position: absolute;
      right: 44px;
      top: 23px;
    }
    .change-passenger{
      flex: 0 1 auto;
      padding-left:20px;
      text-align:right;
      color:#888;
    }
    .icon-carhailing-phone{
      background-image:url("../../../assets/driver_card_phone.png");
    }
    .icon-carhailing-time{
      background-image:url("../../../assets/driver_card_time.png");
    }
    .icon-carhailing-start{
      i{
        background-color: #00bb22;
        border: 1PX solid #00a11d;
      }
    }
    .icon-carhailing-end{
      i{
        background-color: #ff6600;
        border: 1PX solid #e55c00;
      }
    }
  }
  .carhailing-car-box{
    text-align: center;
    h2{
      font-size: 24px;
      color: #cccccc;
      padding: 20px 0px;
    }
    .carhailing-pre-price{
      height:100px;
      line-height:100px;
      padding: 0 20px;
      .content {
        width: 50%;
        float: left;
        font-size: 24px;
        color: #333333;
        text-align: left;
      }
      .content:last-child {
        color: #ff6600;
        text-align: right;
        em{
          position: relative;
          top:2PX;
          font-size:48px;
        }
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
    width:1186px;
    border-bottom:1PX solid #f2f2f2;
    border-top:1PX solid #ffffff;
    li {
      opacity: 0.5;
      position: relative;
      display:inline-block;
      width: 236px;
      padding:136px 0 25px;
      background-repeat:no-repeat;
      background-position: center 30px;
      background-size:236px 100px;
      &.icon-car-0{
        background-image:url("../../../assets/theme/carhailing/jingji_5.png")
      }
      &.icon-car-1{
        background-image:url("../../../assets/theme/carhailing/haohua_5.png")
      }
      &.icon-car-2{
        background-image:url("../../../assets/theme/carhailing/shangwu.png")
      }
      &.icon-car-3{
        background-image:url("../../../assets/theme/carhailing/jingji_suv.png")
      }
      &.icon-car-4{
        background-image:url("../../../assets/theme/carhailing/haohua_suv.png")
      }
      i{
        display: none;
        position:absolute;
        left:50%;
        bottom: -3PX;
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
        opacity: 1;
        i {
          display: block;
        }
      }
    }
  }
  .button-content {
    padding: 0 24px;
  }
  .nav-margin-top{
    text-align: center;
    margin:60px 0 20px 0;
    background-color: #fff;
  }
  .city-bus-nav-box{
    display:inline-block;
    text-align:center;
    img{
      width:56px;
      height:56px;
      margin: 30px 0 24px;
    }
    p{
      font-size:20px;
      color:#808080;
      margin-bottom: 40px;
      line-height: 20px;
    }
  }
  .tel-dialog-body {
    text-align:center;
    padding:84px 0 52px;
    .close{
      position: absolute;
      top:20px;
      right:20px;
      width:50px;
      height:50px;
      background:url("../../../assets/close-dialog.png") no-repeat right top;
      background-size:30px 30px;
    }
    .tips{
      position: relative;
      margin-bottom:76px;
      font-size:32px;
      color:#4c4c4c;
      .error{
        position: absolute;
        top:40px;
        left:0;
        width: 100%;
        font-size:20px;
        color:#e4475c;
      }
    }
    .telephone{
      width:420px;
      margin:0 auto;
      input{
        padding:14px 10px;
        font-size:28px;
        text-align: center;
      }
    }
  }
  .mar-b-40 {
    margin-bottom: 40px;
  }
  .carhiling-nav-second {
    background-color: #fff;
    text-align: center;
  }
  .carhiling-second-nav-box{
    display:inline-block;
    margin-bottom:60px;
    width: 100%;
    text-align: center;
    height: 170px;
    img{
      width:100px;
      height:100px;
    }
    p{
      font-size:22px;
      color:#595757
    }
  }
  .carhiling-second-nav-box:first-child {
    border-bottom: 1PX solid #f8f8f8;
    margin-bottom: 0px;
  }
  .banner{
    position: relative;
    .banner_advert{
      position: absolute;
      top:0;
      left: 0;
      img{
        width: 40px !important;
        height: 20px !important;
      }
    }
  }
</style>
