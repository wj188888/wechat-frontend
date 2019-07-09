<template>
  <div class="pad-b-100 width-100">
    <div class="swiper-box car-hailing-indexbg">
      <div class="line line-x-t line-x-b banner">
        <swiper class="index-swiper" dots-position="center" :auto="true" :loop="true" :show-dots="swiper.length > 1">
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
    <div class="pad-20">
      <div class="mar-b-50 bg-fff radius-box">
        <div class="inline-box border-t-0">
          <label class="icon-carhailing-start"></label>
          <input type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToBuilding('from')"/>
        </div>
        <div class="inline-box">
          <label class="icon-carhailing-end"></label>
          <input type="text" placeholder="您要去哪里" v-model="to" readonly @click="jumpToBuilding('to')"/>
        </div>
        <div class="inline-box"
             @click="addressWarning"
             v-show="!this.productId">
          <label class="icon-carhailing-time"></label>
          <input type="text" placeholder="何时出发" readonly/>
        </div>
        <div class="inline-box" v-show="this.productId">
          <label class="icon-carhailing-time"></label>
          <date-time
            :start-config="startConfig"
            v-model="localData.startTime"
            holder="何时出发"
            @input="setStartTime"
            ref="dateInput"></date-time>
        </div>
        <div class="inline-box" @click="openPeplePicker">
          <label class="icon-passenger-num"></label>
          <span :class="{'active': localData.passengerNum}">
              {{localData.passengerNum ? localData.passengerNum + '人' : '乘车人数'}}
            </span>
        </div>
        <div class="carpooling-tab line line-x-t" v-if="carpoolPriceData.carpoolPrice || carpoolPriceData.charterePrice">
          <div class="split" v-if="carpoolPriceData.carpoolPrice && carpoolPriceData.charterePrice"></div>
          <div class="tab"
               v-if="carpoolPriceData.carpoolPrice"
               :class="{'active': orderData.tripType === 1}" @click="selectTripType(1)">
            <p class="carpooling-price" :class="{'row-1': !carpoolPriceData.carpoolDiscount || !carpoolPriceData.carpoolDiscount.discountAmount}">
              拼车 <em>{{(carpoolPriceData.carpoolPrice - (carpoolPriceData.carpoolDiscount ? carpoolPriceData.carpoolDiscount.discountAmount : 0) + carpoolPriceData.serviceFee).toFixed(2)}}</em> 元
          </p>
            <p class="carpooling-coupon" v-if="carpoolPriceData.carpoolDiscount && carpoolPriceData.carpoolDiscount.discountAmount">
              优惠抵扣 <em>{{ carpoolPriceData.carpoolDiscount.discountAmount }}</em> 元
          </p>
          </div>
          
          <div class="tab"
               v-if="carpoolPriceData.charterePrice"
               :class="{'active': orderData.tripType === 2}" @click="selectTripType(2)">
            <p class="carpooling-price" :class="{'row-1': !carpoolPriceData.charterDiscount || !carpoolPriceData.charterDiscount.discountAmount}">
              包车 <em>{{ (carpoolPriceData.charterePrice - (carpoolPriceData.charterDiscount ? carpoolPriceData.charterDiscount.discountAmount : 0) + carpoolPriceData.serviceFee).toFixed(2)}}</em> 元
          </p>
            <p class="carpooling-coupon" v-if="carpoolPriceData.charterDiscount && carpoolPriceData.charterDiscount.discountAmount">
              优惠抵扣 <em>{{ carpoolPriceData.charterDiscount.discountAmount }}</em> 元
          </p>
          </div>
        </div>
        <div class="change-tel line line-x-t"
             v-if="carpoolPriceData.carpoolPrice || carpoolPriceData.charterePrice"
             @click="showTelDialog = true"><i class="icon-carhailing-phone"></i>{{isSelf ? localData.contactTelephone : '换乘车人'}}
        </div>
      </div>
      <input type="button" class="button button-primary" :disabled="disableBtn" @click="carpoolOrderCreate" value="立即用车" />
    </div>
    <flexbox :gutter="0" class="nav-margin-top" v-if="shortcutMenu === 'true'">
      <flexbox-item>
        <router-link class="city-bus-nav-box" :to="{name:'tripList'}">
          <div class="icon-nav icon-journey"></div>
          <p>行程</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link class="city-bus-nav-box" :to="{name:'checkList'}">
          <div class="icon-nav icon-ticket-checking"></div>
          <p>验票</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link class="city-bus-nav-box" :to="{name:'network'}">
          <div class="icon-nav icon-website"></div>
          <p>网点</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <a class="city-bus-nav-box" @click="callService('')">
          <div class="icon-nav icon-service"></div>
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
    <x-dialog :show="showTelDialog" class="tel-dialog">
      <div class="tel-dialog-body line line-x-b">
        <a class="close" @click="showTelDialog = false"></a>
        <p class="tips">
          请输入乘车人联系电话
          <span class="error" v-show="errorPhoneText">{{errorPhoneText}}</span>
        </p>
        <div class="telephone line line-x-b">
          <input type="tel" placeholder="请输入手机号码" maxlength="11" v-model="contactTelephone">
        </div>
        <p class="warning">1、乘车人手机号码将收到系统发送的乘车信息。</p>
        <p class="warning">2、如果没有更换过乘车人，则默认为登录账户的手机号码</p>
      </div>
      <input type="button" value="确定" class="button button-no-radius button-empty-white" @click="setTelephone">
    </x-dialog>
  </div>
</template>
<script>
  import DateTime from 'components/dateTime/dateTime'
  import buttonNav from 'appComponents/buttonNav/index'
  import PicLink from 'appComponents/theme/picLink'
  import TextLink from 'appComponents/theme/textLink'
  import { Flexbox, FlexboxItem, XDialog, Swiper, SwiperItem } from 'vux'
  
  import { mapState } from 'vuex'
  import phone from 'mixins/phone'
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'
  
  export default {
    mixins: [phone, checkLogin, createOrder, service],
    components: {
      Flexbox,
      FlexboxItem,
      DateTime,
      XDialog,
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
        shortcutMenu: appStorage.get('shortcutMenu'),
        
        productId: '',
        productTypeLevelOne: 'CITY_BUS',
        productTypeLevelTwo: 'CITY_CAR_POOL_BUS',
        product: {},
        peoplePicker: '',
        peoplePickerData: [],
        peoplePickerIndex: '',
        
        showTelDialog: false,
        errorPhoneText: '',
        
        from:'定位中...',
        to: '',
        contactTelephone: '',
        localData:{
          from: {
            city: '',
            county: '',
            town:'',
            name:'',
            detailAddress: '',
            lat: '',
            lng: '',
            code: '',
            settingType:'',
            siteId:''
          },
          to: {},
          startTime: '', //出发时间
          contactTelephone: '',
          passengerNum: 0,
          productId:'',
          lineType: '',
          startPlace: '',
          endPlace: '',
        },
        startConfig: TOOL.getDateTimeConfig(),
        orderData: {
          formId: TOOL.getTimeStamp(), //表单ID
          productId : '',
          productTypeLevelOne: 'CITY_BUS',
          contactTelephone: '',
          onStation: '',
          offStation: '',
          passengerNum: 0,
          startTime: '',
          tripType: 1, // 1：拼车 2：包车
          discountInfo:{
            userCouponId:'',
            activityId:''
          },
          useActivity: true,
          type:'',
        },
        carpoolPriceData: {
          carpoolDiscount:{},
          charterDiscount:{},
        },
        disableBtn: true,
        hasProduct: false,
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
      isSelf () {
        if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          return (this.localData.contactTelephone && usrInfo.phone !== this.localData.contactTelephone)
        }else{
          return false
        }
      },
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
      localData:{
        handler (newVal) {
          if(newVal.productId){
            this.carpoolOrderCalPrice()
          }
        },
        deep:true
      },
    },
    mounted() {
      this.initialize()
    },
    methods: {
      initialize () {
        if(appStorage.get(this.pageRouter)){
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.localData = Object.assign(this.localData, localData)
          
          if(this.localData.productId){
            this.productId = this.localData.productId
            this.orderData.type = this.localData.lineType
            this.carpoolProductFindDetail()
          }
          
          if(this.localData.to && this.localData.to.name){
            this.from = this.localData.startPlace + '·' + this.localData.from.name
            this.to = this.localData.endPlace + '·' + this.localData.to.name
          }else{
            this.locationHandel()
          }
        }else{
          this.locationHandel()
        }
        
        if (appStorage.get('X-Auth-Token')) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.localData.contactTelephone = this.localData.contactTelephone || usrInfo.phone
          this.contactTelephone = this.contactTelephone || usrInfo.phone
        }
        this.findAds()
        TOOL.saveVisitLogs({
          url: this.$route.name,
          productTypeLevelOne: 'CITY_BUS',
          productTypeLevelTwo: 'CITY_CAR_POOL_BUS'
        })
      },
  
      /**
       * 查询首页轮播图片
       */
      findAds () {
        api.findAdByPostion({postion: '0001'}).then(res => {
          this.$store.commit('UPDATE_LOADING', true)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
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
       * 定位处理
       */
      locationHandel () {
        if(this.appAddress){
          if(this.localData.from.lat){
            this.carpoolProductInRange()
          }else if(this.appAddress !== TOOL.locationFail){
            this.successLocation(this.appAddress)
          }else{
            this.failLocation()
          }
        }else{
          this.$store.commit('UPDATE_LOADING_TEXT', '定位中...');
          this.$store.commit('UPDATE_LOADING', true);
          this.$store.watch((state) => {
            return state.city.appAddress;
          }, (newVal, oldVal) => {
            this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('UPDATE_LOADING_TEXT', '');
            if(newVal && newVal !== TOOL.locationFail){
              this.successLocation(newVal)
            }else{
              this.failLocation(true)
            }
          }, {deep: true});
        }
      },
      
      /**
       * 定位成功处理
       */
      successLocation (address) {
        let position = address.position
        if(address && position){
          this.localData.from = {
            city: address.city,
            county: address.district,
            town: address.township,
            name: address.detailAddress,
            detailAddress: address.detailAddress,
            lat: position.lat,
            lng: position.lng,
            local: true
          }
        }
        this.carpoolProductInRange()
      },
      
      /**
       * 定位失败处理
       */
      failLocation (isShowAlert) {
        this.from = ''
        if(!isShowAlert) return
        this.$store.dispatch('showConfirm', {
          title: '定位失败',
          confirmText: '手动选择',
          cancelText: '取消',
          content: '请检查您的定位服务是否开启',
          onConfirm: () => {
            this.jumpToBuilding('from')
          },
          onCancel: () => {
          }
        })
      },
  
      tanspoint (address) {
        return TOOL.tencentToBaidu({
          lat: address.lat,
          lng: address.lng,
        })
      },
  
      carpoolProductInRange () {
        if(!this.localData.from.city && !this.localData.from.county){
          this.from = ''
          return
        }
        if(!this.localData.startPlace){
          this.localData.startPlace = this.localData.from.city
        }
        let point = this.tanspoint(this.localData.from)
        let place = TOOL.deleteCityShi(this.localData.from.city)
        api.carpoolProductInRange({
          code: this.localData.from.code,
          latitude: point.lat,
          longitude: point.lng,
          city: place,
          county: this.localData.from.county,
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            // 0：按范围 1：按站点
            this.localData.from.settingType = data.resultData.settingType
            this.localData.from.code = data.resultData.code
            if(data.resultData.settingType === 0){
              this.localData.from.inRange = true
              if(data.resultData.name){
                this.localData.startPlace = data.resultData.name
              }
            }else{
              this.localData.from.name = ''
              this.localData.from.lat = ''
              this.localData.from.lng = ''
              this.localData.from.detailAddress = ''
              this.from = ''
              let sites = []
              for(let i = 0; i < data.resultData.sites.length; i++){
                let site = data.resultData.sites[i]
                let point = TOOL.baiduToTencent({
                  lat: site.latitude,
                  lng: site.longitude,
                })
                site.latitude = point.lat
                site.longitude = point.lng
                sites.push(site)
              }
              this.renderPointer(sites)
            }
            if(this.localData.from.name){
              this.from = this.localData.startPlace + '·' + this.localData.from.name
            }else{
              this.from = ''
            }
          }else{
            this.carpoolProductHasProduct()
            this.localData.from.inRange = false
            this.localData.productId = ''
            this.localData.lineType = ''
            this.localData.passengerNum = ''
            this.localData.startTime = ''
            this.from = ''
            this.to = ''
          }
        })
      },
  
      renderPointer (sites) {
        for(let i = 0; i < sites.length; i++){
          if(sites[i].id === this.localData.from.siteId){
            this.localData.from.name = sites[i].name
            this.localData.from.detailAddress = sites[i].address
            this.localData.from.lat = sites[i].latitude
            this.localData.from.lng = sites[i].longitude
            this.localData.from.siteId = sites[i].id
          }
        }
      },
      
      /**
       * 查询当前城市是否有拼车产品
       */
      carpoolProductHasProduct () {
        api.carpoolProductHasProduct(TOOL.deleteCityShi(this.localData.from.city)).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.localData.from.settingType = 0
            this.localData.from.code = data.resultData.code
            let point = TOOL.baiduToTencent({
              lat: data.resultData.latitude,
              lng: data.resultData.longitude
            })
            this.localData.from.lat = point.lat
            this.localData.from.lng = point.lng
            this.localData.from.name = ''
            this.localData.from.detailAddress = ''
          }else{
            this.hasNoCarpoolProduct()
          }
        })
      },
  
      /**
       * 当前城市无拼车产品处理
       */
      hasNoCarpoolProduct () {
        if(!appStorage.get('cityOutOfRange')){
          appStorage.set('cityOutOfRange', true)
          this.$store.dispatch('showConfirm', {
            title: '当前城市未开通拼车产品',
            confirmText: '切换城市',
            cancelText: '取消',
            content: '当前城市不在开通范围内，请切换城市再次尝试。',
            onConfirm: () => {
              this.jumpToBuilding('from')
            },
            onCancel: () => {
            }
          })
        }
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
      
      jumpToBuilding (dataKey) {
        if(dataKey === 'to' && (!this.from || this.from === '当前位置不在服务范围内' || this.from === '定位中...')){
          this.$store.dispatch('showError', '请选择您在哪上车');
          return
        }
        this.saveForm()
        this.$router.push({
          name: 'building',
          query:{
            pageRouter: this.pageRouter,
            productTypeLevelOne: this.productTypeLevelOne,
            productTypeLevelTwo: this.productTypeLevelTwo,
            dataKey: dataKey
          }
        })
      },
      
      carpoolProductFindDetail () {
        this.$store.commit('UPDATE_LOADING', true)
        api.carpoolProductFindDetail(this.productId, this.productTypeLevelOne).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.product = data.resultData
            for (let i = 1; i <= this.product.seat; i++ ){
              this.peoplePickerData.push({
                text: i + '人',
                value: i
              })
              this.peoplePickerIndex = [0]
            }
            this.peoplePicker = new Picker({
              data: [
                this.peoplePickerData
              ],
              selectedIndex: this.peoplePickerIndex,
              title: '乘车人数'
            });
            
            this.peoplePicker.on('picker.select', (selectedVal, selectedIndex) => {
              this.localData.passengerNum = selectedVal[0]
            })
            
            this.startConfig = TOOL.getDateTimeConfig(
              this.product.preOrderStartMinute,
              this.product.preOrderEndMinute,
              this.product.responseStartTime,
              this.product.responseEndTime,
              '出发时间')
            
            if(this.from && this.to && !this.localData.startTime){
              this.$nextTick(()=>{
                if(this.$refs.dateInput){
                  this.$refs.dateInput.showDateTimePicker()
                }
              })
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
  
      getStartTime (config) {
        let startDate = TOOL.newGetDate({date: config.min, type:'date'})
        let startTime = TOOL.newGetDate({date: config.min, type:'time'})
        if(config.start && config.end){
          let compare = this.dateCompare(config.start, config.end, 'time')
          if(compare > 0) {
            let compareStart = this.dateCompare(config.end, startTime, 'time')
            let compareEnd = this.dateCompare(config.start, startTime, 'time')
            if(compareStart <= 0 && compareEnd >= 0){
              startTime = '00:00'
            }
          }else{
            let compareStart = this.dateCompare(config.start, startTime, 'time')
            let compareEnd = this.dateCompare(config.end, startTime, 'time')
            if(compareStart >= 0){
              startTime = config.start
            }
            if(compareEnd <= 0){
              startTime = config.start
              startDate = TOOL.changeDate(startDate, 'd', 1)
              startDate = TOOL.newGetDate({date: startDate, type:'date'})
            }
          }
        }
        return startDate + ' ' + startTime
      },
      
      setStartTime (value) {
        this.localData.startTime = value
        if(!this.localData.passengerNum){
          this.openPeplePicker()
        }
      },
      
      openPeplePicker () {
        if(this.peoplePicker){
          this.peoplePicker.show()
        }else {
          this.addressWarning()
        }
      },
      
      addressWarning () {
        if(!this.from){
          this.$store.dispatch('showError', '请选择您在哪上车');
          return
        }
        
        if(!this.to){
          this.$store.dispatch('showError', '请选择您要去哪里');
          return
        }
        
        if(!this.localData.startTime){
          this.$store.dispatch('showError', '请选择何时出发');
        }
      },
      
      setTelephone () {
        let validata = TOOL.formValidate([
          {value: this.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
        ]);
        
        if (!validata.valid) {
          this.errorPhoneText = validata.msg
          return false;
        }else{
          this.errorPhoneText = ''
        }
        this.localData.contactTelephone = this.contactTelephone
        this.showTelDialog = false
      },
      
      carpoolOrderCalPrice () {
        let validata = TOOL.formValidate([
          {value: this.localData.from.lat, emptyTips: '出发地不能为空'},
          {value: this.localData.from.name, emptyTips: '出发地不能为空'},
          {value: this.localData.to.lat, emptyTips: '目的地不能为空'},
          {value: this.localData.to.name, emptyTips: '目的地不能为空'},
          {value: this.localData.startTime, emptyTips: '出发时间不能为空'},
          {value: this.localData.passengerNum, emptyTips: '出行人数不能为空'},
        ]);
        if (!validata.valid || this.localData.passengerNum === 0) {
          return false;
        }
        
        this.$store.commit('UPDATE_LOADING', true)
        let fromPoint = this.tanspoint(this.localData.from)
        let toPoint = this.tanspoint(this.localData.to)
        
        api.carpoolOrderCalPrice({
          productId: this.productId,
          productTypeLevelOne: this.productTypeLevelOne,
          onSiteId: this.localData.from.siteId,
          aCounty: this.localData.from.county,
          aLongitude: fromPoint.lng,
          aLatitude: fromPoint.lat,
          offSiteId: this.localData.to.siteId,
          bCounty: this.localData.to.county,
          bLongitude: toPoint.lng,
          bLatitude: toPoint.lat,
          passengerNum: this.localData.passengerNum,
          startTime: TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'}),
          type: this.orderData.type
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.carpoolPriceData = data.resultData
            this.disableBtn = false
            if(!this.carpoolPriceData.carpoolPrice){
              this.orderData.tripType = 2
              if(this.carpoolPriceData.charterDiscount){
                this.orderData.discountInfo.userCouponId = this.carpoolPriceData.charterDiscount.userCouponId
                this.orderData.discountInfo.activityId = this.carpoolPriceData.charterDiscount.activityId
              }
            }else{
              this.orderData.tripType = 1
              if(this.carpoolPriceData.carpoolDiscount){
                this.orderData.discountInfo.userCouponId = this.carpoolPriceData.carpoolDiscount.userCouponId
                this.orderData.discountInfo.activityId = this.carpoolPriceData.carpoolDiscount.activityId
              }
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
      selectTripType (tripType) {
        if(tripType === 1){
          if(this.carpoolPriceData.carpoolDiscount){
            this.orderData.discountInfo.userCouponId = this.carpoolPriceData.carpoolDiscount.userCouponId
            this.orderData.discountInfo.activityId = this.carpoolPriceData.carpoolDiscount.activityId
          }
        }else{
          if(this.carpoolPriceData.charterDiscount){
            this.orderData.discountInfo.userCouponId = this.carpoolPriceData.charterDiscount.userCouponId
            this.orderData.discountInfo.activityId = this.carpoolPriceData.charterDiscount.activityId
          }
        }
        if(this.orderData.tripType !== tripType){
          this.orderData.tripType = tripType
        }else{
          let carpoolPriceDatas = Object.assign({}, this.carpoolPriceData);
          carpoolPriceDatas.tripType = this.orderData.tripType
          carpoolPriceDatas.passengerNum = this.localData.passengerNum
          this.$store.commit('UPDATE_CARPOOLPRICE', carpoolPriceDatas)
          this.$store.commit('UPDATE_CARPOOLPRICE_DIALOG', true)
        }
      },
      
      carpoolOrderCreate () {
        let fromPoint = this.tanspoint(this.localData.from)
        let toPoint = this.tanspoint(this.localData.to)
        
        this.orderData.productId = this.productId
        this.orderData.productTypeLevelOne = this.productTypeLevelOne
        this.orderData.contactTelephone = this.localData.contactTelephone
        this.orderData.onStation = {
          longitude: fromPoint.lng,
          latitude: fromPoint.lat,
          name: this.localData.from.name,
          county: this.localData.from.county,
          detailAddress: this.localData.from.detailAddress,
          siteId: this.localData.from.siteId
        }
        this.orderData.offStation = {
          longitude: toPoint.lng,
          latitude: toPoint.lat,
          name: this.localData.to.name,
          county: this.localData.to.county,
          detailAddress: this.localData.to.detailAddress,
          siteId: this.localData.to.siteId
        }
        
        this.orderData.startTime = TOOL.newGetDate({date: this.localData.startTime, type: 'holeDate'})
        this.orderData.passengerNum = this.localData.passengerNum
        
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
  @import "../../../styles/theme.less";
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
    padding: 0;
    img{
      width: 100%;
      height: 240px;
    }
  }
  .inline-box {
    border-top:1PX solid #f2f2f2;
    label{
      width:86px;
      background:no-repeat 10px center;
      background-size:30px 30px;
    }
    .icon-carhailing-start{
      background-image:url("../../../assets/order_start.png")
    }
    .icon-carhailing-end{
      background-image:url("../../../assets/order_end.png")
    }
    .icon-carhailing-time{
      background-image:url("../../../assets/order_time.png")
    }
    .icon-passenger-num{
      background-image:url("../../../assets/seats.png");
      background-size: 30px 30px;
      background-position: 14px center;
    }
    span{
      color: #999;
      &.active{
        color: #121212;
      }
    }
  }
  .carpooling-tab{
    position: relative;
    display: flex;
    .split{
      position: absolute;
      left:50%;
      top:50%;
      margin-top:-30px;
      width: 1px;
      height: 60px;
      background-color: @bg-e0e0e0;
    }
    .tab{
      flex:1;
      height:140px;
      text-align:center;
      color:@fc-888;
      &.active{
        .carpooling-price{
          color:@fc-ff6600;
        }
        em{
          color:@fc-ff6600;
        }
      }
    }
    .carpooling-price{
      padding:30px 0 20px;
      font-size:28px;
      &.row-1{
        position: relative;
        top: 24px;
      }
      em{
        font-size: 40px;
        color:@fc-888;
      }
    }
    .carpooling-coupon{
      margin-bottom:42px;
      font-size:22px;
      em{
        color: @fc-888;
      }
    }
  }
  
  .change-tel{
    height:80px;
    line-height:80px;
    text-align: center;
    font-size:24px;
    color: @fc-888;
    &.active{
      color:@fc-4c4c4c;
    }
    .icon-carhailing-phone{
      display: inline-block;
      width:30px;
      height:30px;
      background:url("../../../assets/order_me.png") no-repeat 0 top;
      background-size: 20px 20px;
      vertical-align: middle;
    }
  }
  
  .nav-margin-top{
    text-align: center;
    margin:60px 0 20px 0;
  }
  .city-bus-nav-box{
    display:inline-block;
    text-align:center;
    .icon-nav{
      width:100px;
      height:100px;
      border-radius:50%;
      background: no-repeat center center #fff;
      background-size: 56px 56px;
      margin-bottom: 20px;
      box-shadow: 0 0 4PX 0 #e5e5e5;
      &.icon-journey{
        background-image: url("../../../assets/theme/cityBus/journey.png");
      }
      &.icon-ticket-checking{
        background-image: url("../../../assets/theme/cityBus/ticket_checking.png");
      }
      &.icon-website{
        background-image: url("../../../assets/theme/cityBus/website.png");
      }
      &.icon-service{
        background-image: url("../../../assets/theme/cityBus/service.png");
      }
    }
    p{
      font-size:28px;
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
    .warning{
      padding:0 30px;
      margin-top:20px;
      font-size:22px;
      text-align:left;
      color:#888;
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
    margin-bottom: 0;
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