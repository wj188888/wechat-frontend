<template>
  <main-box :show-header="false">
    <div class="suggest-wrapper">
      <div class="suggest">
        <div class="suggest-header">
          <div class="city-wrapper" @click="selectCity" :class="{'flex-input': currentPage === 2}">
            <div class="city-content border-right-1px">
              <div class="city-select" v-show="currentPage !== 2">
                <span class="text">{{currentCity.city || '定位中...'}}</span>
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
          <div class="address-wrapper" v-if="currentPage !== 2">
            <input type="text"
                   class="address-input"
                   :placeholder="addressPlaceHolder"
                   ref="addressInput"
                   @focus="onAddressFocus"
                   v-model="addressQuery">
            <div class="clear" v-show="addressQuery" @click="clearAddress">
              <i class="mfic-wrong"></i>
            </div>
          </div>
          <div class="cancel-wrapper" @click="cancel">
            <span class="text border-left-1px">取消</span>
          </div>
        </div>

        <div class="page-map" v-if="isFrom">
          <suggestmap
                  v-show="currentPage===0"
                  ref="suggestMap"
                  @reset="reset"
                  @addressSelect="onAddressSelect"
                  @poiChange="onPoiChange">
          </suggestmap>
        </div>

        <div class="page-list" v-show="currentPage === 1" ref="pageList">
          <suggestlist
                  :data-list="dataList"
                  @beforeScrollStart="onAddressScrollStart"
                  @addressSelect="onAddressSelect">
          </suggestlist>
        </div>

        <div class="page-city" v-show="currentPage === 2">
          <citylist
                  ref="cityList"
                  :is-from="isFrom"
                  :city-list="cityList"
                  :current-city="currentCity"
                  @beforeScrollStart="onCityScrollStart"
                  @citySelect="onCitySelect"
                  class="citylist">
          </citylist>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import Suggestmap from 'components/mapAndPosition/suggestmap'
  import Suggestlist from 'components/mapAndPosition/suggestlist'
  import Citylist from 'components/mapAndPosition/citylist'
  import qqmapCity from '../../../utils/qqmapCity'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      Suggestmap,
      Suggestlist,
      Citylist
    },
    data () {
      return {
        dataList: [],
        addressQuery: "",
        cityQuery: "",
        currentCity: {
          city: '定位中...',
          lat: 0,
          lng:0
        },
        cityList: [],
        currentStation: {},
        currentPage:null,
        localData:{
          from:{},
          to:{}
        },
        productId: '',
        productTypeLevelOne: '',
        lineType:'',
        searchText: '',
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
        if(this.searchText) {
            return this.searchText;
        } else {
          return this.isFrom ? '您在哪上车' : '您要去哪儿'
        }
      }
    },
    watch: {
      addressQuery () {
        this.$nextTick(()=>{
          this.searchDataList();
        })
      },
      cityQuery (newVal) {
        this.$refs.cityList.match(newVal)
      }
    },
    created () {
      this.pageRouter = this.$route.query.pageRouter
      this.fromPage = this.$route.query.fromPage
      this.dataKey = this.$route.query.dataKey
      this.searchText = this.$route.query.searchText
      this.productId = this.$route.query.productId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
      this.lineType = this.$route.query.lineType
      
      if(this.appAddress){
        this.setStartPlace()
      }else{
        this.$store.commit('UPDATE_LOADING_TEXT', '定位中...');
        this.$store.commit('UPDATE_LOADING', true);
        this.$store.watch((state) => {
          return state.city.appAddress;
        }, (newVal, oldVal) => {
          this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('UPDATE_LOADING_TEXT', '');
          if(newVal && newVal !== TOOL.locationFail){
            this.setStartPlace(newVal)
          }else{
            this.setStartPlace()
          }
        }, {deep: true});
      }
    },
    methods: {
      setStartPlace (address) {
        if(appStorage.get(this.pageRouter)){
          this.localData = Object.assign(this.localData, JSON.parse(appStorage.get(this.pageRouter)))
        }
        if(address){
          let position = address.position
          if(!this.localData.from.lat && address.city && position){
            this.localData.from = {
              city: address.city,
              county: address.district,
              detailAddress: address.detailAddress,
              lat: position.lat,
              lng: position.lng
            }
          }
        }
        this.initialize ()
      },
      
      initialize () {
        this.reset()
        if(this.dataKey === 'from'){
          if(this.localData.from.city){
            this.currentPage = 0;
            this.$nextTick(()=>{
              if(this.$refs.suggestMap){
                this.$refs.suggestMap.show(this.localData.from)
              }
            })
          }else{
            this.currentPage = 2;
            this.cityList = qqmapCity
          }
        }else{
          if(this.localData.to.city || this.localData.from.city){
            this.currentPage = 1
            this.searchDataList();
          }else{
            this.currentPage = 2;
            this.cityList = qqmapCity
          }
        }
      },
      
      selectCity () {
        if(this.currentPage !== 2){
          this.currentPage = 2
          this.cityQuery = ""
          this.$nextTick(()=>{
            this.cityList = qqmapCity
          })
          
        }
      },

      onAddressFocus () {
        if(this.currentPage !== 1){
          this.currentPage = 1
          this.searchDataList()
        }
      },

      searchDataList () {
        if('' === this.addressQuery){
          let _this = this
          let geocoder = new qq.maps.Geocoder({
            complete:function(result){
              let geoAddress = result.detail
              _this.dataList = geoAddress.nearPois.sort((a, b)=>{
                return a.dist - b.dist
              });
            }
          });
          let point = new qq.maps.LatLng(this.currentCity.lat, this.currentCity.lng)
          geocoder.getAddress(point);
        }else{
          this.searchService(this.addressQuery);
        }
      },

      searchService (keyword) {
        let _this = this;
        let searchService = new qq.maps.SearchService({
          location : this.currentCity.city,
          autoExtend: false,
          pageCapacity:20,
          complete : function(results){
            _this.dataList = results.detail.pois;
          },
          error: function() {
            _this.dataList = []
          }
        });
        searchService.search(keyword);
      },

      searchNearBy (keyword, region) {
        let _this = this;
        let searchService = new qq.maps.SearchService({
          pageCapacity:20,
          location : this.currentCity.city,
          autoExtend: false,
          complete : function(results){
            _this.dataList = results.detail.pois;
          },
          error: function() {
            _this.dataList = []
          }
        });
        searchService.searchNearBy(keyword, region, 2000);
      },

      clearAddress () {
        this.addressQuery = ""
      },

      onPoiChange (address) {
        this.currentStation = address
      },

      onAddressScrollStart () {
        this.$refs.addressInput.blur()
      },

      onCityScrollStart () {
        this.$refs.cityInput.blur()
      },

      onCitySelect (city) {
        let _this = this;
        this.currentPage = 1
        let geocoder = new qq.maps.Geocoder({
          complete:function(result){
            let geoAddress = result.detail
            let address = {
              city: geoAddress.addressComponents.city,
              county: geoAddress.addressComponents.district,
              detailAddress: geoAddress.addressComponents.streetNumber || geoAddress.addressComponents.street,
              lat: geoAddress.location.lat,
              lng: geoAddress.location.lng
            }
            _this.dataList = geoAddress.nearPois.sort((a, b)=>{
              return a.dist - b.dist
            });
            if (_this.isFrom && _this.$refs.suggestMap) {
              _this.$refs.suggestMap.show(address)
              _this.$refs.suggestMap.setCurrentStation(address)
              _this.$refs.suggestMap.setMapCenter(address.lat, address.lng)
            }
          }
        });
        let point = new qq.maps.LatLng(city.value.lat, city.value.lng)
        geocoder.getAddress(point);
        if(this.currentCity.city !== city.name){
          this.currentCity = {
            city: city.name,
            lat: city.value.lat,
            lng: city.value.lng
          }
        }
      },

      onAddressSelect (address) {
        this.currentStation = address
        this.hide(address)
      },

      destroy () {
        if(this.isFrom){
          this.$refs.suggestMap.destroy()
        }
        this.$refs.addressInput.blur()
        this.$refs.cityInput.blur()
      },

      hide (address) {
          if(this.productTypeLevelOne === 'CAR_RENTAL') {
            this.rentInRange(address);
          } else {
            this.setAddress(address)
          }

      },

      tanspoint (address) {
        return TOOL.tencentToBaidu({
          lat: address.lat,
          lng: address.lng,
        })
      },

      rentInRange(address) {
        if(!address) {
          this.$router.back()
          return false;
        }

        let point = this.tanspoint(address)
        api.rentInRange({
          id:this.productId,
          point: {
            latitude: point.lat,
            longitude: point.lng
          }
        }).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
              if(data.resultData) {
                this.setAddress(address)
              } else {
                this.$store.dispatch('showError', '当前选择的地址不在服务范围内,请重新选择');
              }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      setAddress (address) {
        if(address){
          this.localData[this.dataKey] = address;
          appStorage.set(this.pageRouter, JSON.stringify(this.localData))
        }
        if(this.pageRouter === 'busIndex' && this.fromPage !== 'searchBusStation' && this.dataKey === 'to' && address){
          this.$router.replace({
            name: 'searchBusStation'
          })
        }else{
          this.$router.back()
        }
      },

      cancel () {
        if (this.isFrom) {
          if (this.currentPage === 1){
            this.currentPage = 0
            this.addressQuery = ""
            this.$refs.suggestMap.show(this.localData);
          }else{
            this.hide()
          }
        }else{
          this.hide()
        }
      },

      reset () {
        let fromCity = this.localData.from
        let toCity = this.localData.to && this.localData.to.city ? this.localData.to : fromCity
        if(this.dataKey === 'from'){
          this.currentCity = {
            city: fromCity.city,
            lat: fromCity.lat,
            lng: fromCity.lng
          }
        }else{
          this.currentCity = {
            city: toCity.city,
            lat: toCity.lat,
            lng: toCity.lng
          }
        }
      }
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
    padding: 0 10PX
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
    padding: 10PX
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
    padding: 120PX 0 16PX;
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
    color: #666
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
