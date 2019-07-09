<template>
  <div class="suggestmap">
    <div class="map-top-tips" v-if="warningTips" v-html="warningTips"></div>
    <div class="map-location-tips" v-if="localtionFail">
      <p class="warning-tips">{{locationTips}}</p>
      <div class="reloaction" v-if="!relocationStatus" @click="refreshLocation">
        <i></i>
        <p>重新定位</p>
      </div>
    </div>
    <div :id="mapId" class="mapcontainer"></div>
    <div class="carpool-address">
      <div class="carpoolmap-login" :class="{'carpoolmap-login-active': isLogin}" @click="jumpToMy">
        <i :style="headimgurl ? {backgroundImage:'url(\'' + headimgurl + '\')'}:''"></i>
      </div>
      <div class="bg-fff radius-box shadow" v-if="!hideAddress">
        <div class="inline-box">
          <label class="icon-carhailing-start"></label>
          <input type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToBuilding('from')"/>
        </div>
        <div class="inline-box">
          <label class="icon-carhailing-end"></label>
          <input type="text" placeholder="您要去哪里" v-model="to" readonly @click="jumpToBuilding('to')"/>
        </div>
      </div>
  
      <div class="bg-fff radius-box shadow" v-if="hideAddress">
        <div class="inline-flex">
          <div class="split"></div>
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
              @cancel="onDateTimeCancel"
              ref="dateInput"></date-time>
          </div>
          <div class="inline-box" @click="openPeplePicker">
            <label class="icon-passenger-num"></label>
            <span class="flex-2" :class="{'active': localData.passengerNum}">
            {{localData.passengerNum ? localData.passengerNum + '人' : '乘车人数'}}
          </span>
          </div>
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
        <div class="carpooling-tab line line-x-t" v-else>
          <div class="tab tab-loading">
            正在计算...
          </div>
        </div>
        <div class="change-tel line line-x-t"
             v-if="carpoolPriceData.carpoolPrice || carpoolPriceData.charterePrice"
             @click="showTelDialog = true"><i class="icon-carhailing-phone"></i>{{isSelf ? localData.contactTelephone : '换乘车人'}}
      </div>
      </div>
      <div class="mar-t-20 button-flex-box" v-if="hideAddress">
        <input type="button" class="button button-yellow" @click="backToAddress" value="重新填写" />
        <input type="button" class="button button-primary" :disabled="disableBtn" @click="carpoolOrderCreate" value="立即用车" />
      </div>
      
    </div>
    
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
  import { XDialog } from 'vux'
  
  import checkLogin from 'mixins/checkLogin'
  import createOrder from 'mixins/createOrder'
  import service from 'mixins/service'
  import { mapState } from 'vuex'
  import qqMap from 'utils/qqmap/CreateMap'
  
  export default {
    components: {
      XDialog,
      DateTime,
    },
    mixins: [checkLogin, createOrder, service],
    data () {
      return {
        mapId: "suggestmap",
        map: '',
        resetControl:'',
        probeControl: '',
        user:'',
        rangePolygon: '',
        mapCenter: {
          lat: 35.960223,
          lng: 114.257813
        },
        
        startPoint:'',
        startPointer:'',
        endPoint:'',
        endPointer:'',
        mapRoute:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 10,
            paddingBottom: 160,
            paddingLeft: 20,
            paddingRight: 20
          }
        },
        
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
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
        isLogin: false,
        headimgurl:'',
        warningTips:'',
        locationTips: '定位失败，请手动选择出发城市',
        localtionFail: false, // 定位失败状态
        relocationStatus: false, // 是否正在定位中
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
      hideAddress () {
        return this.localData.from.name && this.localData.to.name
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
      relocationStatus (newVal, oldVal) {
        this.$store.watch((state) => {
          if(state.city.appAddress === TOOL.locationFail){
            this.localtionFail = true
            this.failLocation(true)
          }
          return state.city.appAddress;
        }, (newVal, oldVal) => {
          if(newVal && newVal !== TOOL.locationFail){
            this.successLocation(newVal)
          }else{
            this.localtionFail = true
            this.failLocation(true)
          }
        }, {deep: true});
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        if(!this.map){
          this.initMap()
        }
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
            this._addStartPointer()
          }else{
            this.locationHandel()
          }
        }else{
          this.locationHandel()
        }
    
        this.isLogin = appStorage.get('X-Auth-Token')
        if (this.isLogin) {
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.localData.contactTelephone = this.localData.contactTelephone || usrInfo.phone
          this.headimgurl = usrInfo.headimgurl
          this.contactTelephone = this.contactTelephone || usrInfo.phone
        }
        TOOL.saveVisitLogs({
          url: this.$route.name,
          productTypeLevelOne: 'CITY_BUS',
          productTypeLevelTwo: 'CITY_CAR_POOL_BUS'
        })
      },
  
      initMap () {
        if(this.map) return
        this.map = new qqMap.createMap(this.mapId, {
          lat: this.mapCenter.lat,
          lng: this.mapCenter.lng,
          zoom: 4
        })
      },
  
      /**
       * 定位处理
       */
      locationHandel () {
        if(this.appAddress){
          if(this.localData.from.lat){
            this.setMapCenter(this.localData.from.lat, this.localData.from.lng)
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
      
      successLocation (address) {
        let position = address.position
        this.localData.from = {
          city: address.city,
          county: address.district,
          town: address.township,
          name: address.detailAddress,
          detailAddress: address.detailAddress,
          lat: position.lat,
          lng: position.lng
        }
        this._addUser(address)
        this.setMapCenter(this.localData.from.lat, this.localData.from.lng)
        this.carpoolProductInRange()
      },
  
      failLocation (isShowAlert) {
        this.locationTips = '定位失败，请手动选择出发城市'
        this.relocationStatus = false
        this.localtionFail = true
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
  
      backToAddress(){
        this.localData.to = {}
        this.localData.startTime = ''
        this.localData.passengerNum = 0
        this.localData.productId = ''
        this.localData.lineType = ''
        this.localData.endPlace = ''
        this.to = ''
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
        if(this.mapRoute){
          this.mapRoute.remove()
          this.startPointer.remove()
          this.endPointer.remove()
        }
        if(this.bestView.controls.length){
          for(let i = 0; i < this.bestView.controls.length; i ++){
            this.bestView.controls[i].remove()
          }
        }
        this.initialize()
      },
  
      setMapCenter (lat, lng, zoom) {
        this.mapCenter = {lat: lat, lng: lng}
        if(this.map){
          this.map.setZoom(zoom || 16)
          this.map.baseMap.panTo(new qq.maps.LatLng(lat, lng))
        }
      },
  
      _addStartPointer () {
        if(this.bestView.controls.length){
          for(let i = 0; i < this.bestView.controls.length; i ++){
            this.bestView.controls[i].remove()
          }
        }
        if(this.rangePolygon){
          this.rangePolygon.remove()
        }
        if(this.probeControl){
          this.probeControl.remove()
        }
        this.startPoint = {
          lat: this.localData.from.lat,
          lng: this.localData.from.lng,
        }
        this.endPoint = {
          lat: this.localData.to.lat,
          lng: this.localData.to.lng,
        }
        this.startPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.startPoint.lat,
          lng: this.startPoint.lng,
          type: 0,
          content: this.localData.from.name
        })
        this._addEndPointer()
      },
  
      _addEndPointer () {
        this.endPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.endPoint.lat,
          lng: this.endPoint.lng,
          type: 1,
          content: this.localData.to.name
        })
        this._addGuideLayer()
      },
  
      _addGuideLayer () {
        this.mapRoute = new qqMap.component.Route({
          map: this.map,
          startPoint: this.startPoint,
          endPoint:  this.endPoint,
          callback: (i, n) => {
            if(!i){
              this.mapRoute = n
            }
          }
        })
        this.bestView.controls = [this.startPointer, this.endPointer]
        this.setBestView()
      },
  
      setBestView () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },
      
      /**
       * 重新定位
       */
      refreshLocation () {
        if(this.relocationStatus) {
          this.$store.dispatch('showError', '定位中，请稍候再试...');
          return
        }
        this.locationTips = '定位中...'
        this.relocationStatus = true
        this.$store.dispatch('gaodeLocation')
      },
      
      jumpToMy () {
        this.saveForm()
        if (!this.isLogin) {
          TOOL.login()
        } else {
          this.$router.push({name: 'carpoolMapMy'})
        }
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
        this.localtionFail = false
        this.warningTips = ''
        let point = this.tanspoint(this.localData.from)
        let place = TOOL.deleteCityShi(this.localData.from.city)
        api.carpoolProductInRange({
          code: this.localData.from.code,
          latitude: point.lat,
          longitude: point.lng,
          city: place,
          county: this.localData.from.county
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            // 0：按范围 1：按站点
            this.localData.from.settingType = data.resultData.settingType
            this.localData.from.code = data.resultData.code
            if(data.resultData.settingType === 0){
              this._addProbeControl()
              this.cityProductGetArea ({code: this.localData.from.code})
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
            this.localData.startTime = ''
            this.from = ''
            this.to = ''
          }
        })
      },
      
      renderPointer (sites) {
        this.bestView.controls = []
        for(let i = 0; i < sites.length; i++){
          if(sites[i].id === this.localData.from.siteId){
            this.addStartPointer(sites[i])
          }
          let pointer = new qqMap.component.Station({
            map: this.map,
            lat: sites[i].latitude,
            lng: sites[i].longitude,
            type: 4,
            content: sites[i].name,
            clickHandler: () => {
              this.addStartPointer(sites[i])
            }
          })
          if(!this.localData.from.siteId){
            this.addStartPointer(sites[0])
          }
          this.bestView.controls.push(pointer)
        }
        this.setCenter()
      },
  
      addStartPointer (site) {
        if(this.pointer){
          this.pointer.remove()
        }
        this.pointer = new qqMap.component.Pointer({
          map: this.map,
          lat: site.latitude,
          lng: site.longitude,
          type: 0
        })
        this.localData.from.name = site.name
        this.localData.from.detailAddress = site.address
        this.localData.from.lat = site.latitude
        this.localData.from.lng = site.longitude
        this.localData.from.siteId = site.id
        this.setMapCenter(this.localData.from.lat, this.localData.from.lng, this.map.getZoom())
        if(this.localData.from.name){
          this.from = this.localData.startPlace + '·' + this.localData.from.name
        }
      },
      
      setCenter () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },
      
      /**
       * 查询当前城市是否有拼车产品
       */
      carpoolProductHasProduct () {
        api.carpoolProductHasProduct(TOOL.deleteCityShi(this.localData.from.city)).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.warningTips = '当前起点位置不在服务范围内<br/>移动地图调整起点至阴影区域'
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
            this.cityProductGetArea ({code: this.localData.from.code})
            this._addProbeControl()
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
        this.warningTips = '当前城市未在开通区域内<br/>请更换城市再次尝试'
        this.setMapCenter(this.localData.from.lat, this.localData.from.lng, 9)
        this._addProbeControl()
      },
      
      _addProbeControl () {
        if(this.hideAddress || this.probeControl){
          return
        }
        this.probeControl = new qqMap.control.ProbeControl({
          map: this.map,
          align: "center",
          content: this.localData.from.name,
          probeLatlng: {
            lat: this.mapCenter.lat,
            lng: this.mapCenter.lng
          }
        })
        this.probeControl.on("picked", (address) => {
          this.localData.from = address
          this.carpoolProductInRange()
        })
      },
      
      _addUser (address) {
        if(!this.user){
          this.user = new qqMap.component.User({
            map: this.map,
            type: 0,
            geo: false,
            lat: address.position.lat,
            lng: address.position.lng
          });
        }
        this.$watch("realTimeGeo", (point) => {
          this.user.setPosition({lat: point.lat, lng: point.lng})
        })
        this._addResetControl()
      },
      
      _addResetControl () {
        if(this.resetControl){
          return
        }
        let margin = '0 0 13rem 1rem'
        if(TOOL.browser().iPhone){
          margin = '0 0 14rem 1rem'
        }
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          position:'RIGHT_BOTTOM',
          margin: margin,
          left: 0,
          clickHandler: () => {
            let lat = this.user.getPosition().lat,
              lng = this.user.getPosition().lng;
            this.map.setZoom(16)
            this.map.setCenter(lat, lng);
          }
        })
      },
      
      cityProductGetArea (param) {
        if(this.hasArea){
          return
        }
        this.$store.commit('UPDATE_LOADING', true);
        let resource;
        if(param.productId) {
          resource = api.carpoolProductGetAreaById(param.productId, this.productTypeLevelOne, 0, param.lineType);
        } else {
          resource = api.carpoolProductGetArea(param.code);
        }
        
        resource.then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.hasArea = true
            for(let i = 0; i < data.resultData.length; i++){
              this.drawRange(data.resultData[i])
            }
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      
      drawRange (path) {
        if(!path || !path.length) return
        let paths = []
        for(let i = 0; i < path.length; i++){
          let point = TOOL.baiduToTencent({
            lat: path[i].latitude,
            lng: path[i].longitude
          })
          if(i === 0){
            this.mapConfig = {
              lat: point.lat,
              lng: point.lng,
            }
          }
          paths.push(new qq.maps.LatLng(point.lat, point.lng))
        }
        if(!this.map){
          this.map = new qqMap.createMap(this.container, this.mapConfig)
        }
        this.showRangePolygon(paths)
      },
      
      showRangePolygon (path) {
        this.rangePolygon = new qqMap.vector.CreateRangePolygon({
          map: this.map,
          path: path,
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
        this.localData.to = {}
        this.localData.startTime = ''
        this.localData.passengerNum = 0
        this.localData.productId = ''
        this.localData.lineType = ''
        this.localData.endPlace = ''
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },
      
      jumpToBuilding (dataKey) {
        if(dataKey === 'to' && (!this.from || this.from === '当前位置不在服务范围内' || this.from === '定位中...')){
          this.$store.dispatch('showError', '请先选择出发地');
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
  
            this.peoplePicker.on('picker.cancel', (selectedVal, selectedIndex) => {
              this.backToAddress()
            })
            
            this.startConfig = TOOL.getDateTimeConfig(
              this.product.preOrderStartMinute,
              this.product.preOrderEndMinute,
              this.product.responseStartTime,
              this.product.responseEndTime,
              '出发时间', true)
            
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
  
      onDateTimeCancel () {
        this.backToAddress()
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
          type: this.orderData.type,
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.carpoolPriceData = data.resultData
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
            this.disableBtn = false
            this.bestView.pos.paddingBottom = 350
            this.setBestView()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
          this.$store.commit('UPDATE_LOADING', false)
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
<style lang="less">
  @import "../../../styles/theme.less";
  .suggestmap{
    position: relative;
    width: 100%;
    flex:1;
    .mapcontainer {
      width: 100%;
      height: 100%;
      .csssprite{
        display:none!important;
      }
      div[draggable="false"][onresize="return;"]{
        display:none!important;
      }
    }
    .map-background {
      background:url("../../../assets/tag/32.png") repeat 0 0 #e5e3df;
    }
    .map-top-tips{
      position: absolute;
      top:20px;
      left: 20px;
      right: 20px;
      padding:22px;
      height:120px;
      font-size:28px;
      color: #888;
      line-height: 1.6;
      text-align: center;
      border-radius:8px;
      background-color: #fff;
      box-shadow: 0 0 10PX 0 #ccc;
      z-index: 99;
    }
    .map-location-tips{
      position: absolute;
      top:20px;
      left: 20px;
      right: 20px;
      padding-right:140px;
      height:100px;
      font-size:28px;
      color: #888;
      border-radius:8px;
      background-color: #fff;
      box-shadow: 0 0 10PX 0 #ccc;
      z-index: 99;
      .warning-tips{
        padding-left:30px;
        line-height: 100px;
      }
      .reloaction{
        position:absolute;
        right:0;
        top:0;
        width:140px;
        text-align:center;
        font-size:24px;
        color:#ff6600;
        i{
          display:block;
          width:38px;
          height:35px;
          margin:15px auto 10px;
          background:url('../../../assets/location.png') no-repeat center center;
          background-size: 38px 35px;
        }
      }
    }
  }
  .carpool-address{
    position: absolute;
    bottom: 40px;
    left:20px;
    right:20px;
    .shadow{
      box-shadow: 0 0 10PX 0 #ccc;
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
      span{
        color: #999;
        &.active{
          color: #121212;
        }
      }
    }
    .inline-flex{
      position: relative;
      display:flex;
      .split{
        position: absolute;
        left:50%;
        top:50%;
        margin-top:-20px;
        width: 1PX;
        height: 40px;
        background-color: @bg-e0e0e0;
        z-index:2;
      }
      .inline-box{
        flex: 1;
        label{
          width:60px;
        }
      }
      .icon-carhailing-time{
        background-image:url("../../../assets/order_time.png")
      }
      .icon-passenger-num{
        flex: 1;
        background-image:url("../../../assets/seats.png");
        background-size: 30px 30px;
        background-position: right center;
      }
      .flex-2{
        flex:2;
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
      width: 1PX;
      height: 60px;
      background-color: @bg-e0e0e0;
      z-index:2;
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
    .tab-loading{
      line-height:140px;
      font-size:28px;
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
  .carpoolmap-login{
    position: absolute;
    top:-90px;
    right:0;
    width:72px;
    height:72px;
    margin-bottom:20px;
    border-radius:8px;
    z-index:200;
    background: #fff;
    i{
      display:block;
      width:48px;
      height:48px;
      margin:12px auto;
      border-radius:50%;
      background-image:url("../../../assets/theme/carpoolbusMap/user-center.png");
      background-size:46px 46px;
      border:1PX solid #ccc;
    }
  }
  .button-flex-box{
    display:flex;
    .button-yellow{
      flex:1;
      margin-right:20px;
    }
    .button-primary{
      flex:2;
    }
  }
</style>