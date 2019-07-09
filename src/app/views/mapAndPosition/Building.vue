<template>
  <main-box :show-header="false">
    <div class="suggest-wrapper">
      <div class="suggest">
        <div class="suggest-header">
          <div class="city-wrapper" @click="onSelectCity" :class="{'flex-input': currentPage === 2}">
            <div class="city-content border-right-1px">
              <div class="city-select" v-show="currentPage !== 2">
                <span class="text">{{currentCity.name || '定位中...'}}</span>
                <i class="mfic-pulldown "></i>
              </div>
              <transition name="city-move">
                <div class="city-input-wrapper" v-show="currentPage === 2">
                  <input type="text"
                         placeholder="城市中文名或拼音"
                         class="city-input"
                         v-model="cityQuery"
                         v-show="currentPage === 2"
                         maxlength="12"
                         ref="cityInput">
                </div>
              </transition>
            </div>
          </div>
          <div class="address-wrapper" v-if="currentPage === 0 || currentPage === 1">
            <input type="text"
                   class="address-input"
                   :placeholder="addressPlaceHolder"
                   ref="addressInput"
                   @focus="onAddressFocus"
                   v-model="addressQuery">
            <div class="clear" v-show="addressQuery" @click="onClearAddress">
              <i class="mfic-wrong"></i>
            </div>
          </div>
          <div class="address-wrapper title" v-if="currentPage === 3">{{isFrom ? '选择上车点位' : '选择下车点位'}}</div>
          <div class="cancel-wrapper" @click="cancel">
            <span class="text border-left-1px">取消</span>
          </div>
        </div>

        <div class="page-map" v-show="currentPage===0">
          <suggest-build-map
            ref="suggestMap"
            :current-city="currentCity.name"
            :is-from="isFrom"
            :data-list="dataList"
            :recommend-addess="mapRecommendAddess"
            :in-range="inRange"
            :map-result-desc="mapResultDesc"
            :page-router="pageRouter"
            @reset="setDefaultCity"
            @addressSelect="onAddressSelect"
            @poiChange="onPoiChange">
          </suggest-build-map>
        </div>

        <div class="page-list" v-show="currentPage === 1" ref="pageList">
          <suggest-build
            :current-city="currentCity.name"
            :is-from="isFrom"
            :data-list="dataList"
            :recommend-addess="recommendAddess"
            :firm-recommend-addess="firmRecommendAddess"
            :in-range="inRange"
            :show-phone="showPhone"
            :result-desc="resultDesc"
            :address-query="addressQuery"
            @setMapView="setMapView"
            @jumpToShowRange="jumpToShowRange"
            @beforeScrollStart="onAddressScrollStart"
            @addressSelect="onAddressSelect">
          </suggest-build>
        </div>

        <div class="page-city" v-show="currentPage === 2">
          <citylist
            ref="cityList"
            :is-from="isFrom"
            :city-list="cityList"
            @beforeScrollStart="onCityScrollStart"
            @citySelect="onCitySelect"
            class="citylist">
          </citylist>
        </div>
  
        <div class="page-map" v-show="currentPage === 3">
          <suggest-station
            ref="suggestStation"
            :is-from="isFrom"
            :site-id="localData.from.siteId"
            :sites="sites"
            @stationSelect="onStationSelect">
          </suggest-station>
        </div>
        
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import suggestBuildMap from 'components/mapAndPosition/suggestBuildMap'
  import suggestStation from 'components/mapAndPosition/suggestStation'
  import SuggestBuild from 'components/mapAndPosition/suggestBuild'
  import Citylist from 'components/mapAndPosition/citylist'
  import qqmapCity from '../../../utils/qqmapCity'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      suggestStation,
      suggestBuildMap,
      SuggestBuild,
      Citylist
    },
    data () {
      return {
        firmRecommendAddess:[],
        recommendAddess:[],
        mapRecommendAddess:[],
        dataList: [],
        sites:[],
        addressQuery: "",
        cityQuery: "",
        currentCity: {
          name: '定位中...',
          value:{
            lat: 0,
            lng:0,
            code:'',
          }
        },
        cityList: [],
        currentStation: {},
        currentPage:'', // 0：地图模式 1：地址列表 2：城市列表 3： 站点列表
        historyPage:'',
        localData:{
          from:{},
          to:{}
        },
        resultDesc: '',
        mapResultDesc: '',
        productId: '',
        productTypeLevelOne: '',
        lineType:'',
        pageActive: false, // 判断是否是线路列表入口
        inRange: false,
        showPhone: false,
        needReverse:'',
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
      isFrom () {
        return this.dataKey === 'from'
      },
      addressPlaceHolder () {
        return this.isFrom ? '您在哪上车' : '您要去哪儿'
      },
      historyKey () {
        if(this.isFrom){
          return 'carpool_starts'
        }else{
          return 'carpool_ends'
        }
      },
    },
    watch: {
      addressQuery () {
        if(this.currentPage !== 1) return
        this.$nextTick(()=>{
          this.searchService(this.addressQuery);
        })
      },
      cityQuery (newVal) {
        this.$refs.cityList.match(newVal, 'building', this.isFrom)
      },
      localData:{
        handler () {
          if(!this.appAddress || this.appAddress === TOOL.locationFail) return
          let inRange = this.appAddress.city.indexOf(this.localData.from.city) > -1
          this.inRange = this.isFrom && inRange && this.localData.from.inRange
        },
        deep:true
      }
    },
    created () {
      this.pageRouter = this.$route.query.pageRouter
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
      this.dataKey = this.$route.query.dataKey
      this.pageActive = this.$route.query.pageActive

      this.productId = this.$route.query.productId
      this.lineType = this.$route.query.lineType
      this.initialize()
    },
    methods: {
      initialize () {
        if(appStorage.get(this.pageRouter)){
          this.localData = Object.assign(this.localData, JSON.parse(appStorage.get(this.pageRouter)))
          if(this.localData.productId){
            this.productId = this.localData.productId
            this.lineType = this.localData.lineType
          }
        }
  
        // 0：地图模式 1：地址列表 2：城市列表 3： 站点列表
        if(this.isFrom){
          if(this.localData.from.code){
            if(this.localData.from.settingType === 0){
              this.currentPage = 1;
              this.historyPage = 1;
              this.geoAddress(this.localData.from.lat, this.localData.from.lng, true)
            }else{
              if(this.localData.productId){
                this.carpoolProductGetSitesById(this.localData.productId, 'CITY_BUS', 0, this.localData.lineType)
              }else{
                this.carpoolProductGetSites(this.localData.from.code)
              }
            }
            this.setDefaultCity();
          }else{
            this.currentPage = 2;
            this.getStartCityList()
          }
        }else{
          if(this.localData.productId){
            if(this.localData.to.settingType === 0){
              this.currentPage = 1;
              this.historyPage = 1;
              this.getCarpoolProduct()
            }else{
              this.carpoolProductGetSitesById(this.localData.productId, 'CITY_BUS', 1, this.localData.lineType)
            }
            this.setDefaultCity();
          }else{
            this.currentPage = 2;
            this.getEndCityList()
          }
        }
      },
  
      setDefaultCity () {
        let fromCity = this.localData.from
        let toCity = this.localData.to
        if(this.isFrom){
          this.currentCity = {
            name: this.localData.startPlace,
            city:fromCity.city,
            value:{
              lat: fromCity.lat,
              lng: fromCity.lng,
              code: fromCity.code,
            }
          }
        }else{
          this.currentCity = {
            name: this.localData.endPlace,
            city:toCity.city,
            value:{
              lat: toCity.lat,
              lng: toCity.lng,
              code: toCity.code,
            }
          }
        }
      },
  
      /**
       * 获取出发地站点列表
       */
      carpoolProductGetSites (code) {
        api.carpoolProductGetSites(code).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.renderSite(data.resultData)
          }
        })
      },
  
      /**
       * 获取目的地站点列表
       */
      carpoolProductGetSitesById (id, productTypeLevelOne, start, type) {
        api.carpoolProductGetSitesById(id, productTypeLevelOne, start, type).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.renderSite(data.resultData)
          }
        })
      },

      /**
       * 获取出发地城市列表
       */
      getStartCityList () {
        api.cityLineRegionCitiesTemplate(this.productTypeLevelOne, this.productTypeLevelTwo).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.cityList = data.resultData
          } else {
            this.cityList = []
          }
        })
      },
  
      /**
       * 获取目的地城市列表
       */
      getEndCityList () {
        let point = this.tanspoint(this.localData.from)
        api.cityLineRegionDestinationsTemplate({
          productTypeLevelOne: this.productTypeLevelOne,
          productTypeLevelTwo: this.productTypeLevelTwo,
          latitude: point.lat,
          longitude: point.lng,
          source: TOOL.deleteCityShi(this.localData.startPlace),
          siteId: this.localData.from.siteId,
          code: this.localData.from.code,
          county: this.localData.from.county,
          town: this.localData.from.town
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.cityList = data.resultData
          } else {
            this.cityList = []
          }
        })
      },
  
      onSelectCity () {
        if(this.currentPage !== 2){
          if(this.currentPage === 0){
            this.historyPage = 0;
          }
          this.currentPage = 2
          this.cityQuery = ""
          if(!this.cityList.length){
            if(this.isFrom){
              this.getStartCityList()
            }else{
              this.getEndCityList()
            }
          }
        }
      },
  
      onAddressFocus () {
        if(this.currentPage !== 1){
          if(this.currentPage === 0){
            this.$refs.suggestMap.hide()
          }
          this.historyPage = 1;
          this.currentPage = 1;
        }
      },

      searchService (keyword) {
        let _this = this;
        let loaction = this.currentCity.city
        let searchService = new qq.maps.SearchService({
          location : loaction,
          autoExtend: false,
          pageCapacity:20,
          complete : function(results){
            _this.dataList = results.detail.pois
            if(!_this.dataList || !_this.dataList.length){
              _this.resultDesc = '暂无搜索结果<br/>您还可以联系客服人员，进行电话下单'
              _this.showPhone = true
            }
          },
          error: function() {
            _this.dataList = []
            _this.resultDesc = '暂无搜索结果<br/>您还可以联系客服人员，进行电话下单'
            _this.showPhone = true
          }
        });
        searchService.search(keyword);
      },
  
      onClearAddress () {
        this.addressQuery = ""
      },

      onAddressScrollStart () {
        this.$refs.addressInput.blur()
      },

      onCityScrollStart () {
        this.$refs.cityInput.blur()
      },
      
      tanspointBaiduToTencent (address) {
        return TOOL.baiduToTencent({
          lat: address.lat,
          lng: address.lng,
        })
      },
  
      tanspoint (address) {
        return TOOL.tencentToBaidu({
          lat: address.lat,
          lng: address.lng,
        })
      },

      onCitySelect (city) {
        let newCity = JSON.parse(JSON.stringify(city))
        let point  = this.tanspointBaiduToTencent(newCity.value)
        newCity.value.lat = point.lat
        newCity.value.lng = point.lng
        if((this.isFrom && city.name !== this.localData.startPlace && this.localData.isStart) ||
          (!this.isFrom && city.name !== this.localData.endPlace && this.localData.isEnd)){
          this.$store.dispatch('showConfirm', {
            title: '确认',
            confirmText: '确定',
            cancelText: '取消',
            content: '<p>确定要脱离购买车票时所选择的线路吗？</p>',
            onConfirm: () => {
              this.doCitySelect(newCity.value)
            },
            onCancel: () => {
            }
          })
        }else{
          this.doCitySelect(newCity.value)
        }
      },

      doCitySelect (city) {
        this.needReverse = ''
        if (this.isFrom) {
          this.productId = ''
          this.localData.productId = ''
          this.localData.lineType = ''
          this.localData.startTime = ''
          this.localData.passengerNum = 0
          this.localData.from = {}
          this.localData.to = {}
          this.localData.isStart = false
          let point = this.tanspoint(city)
          api.carpoolProductInRange({
            code: city.code,
            latitude: point.lat,
            longitude: point.lng,
            city: TOOL.deleteCityShi(city.name),
            county: city.county,
          }).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              // 0：按范围 1：按站点
              this.localData.from.settingType = data.resultData.settingType
              this.localData.from.code = data.resultData.code
              this.localData.startPlace = city.name
              this.localData.from.city = city.name
              this.localData.from.lat = city.lat
              this.localData.from.lng = city.lng
              this.localData.from.siteId = '' //切换城市重置siteId
              this.setCurrentCity(city)
              if(data.resultData.settingType === 0){
                this.localData.from.inRange = true
                this.citySelectShowPage()
                this.geoAddress(this.localData.from.lat, this.localData.from.lng, true)
                if(this.currentPage === 0){
                  this.showMapViewRange()
                }
              }else{
                this.renderSite(data.resultData.sites)
              }
            }else{
              api.carpoolProductHasProduct(TOOL.deleteCityShi(city.name)).then(res => {
                const data = TOOL.toJson(res.data);
                if(data.resultCode === '0') {
                  this.localData.from.settingType = 0
                  this.localData.startPlace = city.name
                  this.localData.from.city = city.name
                  this.localData.from.code = data.resultData.code
                  let point = TOOL.baiduToTencent({
                    lat: data.resultData.latitude,
                    lng: data.resultData.longitude
                  })
                  this.localData.from.lat = point.lat
                  this.localData.from.lng = point.lng
                  this.localData.from.inRange = false
                  city.code = data.resultData
                  this.citySelectShowPage()
                  this.setCurrentCity(city)
                  this.geoAddress(this.localData.from.lat, this.localData.from.lng, true)
                  if(this.currentPage === 0){
                    this.showMapViewRange()
                  }
                }else{
                  this.$store.dispatch('showError', '当前定位城市暂未开通拼车产品，试试别的吧');
                }
              })
              
            }
          })
        }else{
          this.citySelectShowPage()
          this.localData.isEnd = false;
          this.localData.endPlace = city.name
          this.carpoolProductFindById(city)
        }
      },
      
      renderSite (sites) {
        this.currentPage = 3
        let sitesTemp = []
        for(let i = 0; i < sites.length; i++){
          let site = sites[i]
          let point = TOOL.baiduToTencent({
            lat: site.latitude,
            lng: site.longitude,
          })
          site.latitude = point.lat
          site.longitude = point.lng
          sitesTemp.push(site)
        }
        this.sites = sitesTemp
      },
      
      citySelectShowPage () {
        if(this.historyPage === 0){
          this.currentPage = 0
        }else{
          this.currentPage = 1
        }
      },
  
      /**
       * 地图选点
       */
      onPoiChange (address) {
        this.currentStation = address
        this.checkPoiInRange(address.lat, address.lng, )
      },
  
      checkPoiInRange (lat, lng, isPoiChange) {
        let point = this.tanspoint({lat: lat,lng: lng})
        let resource = ''
        if (this.isFrom) {
          if(this.pageRouter === 'busCarpooling' && this.localData.isStart){
            resource = api.carpoolProductInRangeById(this.productId, {
              productTypeLevelOne: this.productTypeLevelOne,
              start: 0,
              county: this.localData.startPlace,
              latitude: point.lat,
              longitude: point.lng,
              type: this.lineType
            })
          }else{
            resource = api.carpoolProductInRange({
              code: this.localData.from.code,
              latitude: point.lat,
              longitude: point.lng
            })
          }
        }else {
          resource = api.carpoolProductInRangeById(this.productId, {
            productTypeLevelOne: this.productTypeLevelOne,
            start: 1,
            county: this.localData.endPlace,
            latitude: point.lat,
            longitude: point.lng,
            type: this.lineType
          })
        }
  
        resource.then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.localData.from.inRange = true
            this.geoAddress(lat, lng, true, isPoiChange)
          }else{
            this.localData.from.inRange = false
            this.geoAddress(lat, lng, false, isPoiChange)
          }
        })
        
      },
      
      geoAddress (lat, lng, inRange, isPoiChange) {
        let _this = this;
        let geocoder = new qq.maps.Geocoder({
          complete:function(result){
            let geoAddress = result.detail
            let address = {
              city: geoAddress.addressComponents.city,
              county: geoAddress.addressComponents.district,
              town: geoAddress.addressComponents.town,
              detailAddress: geoAddress.addressComponents.streetNumber || geoAddress.addressComponents.street,
              lat: geoAddress.location.lat,
              lng: geoAddress.location.lng
            }
            if(inRange){
              _this.dataList = geoAddress.nearPois.sort((a, b)=>{
                return a.dist - b.dist
              });
              if(!_this.dataList || !_this.dataList.length){
                _this.resultDesc = '暂无位置信息<br/>可通过输入或地图模式选择'
                if(_this.isFrom){
                  _this.mapResultDesc = '起点附近暂无位置信息<br/>请移动起点再次尝试'
                }else{
                  _this.mapResultDesc = '终点附近暂无位置信息<br/>请移动终点再次尝试'
                }
              }
            }else{
              _this.resultDesc = '暂无位置信息<br/>可通过输入或地图模式选择'
              if(_this.isFrom){
                _this.mapResultDesc = '起点位置不在服务范围<br/>请联系客服人员，确定该位置能否下单'
              }else{
                _this.mapResultDesc = '终点位置不在服务范围<br/>请联系客服人员，确定该位置能否下单'
              }
              _this.dataList = []
            }
            if(isPoiChange !== 'poiChange'){
              _this.setMapCenter(address)
            }
          }
        });
        let point = new qq.maps.LatLng(lat, lng)
        geocoder.getAddress(point);
      },

      /**
       * 初始化地图选点
       */
      setMapCenter (address) {
        if(!address || !address.lat) return
        if(this.$refs.suggestMap){
          this.$refs.suggestMap.setCurrentStation(address)
          this.$refs.suggestMap.setMapCenter(address.lat, address.lng)
        }
      },

      setCurrentCity (city) {
        if(this.currentCity.name !== city.name){
          this.currentCity = {
            name: city.name,
            city:city.city,
            value:{
              lat: city.lat,
              lng: city.lng,
              code: city.code,
            }
          }
        }
      },
      
      /**
       *  设置选中的城市值
       *  @value 城市名称
       */
      carpoolProductFindById (city) {
        this.localData.productId = city.productId
        this.localData.lineType = city.type
        this.productId = this.localData.productId
        this.lineType = this.localData.lineType
        this.getCarpoolProduct(city)
      },
      
      getCarpoolProduct (city) {
        this.$store.commit('UPDATE_LOADING', true)
        api.carpoolProductFindById(this.localData.productId, this.productTypeLevelOne, this.localData.lineType).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.carpoolProduct = data.resultData
            if(this.carpoolProduct && city) {
              let point = this.tanspointBaiduToTencent({
                lat: city.lat,
                lng: city.lng
              })
              this.localData.to.settingType = this.carpoolProduct.endPlaceSettingType
              this.localData.to.city = city.name
              this.localData.to.lat = point.lat
              this.localData.to.lng = point.lng
              this.setCurrentCity(city)
            }
            if(this.localData.to.settingType === 0){
              let recommendAddess = []
              if(appStorage.get('StoreId') === '59b780065f47934a88c72fe3'){
                if(city.name === '重庆'){
                  recommendAddess = [
                    {
                      detailAddress: '九龙坡区石杨路39号',
                      latitude: '29.53192',
                      longitude: '106.49457',
                      name: '陈家坪长途车站',
                    },
                    {
                      detailAddress: '重庆市渝北区机场路',
                      latitude: '29.727675',
                      longitude: '106.648039',
                      name: '重庆江北国际机场',
                    },
                    {
                      detailAddress: '重庆市渝中区菜袁路3-1号',
                      latitude: '29.55384',
                      longitude: '106.556583',
                      name: '重庆长途汽车站(菜园坝)',
                    },
                    {
                      detailAddress: '重庆市渝北区昆仑大道51号附8号',
                      latitude: '29.614066',
                      longitude: '106.557329',
                      name: '重庆北站（龙头寺汽车站）',
                    },
                    {
                      detailAddress: '重庆市沙坪坝区高滩岩正街30号',
                      latitude: '29.543129',
                      longitude: '106.458442',
                      name: '重庆西南医院',
                    },
                    {
                      detailAddress: '新桥正街183号',
                      latitude: '29.529431',
                      longitude: '106.443524',
                      name: '重庆新桥医院',
                    },
                    {
                      detailAddress: '重庆市渝中区中山二路136号',
                      latitude: '29.562635',
                      longitude: '106.56104',
                      name: '重庆医科大学附属儿童医院',
                    },
                    {
                      detailAddress: '重庆市渝中区大坪长江支路10号',
                      latitude: '29.549618',
                      longitude: '106.528957',
                      name: '第三军医大学大坪医院',
                    },
                    {
                      detailAddress: '重庆市渝中区袁家岗友谊路1号',
                      latitude: '29.53665',
                      longitude: '106.519417',
                      name: '重庆医科大学附属第一医院',
                    },
                  ]
                }else if(city.name === '永川区'){
                  recommendAddess = [
                    {
                      detailAddress: '中山路街道瓦子铺',
                      latitude: '29.377131',
                      longitude: '105.95564',
                      name: '永川东站',
                    },
                    {
                      detailAddress: '重庆市永川区人民北路189号',
                      latitude: '29.368509',
                      longitude: '105.938806',
                      name: '永川区巨宇江南',
                    },
                    {
                      detailAddress: '重庆市永川区内环南路611号',
                      latitude: '29.34869',
                      longitude: '105.908135',
                      name: '永川客运中心',
                    }
                  ]
                }else if(city.name === '大足区'){
                  recommendAddess = [
                    {
                      detailAddress: '重庆市大足区双塔路218号',
                      latitude: '29.701612',
                      longitude: '105.720235',
                      name: '大足汽车站',
                    },
                    {
                      detailAddress: '龙岗街道办事处龙中路15号',
                      latitude: '29.702277',
                      longitude: '105.72726',
                      name: '大足汽车客运中心',
                    },
                  ]
                }
              }
              if(this.carpoolProduct.firmRecommendAddess){
                this.firmRecommendAddess = recommendAddess.concat(this.carpoolProduct.firmRecommendAddess)
              }
              if(this.carpoolProduct.recommendAddess){
                this.recommendAddess = this.carpoolProduct.recommendAddess
                this.mapRecommendAddess = this.carpoolProduct.recommendAddess
              }
              this.geoAddress(this.localData.to.lat, this.localData.to.lng, true)
              if(this.currentPage === 0){
                this.showMapViewRange()
              }
            }else{
              this.renderSite(data.resultData.endPlaceSites)
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      onAddressSelect (address, myAddressFlag, addressSource) {
        this.currentStation = address
        this.hide(address, myAddressFlag, addressSource)
      },

      destroy () {
        if(this.isFrom){
          this.$refs.suggestMap.destroy()
        }
        this.$refs.addressInput.blur()
        this.$refs.cityInput.blur()
      },

      hide (address, myAddressFlag, addressSource) {
         this.saveForm()
        if (this.isFrom) {
           if(this.productId){
             this.carpoolProductInRangeById(address, myAddressFlag, addressSource);
           }else{
             this.carpoolProductInRange(address, myAddressFlag, addressSource);
           }
        }else {
          this.carpoolProductInRangeById(address, myAddressFlag, addressSource);
        }
      },

      setStorage (address, storageName, addressSource) {
        let addresses = []
        if(appStorage.get(storageName)){
          addresses = JSON.parse(appStorage.get(storageName))
        }
        let len = addresses.length
        let tag = true
        
        let city = this.localData.startPlace
        if(!this.isFrom){
          city = this.localData.endPlace
        }
        if(len){
          for(let i = 0; i < len; i++){
            let cityData = addresses[i]
            if(address.cityAlis === cityData.city){
              tag = false
              let datas = cityData.datas || []
              if(cityData.datas && cityData.datas.length){
                let addressTag = true
                for(let j = 0; j < cityData.datas.length; j ++){
                  if(addressSource.name === cityData.datas[j].name){
                    addressTag = false
                    break;
                  }
                }
                if(addressTag){
                  if(datas.length >= 3){
                    datas[0] = addressSource
                  } else {
                    datas.unshift(addressSource)
                  }
                }
              }else{
                datas.unshift(addressSource)
              }
              addresses[i] = {
                city: city,
                datas: datas
              }
            }
          }
          if(tag){
            let datas = []
            datas.unshift(addressSource)
            addresses.unshift({
              city: city,
              datas: datas
            })
          }
        }else{
          let datas = []
          datas.unshift(addressSource)
          addresses.unshift({
            city: city,
            datas: datas
          })
        }
        if(addresses.length){
          appStorage.set(storageName, JSON.stringify(addresses))
        }
      },
      
      carpoolProductInRange(address, myAddressFlag, addressSource) {
        if(!address || !this.localData.from.code) {
          return false;
        }
        let point = this.tanspoint(address)
        api.carpoolProductInRange({
          code: this.localData.from.code,
          latitude: point.lat,
          longitude: point.lng
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            if(data.resultData.needReverse){
              this.needReverse = data.resultData.needReverse
            }
            this.setStorage(address, this.historyKey, addressSource)
            this.setAddress(address)
          } else {
            if(myAddressFlag){
              this.jumpToSetInfo(address, myAddressFlag)
            }else{
              this.jumpToOutOfRange()
            }
          }
        })
      },

      carpoolProductInRangeById(address, myAddressFlag, addressSource) {
        if(!address) {
          this.$router.back()
          return false;
        }
        let point = this.tanspoint(address)
        let start = this.isFrom ? 0 : 1;
        api.carpoolProductInRangeById(this.productId, {
          productTypeLevelOne: this.productTypeLevelOne,
          start: start,
          county: address.county,
          latitude: point.lat,
          longitude: point.lng,
          type: this.lineType
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.setStorage(address, this.historyKey, addressSource)
            this.setAddress(address)
          } else {
            if(myAddressFlag){
              this.jumpToSetInfo(address, myAddressFlag)
            }else{
              this.jumpToOutOfRange()
            }
          }
        })
      },

      jumpToSetInfo (address, myAddressFlag) {
        let msg = '常用地址1'
        if(myAddressFlag === 'myAddress2'){
          msg = '常用地址2'
        }
        let detailAddress = address.city + address.county + address.detailAddress
        this.$store.dispatch('showConfirm', {
          title: '确认',
          confirmText: '修改地址',
          cancelText: '取消',
          content: '<p>您设置的 '+ msg +' 不在接送范围内</p><p style="font-size:1.3rem;color:#999;margin-top:.5rem;">（'+ msg +': '+ detailAddress +'）</p>',
          onConfirm: () => {
            this.$router.push({name: 'setInfo'})
          },
          onCancel: () => {
          }
        })
      },

      jumpToOutOfRange() {
        let city = this.localData.startPlace
        if(!this.isFrom){
          city = this.localData.endPlace
        }
        this.saveForm()
        this.$router.push({
          name: 'outOfRange',
          query:{
            productId: this.productId,
            productTypeLevelOne: this.productTypeLevelOne,
            start: 1,
            fromPage: this.pageRouter,
            lineType: this.lineType,
            dataKey: this.dataKey,
            code: this.localData.from.code,
            city: city
          }
        })
      },

      jumpToShowRange () {
        let city = this.localData.startPlace
        if(!this.isFrom){
          city = this.localData.endPlace
        }
        this.saveForm()
        this.$router.push({
          name:'showRange',
          query:{
            productId: this.productId,
            productTypeLevelOne: this.productTypeLevelOne,
            start: 1,
            fromPage: this.pageRouter,
            dataKey: this.dataKey,
            lineType: this.lineType,
            code: this.localData.from.code,
            city: city
          }
        })
      },

      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },
      
      onStationSelect (address) {
        if(this.isFrom){
          api.carpoolProductInRange({
            code: this.localData.from.code,
            siteId: address.siteId,
          }).then(res=>{
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              if(data.resultData.needReverse){
                this.needReverse = data.resultData.needReverse
              }
              this.setAddress(address)
            }
          })
        }else{
          this.setAddress(address);
        }
      },

      setAddress (address) {
        if(this.needReverse){
          this.$store.dispatch('showConfirm', {
            title: '确认',
            content: `您当前所选的地址属于${this.needReverse.name}，是否切换？`,
            onConfirm: ()=>{
              this.setAddressHandle(address)
            },
            onCancel: () =>{
            }
          })
        }else{
          this.setAddressHandle(address)
        }
      },
      
      setAddressHandle (address) {
        if(address){
          this.localData[this.dataKey] = Object.assign(this.localData[this.dataKey], address);
          if(this.localData[this.dataKey].settingType === 0){
            this.localData[this.dataKey].siteId = ''
          }
    
          if(this.needReverse){
            this.localData.from.code = this.needReverse.code
            this.localData.startPlace = this.needReverse.name
            this.setDefaultCity();
          }
    
          if(this.isFrom && this.pageRouter !== 'busCarpooling'){
            this.localData.to = {}
            this.localData.startTime = ''
            this.localData.passengerNum = 0
            this.localData.productId = ''
            this.localData.lineType = ''
            this.localData.endPlace = ''
            this.to = ''
          }
          appStorage.set(this.pageRouter, JSON.stringify(this.localData))
        }
        if(this.pageActive){
          this.$router.replace({
            name: 'busCarpooling',
            query:{
              productId: this.productId,
              productTypeLevelOne: this.productTypeLevelOne,
              productTypeLevelTwo: this.productTypeLevelTwo,
              lineType: this.lineType,
            }
          })
        }else{
          this.$router.back()
        }
      },

      setMapView () {
        this.historyPage = 0
        this.currentPage = 0
        this.addressQuery = ""
        if(this.isFrom){
          this.geoAddress(this.localData.from.lat, this.localData.from.lng, true)
        }else {
          this.geoAddress(this.localData.to.lat, this.localData.to.lng, true)
        }
        this.$refs.suggestMap.show(this.localData, this.isFrom);
        this.showMapViewRange()
      },
      
      showMapViewRange () {
        if(!this.productId && !this.localData.from.code){
          return
        }
        let city = this.localData.startPlace
        if(!this.isFrom){
          city = this.localData.endPlace
        }
        
        this.$refs.suggestMap.cityProductGetArea({
          productId: this.productId,
          productTypeLevelOne: this.productTypeLevelOne,
          fromPage: this.pageRouter,
          dataKey: this.dataKey,
          lineType: this.lineType,
          code: this.localData.from.code,
          city: city,
          isStart: this.localData.isStart
        })
      },

      cancel () {
        if (this.currentPage === 2 && this.cityList.length && ((this.isFrom && this.localData.from.code) || this.localData.to.code)){
          this.historyPage = 1
          this.currentPage = 1
        }else{
          this.$router.back()
        }
      },


    },
  }
</script>
<style lang="less">
  .suggest-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 40;
    width: 100%;
    background: #f3f4f5
  }

  .suggest-wrapper.suggest-move-enter-active,.suggest-wrapper.suggest-move-leave-active {
    -webkit-transition: all .3s;
    transition: all .3s
  }

  .suggest-wrapper.suggest-move-enter,.suggest-wrapper.suggest-move-leave-active {
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(100%,0,0)
  }


  .suggest {
    width: 100%;
    height: 100%
  }

  .suggest .suggest-header {
    position: relative;
    z-index: 10;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 44PX;
    white-space: nowrap;
    background: #fff;
    box-shadow: 0 2PX 3PX rgba(0,0,0,.12);
    overflow:hidden;
  }

  .suggest .suggest-header .city-wrapper {
    padding: 13PX 0;
    &.flex-input{
      flex:1;
    }
  }

  .suggest .suggest-header .city-wrapper .city-content {
    height: 18PX
  }

  .suggest .suggest-header .city-wrapper .city-content .city-select {
    line-height: 18PX;
    padding: 0 16PX;
    font-size: 0
  }

  .suggest .suggest-header .city-wrapper .city-content .city-select .text {
    display: inline-block;
    vertical-align: top;
    color: #666;
    font-size: 14PX
  }

  .suggest .suggest-header .city-wrapper .city-content .city-select .mfic-pulldown {
    display: inline-block;
    vertical-align: top;
    color: #999;
    font-size: 16PX
  }

  .suggest .suggest-header .city-wrapper .city-content .city-select .text {
    margin-right: 4PX
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper {
    width: 100%;
    height: 18PX;
    padding: 0 10PX;
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper.city-move-enter-active {
    -webkit-transition: all .2s;
    transition: all .2s
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper.city-move-enter {
    width: 110PX
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper .city-input {
    display: table-cell;
    width: 100%;
    margin-top: -15PX;
    padding: 15PX 0;
    vertical-align: middle;
    font-size: 14PX
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper .city-input::-webkit-input-placeholder {
    color: #ccc
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper .city-input::-moz-placeholder {
    color: #ccc
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper .city-input:-ms-input-placeholder {
    color: #ccc
  }

  .suggest .suggest-header .city-wrapper .city-content .city-input-wrapper .city-input::placeholder {
    color: #ccc
  }

  .suggest .suggest-header .address-wrapper {
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 10PX;
    &.title{
      font-size: 16PX;
      color: #4c4c4c;
      text-align: center;
      line-height: 24PX;
    }
  }

  .suggest .suggest-header .address-wrapper .address-input {
    display: table-cell;
    width: 100%;
    margin-top: -10PX;
    padding: 14PX 0;
    vertical-align: middle;
    font-size: 14PX
  }

  .suggest .suggest-header .address-wrapper .address-input::-webkit-input-placeholder {
    color: #ccc
  }

  .suggest .suggest-header .address-wrapper .address-input::-moz-placeholder {
    color: #ccc
  }

  .suggest .suggest-header .address-wrapper .address-input:-ms-input-placeholder {
    color: #ccc
  }

  .suggest .suggest-header .address-wrapper .address-input::placeholder {
    color: #ccc
  }

  .suggest .suggest-header .address-wrapper .clear {
    position: absolute;
    right: 0;
    top: 14PX
  }

  .suggest .suggest-header .address-wrapper .clear .mfic-wrong {
    line-height: 1;
    padding: 10PX;
    color: #999;
    font-size: 14PX
  }

  .suggest .suggest-header .cancel-wrapper .text {
    display: inline-block;
    padding: 0 16PX;
    margin-top: 15PX;
    color: #999;
    font-size: 14PX
  }

  .suggest .page-city,.suggest .page-list,.suggest .page-map {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%
  }

  .suggest .page-city,.suggest .page-list {
    top: 44PX
  }

  .noresult .warning {
    padding: 120PX 0 10PX;
  }

  .noresult .warning .warning-icon {
    width: 50PX;
    height: 50PX;
    margin: 0 auto;
    border-radius: 50%;
    background: #4a4c5b
  }

  .noresult .warning .warning-icon .mfic-important {
    display: inline-block;
    margin: -7PX 0 0 -7PX;
    font-size: 64PX;
    color: #f3f4f5
  }

  .noresult .desc {
    text-align: center;
    font-size: 14PX;
    color: #666;
    line-height:1.4;
  }

  .noresult .button-call{
    display: block;
    width:180px;
    height:60px;
    line-height:60px;
    margin:36px auto 0;
    border:1PX solid #ccc;
    font-size:24px;
    color:#4c4c4c;
    text-align:center;
    border-radius:8px;
  }

  .noresult .button-call i{
    position: relative;
    top:-2px;
    display: inline-block;
    width:26px;
    height:26px;
    margin-right:7px;
    background:url("../../../assets/tel.png") no-repeat 0 0;
    background-size:24px 24px;
    vertical-align: middle;
  }
  
  .subpoilist .group {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 10PX;
  }

  .subpoilist .group:last-child {
    margin-bottom: 0
  }

  .subpoilist .group .item {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-right: 6PX;
    height: 30PX;
    line-height: 30PX;
    text-align: center;
    color: #666;
    font-size: 12PX;
  }

  .subpoilist .group .item:last-child {
    margin: 0
  }

  .subpoilist .group .item.border {
    position: relative;
    background: #fff
  }

  .subpoilist .group .item.border:after {
    content: "";
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    border: 1PX solid #ccc;
    border-radius: 2PX;
    box-sizing: border-box;
    width: 100%;
    height: 100%
  }

  @media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio:2) {
    .subpoilist .group .item.border:after {
      width:200%;
      height: 200%;
      border-radius: 4PX;
      -webkit-transform: scale(.5) translateZ(0);
      transform: scale(.5) translateZ(0)
    }
  }

  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio:3) {
    .subpoilist .group .item.border:after {
      width:300%;
      height: 300%;
      border-radius: 6PX;
      -webkit-transform: scale(.33) translateZ(0);
      transform: scale(.33) translateZ(0)
    }
  }

  .subpoilist .group .item.border.active {
    background: rgba(0,0,0,.04)
  }

  @font-face {
    font-family: icon;
    src: url("../../../../static/fonts/icon-v9.woff") format('woff'),url("../../../../static/fonts/icon-v9.ttf") format('truetype'),url("../../../../static/fonts/icon-v9.svg#icon") format('svg')
  }

  [class*=" mfic-"],[class^=mfic-] {
    font-family: icon!important;
    font-size: 100%;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: .2px;
    -moz-osx-font-smoothing: grayscale
  }

  .mfic-female:before {
    content: "\E601"
  }

  .mfic-male:before {
    content: "\E602"
  }

  .mfic-pulldown:before {
    content: "\E603"
  }

  .mfic-pullup:before {
    content: "\E604"
  }

  .mfic-walkperson:before {
    content: "\E605"
  }

  .mfic-wild-cancel:before {
    content: "\E606"
  }

  .mfic-more:before {
    content: "\E607"
  }

  .mfic-back:before {
    content: "\E608"
  }

  .mfic-rushup:before {
    content: "\E609"
  }

  .mfic-goright:before {
    content: "\E60A"
  }

  .mfic-click:before {
    content: "\E60B"
  }

  .mfic-exchange:before {
    content: "\E60C"
  }

  .mfic-narrow-cancel:before {
    content: "\E60D"
  }

  .mfic-pricedown:before {
    content: "\E60E"
  }

  .mfic-priceup:before {
    content: "\E60F"
  }

  .mfic-cantsee:before {
    content: "\E610"
  }

  .mfic-cansee:before {
    content: "\E611"
  }

  .mfic-complaints:before {
    content: "\E612"
  }

  .mfic-map-model:before {
    content: "\E613"
  }

  .mfic-important:before {
    content: "\E614"
  }

  .mfic-dmoney:before {
    content: "\E615"
  }

  .mfic-question:before {
    content: "\E616"
  }

  .mfic-right:before {
    content: "\E617"
  }

  .mfic-wrong:before {
    content: "\E618"
  }

  .mfic-tips-icon:before {
    content: "\E619"
  }

  .mfic-remove:before {
    content: "\E61A"
  }

  .mfic-money:before {
    content: "\E61B"
  }

  .mfic-add:before {
    content: "\E61C"
  }

  .mfic-send-plane:before {
    content: "\E61D"
  }

  .mfic-activity2:before {
    content: "\E61E"
  }

  .mfic-pick-plane:before {
    content: "\E61F"
  }

  .mfic-activity:before {
    content: "\E620"
  }

  .mfic-walk:before {
    content: "\E621"
  }

  .mfic-cross-city:before {
    content: "\E622"
  }

  .mfic-barricades:before {
    content: "\E623"
  }

  .mfic-index-typechange:before {
    content: "\E624"
  }

  .mfic-notice:before {
    content: "\E625"
  }

  .mfic-service-description:before {
    content: "\E626"
  }

  .mfic-questionnaire:before {
    content: "\E627"
  }

  .mfic-common-route:before {
    content: "\E628"
  }

  .mfic-order:before {
    content: "\E629"
  }

  .mfic-agreement:before {
    content: "\E62A"
  }

  .mfic-ticket:before {
    content: "\E62B"
  }

  .mfic-data:before {
    content: "\E62C"
  }

  .mfic-testdrive-buycoupon:before {
    content: "\E62D"
  }

  .mfic-coupons:before {
    content: "\E62E"
  }

  .mfic-wallet-vouchers2:before {
    content: "\E62F"
  }

  .mfic-wallet-vouchers1:before {
    content: "\E630"
  }

  .mfic-form-sharetravel:before {
    content: "\E631"
  }

  .mfic-dialog-unwifi:before {
    content: "\E632"
  }

  .mfic-purse:before {
    content: "\E633"
  }

  .mfic-dialog-smile:before {
    content: "\E634"
  }

  .mfic-integral:before {
    content: "\E635"
  }

  .mfic-dialog-cry:before {
    content: "\E636"
  }

  .mfic-email:before {
    content: "\E637"
  }

  .mfic-game:before {
    content: "\E638"
  }

  .mfic-dialog-wifi:before {
    content: "\E639"
  }

  .mfic-flash:before {
    content: "\E63A"
  }

  .mfic-hot:before {
    content: "\E63B"
  }

  .mfic-bbs:before {
    content: "\E63C"
  }

  .mfic-side-message:before {
    content: "\E63D"
  }

  .mfic-delete:before {
    content: "\E63E"
  }

  .mfic-vip:before {
    content: "\E63F"
  }

  .mfic-mute:before {
    content: "\E640"
  }

  .mfic-warn:before {
    content: "\E641"
  }

  .mfic-volume:before {
    content: "\E642"
  }

  .mfic-bad:before {
    content: "\E643"
  }

  .mfic-mobilephone:before {
    content: "\E644"
  }

  .mfic-location:before {
    content: "\E645"
  }

  .mfic-call-police:before {
    content: "\E646"
  }

  .mfic-invoice:before {
    content: "\E647"
  }

  .mfic-keyboard:before {
    content: "\E648"
  }

  .mfic-wallet-balance:before {
    content: "\E649"
  }

  .mfic-wallet-travelcard:before {
    content: "\E64A"
  }

  .mfic-balance-pay:before {
    content: "\E64B"
  }

  .mfic-road-condition:before {
    content: "\E64C"
  }

  .mfic-navigation:before {
    content: "\E64D"
  }

  .mfic-safe-pay:before {
    content: "\E64E"
  }

  .mfic-discount:before {
    content: "\E64F"
  }

  .mfic-clean:before {
    content: "\E650"
  }

  .mfic-lock:before {
    content: "\E651"
  }

  .mfic-unlock:before {
    content: "\E652"
  }

  .mfic-edit:before {
    content: "\E653"
  }

  .mfic-sweep:before {
    content: "\E654"
  }

  .mfic-qr_code:before {
    content: "\E655"
  }

  .mfic-subway:before {
    content: "\E656"
  }

  .mfic-insurance-agreement:before {
    content: "\E657"
  }

  .mfic-sofa:before {
    content: "\E658"
  }

  .mfic-timepicker:before {
    content: "\E659"
  }

  .mfic-bus:before {
    content: "\E65A"
  }

  .mfic-double:before {
    content: "\E65B"
  }

  .mfic-addressbook:before {
    content: "\E65C"
  }

  .mfic-side-respect:before {
    content: "\E65D"
  }

  .mfic-form-site:before {
    content: "\E65E"
  }

  .mfic-time:before {
    content: "\E65F"
  }

  .mfic-second-type-change:before {
    content: "\E660"
  }

  .mfic-emoji:before {
    content: "\E661"
  }

  .mfic-side-hiredriver:before {
    content: "\E662"
  }

  .mfic-waiting:before {
    content: "\E663"
  }

  .mfic-redpacket:before {
    content: "\E664"
  }

  .mfic-side-reference:before {
    content: "\E665"
  }

  .mfic-side-find:before {
    content: "\E666"
  }

  .mfic-im-servicecard:before {
    content: "\E667"
  }

  .mfic-evaluation-star:before {
    content: "\E668"
  }

  .mfic-side-set:before {
    content: "\E669"
  }

  .mfic-side-wallet:before {
    content: "\E66A"
  }

  .mfic-sug-company:before {
    content: "\E66B"
  }

  .mfic-side-trip:before {
    content: "\E66C"
  }

  .mfic-sug-home:before {
    content: "\E66D"
  }

  .mfic-side-credit:before {
    content: "\E66E"
  }

  .mfic-security:before {
    content: "\E66F"
  }

  .mfic-side-mall:before {
    content: "\E670"
  }

  .mfic-tips-dialog:before {
    content: "\E671"
  }

  .mfic-car:before {
    content: "\E672"
  }

  .mfic-microcphone:before {
    content: "\E673"
  }

  .mfic-search:before {
    content: "\E674"
  }

  .mfic-good:before {
    content: "\E675"
  }

  .mfic-tips-alert:before {
    content: "\E676"
  }

  .mfic-im-picture:before {
    content: "\E677"
  }

  .mfic-phrase:before {
    content: "\E678"
  }

  .mfic-service:before {
    content: "\E679"
  }

  .mfic-phone:before {
    content: "\E67A"
  }

  .mfic-dialog-location:before {
    content: "\E67B"
  }

  .mfic-like:before {
    content: "\E67C"
  }

  .mfic-camera:before {
    content: "\E67D"
  }

  .mfic-person:before {
    content: "\E67E"
  }

  .mfic-exchange-card:before {
    content: "\E67F"
  }

  .mfic-didilogo:before {
    content: "\E680"
  }

  .mfic-dialog_icon:before {
    content: "\E681"
  }

  .mfic-round_border:before {
    content: "\E682"
  }

  .mfic-round_border_new:before {
    content: "\E683"
  }

  .mfic-didian:before {
    content: "\E684"
  }

  .mfic-kc-jj:before {
    content: "\E685"
  }

  .mfic-kc-pc:before {
    content: "\E686"
  }

  .mfic-kc-yx:before {
    content: "\E687"
  }

  .mfic-zc-seven:before {
    content: "\E688"
  }

  .mfic-zc-hh:before {
    content: "\E689"
  }

  .mfic-zc-ss:before {
    content: "\E68A"
  }

  .mfic-gantanhao:before {
    content: "\E68B"
  }

  .mfic-simple-correct:before {
    content: "\E68C"
  }

  .mfic-onsale:before {
    content: "\E68D"
  }
</style>
