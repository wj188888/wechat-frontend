<template>
  <div class="suggestmap" v-show="visible">
    <div :id="mapId" class="mapcontainer"></div>
    <div class="pull-down" v-show="showList" @click="pullDownList" :class="{'pull-up': pullStatus}"></div>
    <div class="suggest-address-wrapper" ref="suggestBuild">
      <div class="box">
        <ul class="suggest-list-box" v-show="showList">
          <li class="history" v-for="data in historys"
              @click="selectItem(data)"
              @touchstart="addActiveCls"
              @touchend="removeActiveCls">
            <p class="p1">
              {{data.name}}
            </p>
            <p class="p2">{{data.address}}</p>
            <p class="delete" @click.stop="deleteHistory(index)"></p>
          </li>
          <li v-for="data in recommendAddess"
              @click="selectRecommendItem(data)"
              @touchstart="addActiveCls"
              @touchend="removeActiveCls">
            <p class="p1">
              {{data.name}}
            </p>
            <p class="p2">{{data.detailAddress}}</p>
          </li>
          <li v-for="(data, index) in addressList"
              @click="selectItem(data)"
              @touchstart="addActiveCls"
              @touchend="removeActiveCls">
            <p class="p1">
              {{data.name}}
              <!--<span class="distance">{{data.dist | formatMeter}}</span>-->
            </p>
            <p class="p2">{{data.address}}</p>
            <div class="tip" v-if="index === 0 && pullStatus">
              <span class="text">确定</span>
            </div>
          </li>
        </ul>
        <div class="noresult" v-show="!showList">
          <div class="warning pat-t-60">
            <div class="warning-icon">
              <span class="mfic-important"></span>
            </div>
          </div>
          <div class="desc" v-html="mapResultDesc"></div>
          <a v-show="!inRange" class="button-call" @click="callService('')"><i></i>联系客服</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import qqMap from 'utils/qqmap/CreateMap'
  import phone from 'mixins/phone'
  import { mapState } from 'vuex'
  
  export default {
    props: {
      currentCity: {
        default: '',
      },
      isFrom: {
        default: true,
      },
      inRange: {
        default: false,
      },
      pageRouter: {
        default: false,
      },
      mapResultDesc: {
        default: '',
      },
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      },
      recommendAddess: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    mixins: [phone],
    data () {
      return {
        realTimeGeo:'',
        map: '',
        resetControl:'',
        probeControl: '',
        user:'',
        mapId: "suggestmap",
        visible: false,
        currentStation: {},
        mapCenter: {
          lat: 0,
          lng: 0
        },
        historys:[],
        showList: true,
        pullStatus: false
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
      historyKey () {
        if(this.isFrom){
          return 'carpool_starts'
        }else{
          return 'carpool_ends'
        }
      },
      addressList () {
        if(!this.pullStatus){
          return this.dataList
        }else{
          if(this.dataList.length){
            return this.dataList.slice(0, 1)
          }else{
            return this.dataList
          }
        }
      }
    },
    watch: {
      currentCity () {
        this.setHistory()
      },
      dataList (newVal) {
        this.showList = !!newVal.length
        if(!this.showList){
          this.$refs.suggestBuild.removeAttribute('style')
        }
        if(this.pullStatus){
          if(this.showList){
            this.pullStatus = true
            this.$refs.suggestBuild.style.height = 80 + 'px'
            this.$refs.suggestBuild.style.overflow = 'hidden'
          }
        }
      }
    },
    mounted () {
      this.setHistory()
    },
    methods: {
      setHistory () {
        if(appStorage.get(this.historyKey)){
          let addresses = JSON.parse(appStorage.get(this.historyKey))
          for(let i = 0; i < addresses.length; i++){
            if(addresses[i].city.indexOf(this.currentCity) > -1){
              this.historys = addresses[i].datas
            }else{
              this.historys = []
            }
          }
        }
      },
      
      deleteHistory (index) {
        this.historys.splice(index, 1)
        if(appStorage.get(this.historyKey)){
          let addresses = JSON.parse(appStorage.get(this.historyKey))
          for(let i = 0; i < addresses.length; i++){
            if(addresses[i].city.indexOf(this.currentCity) > -1){
              addresses[i].datas = this.historys
              break;
            }
          }
          appStorage.set(this.historyKey, JSON.stringify(addresses))
        }
      },
      
      _initMap () {
        let lat = this.mapCenter.lat,
          lng = this.mapCenter.lng;
        this.map = new qqMap.createMap(this.mapId, {
          lat: lat,
          lng: lng,
          zoom: 16
        })
        this._addProbeControl()
        if(this.inRange){
          this._addResetControl()
          if(this.appAddress && this.appAddress !== TOOL.locationFail){
            this._addUser(this.appAddress.position)
          }else{
            this.$store.watch((state) => {
              return state.city.appAddress;
            }, (newVal, oldVal) => {
              if(newVal && newVal !== TOOL.locationFail){
                this._addUser(newVal.position)
              }
            }, {deep: true});
          }
        }
      },
      
      _addProbeControl () {
        let className = 'map-probe-control'
        if(!this.isFrom){
          className = 'map-probe-control-end'
        }
        this.probeControl = new qqMap.control.ProbeControl({
          map: this.map,
          align: "center",
          className: className,
          probeLatlng: {
            lat: this.mapCenter.lat,
            lng: this.mapCenter.lng
          }
        })
        this.probeControl.on("picked", (address) => {
          this.currentStation = address
          this.$emit('poiChange', address)
        })
      },
      
      _addResetControl () {
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          clickHandler: () => {
            let lat = this.user.getPosition().lat,
              lng = this.user.getPosition().lng;
            this.map.setZoom(16)
            this.map.setCenter(lat, lng);
            this.$emit('reset')
          }
        })
      },
      
      _addUser (point) {
        this.user = new qqMap.component.User({
          map: this.map,
          type: 0,
          geo: false,
          lat: point.lat,
          lng: point.lng
        });
        this.$watch("realTimeGeo", (point) => {
          this.user.setPosition({lat: point.lat, lng: point.lng})
        })
      },
      
      _removeMap () {
        if(this.map){
          this.map.remove()
        }
      },
      
      _restore () {
        if(this.resetControl){
          this.resetControl.show()
        }
        if(this.probeControl){
          this.probeControl.show()
        }
      },
      
      setMapCenter (lat, lng) {
        this.mapCenter = {lat: lat, lng: lng}
        if(this.map){
          this.map.setCenter(lat, lng)
        }
      },
      
      setCurrentStation (address) {
        this.currentStation = address
      },
      
      show (address, isFrom){
        if (address && ((address.from && address.from.lat && isFrom) || (address.to && address.to.lat && !isFrom))) {
          this.visible = true
          let addressTemp = address.from
          if(!isFrom){
            addressTemp = address.to
          }
          this.currentStation = addressTemp
          this.mapCenter = {
            lat: addressTemp.lat,
            lng: addressTemp.lng,
          }
          if(this.map){
            this._restore()
          }else{
            this._initMap()
          }
        }
      },
      
      hide () {
        if(this.resetControl){
          this.resetControl.hide()
        }
        if(this.probeControl){
          this.probeControl.hide()
        }
      },
      
      destroy () {
        this._removeMap()
        this.visible = false
      },
  
      selectRecommendItem (data) {
        let latLng = TOOL.baiduToTencent({lat:data.latitude, lng:data.longitude})
        let address = {
          name: data.name,
          address: data.detailAddress,
          latLng:{
            lat: latLng.lat,
            lng: latLng.lng
          }
        }
        this.selectItem(address)
      },
      
      selectItem (address) {
        let _this = this;
        let geocoder = new qq.maps.Geocoder({
          complete:function(result){
            let geoAddress = result.detail
            let param  = {
              cityAlis: _this.currentCity,
              city: geoAddress.addressComponents.city,
              county: geoAddress.addressComponents.district,
              town: geoAddress.addressComponents.town,
              name: address.name,
              detailAddress: address.address,
              lat: geoAddress.location.lat,
              lng: geoAddress.location.lng
            }
            _this.$emit('addressSelect', param, '', address)
          }
        });
        let point = new qq.maps.LatLng(address.latLng.lat, address.latLng.lng)
        geocoder.getAddress(point);
      },
      
      addActiveCls (elem) {
        $(elem.currentTarget).addClass('active')
      },
      
      removeActiveCls (elem) {
        $(elem.currentTarget).removeClass('active')
      },
  
      pullDownList () {
        if(!this.pullStatus){
          this.pullStatus = true
          this.$refs.suggestBuild.style.height = 80 + 'px'
          this.$refs.suggestBuild.style.overflow = 'hidden'
        }else{
          this.pullStatus = false
          this.$refs.suggestBuild.removeAttribute('style')
        }
      },
      
      cityProductGetArea (param) {
        this.$store.commit('UPDATE_LOADING', true);
        let resource;
        if(param.dataKey === 'from'){
          if(this.pageRouter === 'busCarpooling' && param.isStart) {
            resource = api.carpoolProductGetAreaById(param.productId, param.productTypeLevelOne, 0, param.lineType);
          } else {
            resource = api.carpoolProductGetArea(param.code);
          }
        }else{
          resource = api.carpoolProductGetAreaById(param.productId, param.productTypeLevelOne, 1, param.lineType);
        }
    
        resource.then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            for(let i = 0; i < data.resultData.length; i++){
              if(data.resultData[i] && data.resultData[i].length){
                this.drawRange(data.resultData[i])
              }
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
      
    }
  }

</script>
<style lang="less">
  .suggestmap{
    display:flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color:#fff;
    .mapcontainer {
      width: 100%;
      flex: 1;
      .csssprite{
        display:none!important;
      }
      div[draggable="false"][onresize="return;"]{
        display:none!important;
      }
    }
    .map-background {
      background:url("../../assets/tag/32.png") repeat 0 0 #e5e3df;
    }
  }
  
  .suggest-address-wrapper{
    height: 440px;
    overflow-y: scroll;
  }
  .pull-down{
    width:100%;
    height:60px;
    background: url("../../assets/jt_map_down.png") no-repeat center 20px #fff;
    background-size: 22px 12px;
  }
  .pull-up{
    background: url("../../assets/jt_map_up.png") no-repeat center 20px #fff;
    background-size: 22px 12px;
  }
  .suggest-list-box{
    padding-bottom:20px;
    li {
      position: relative;
      padding: 20px 20px 20px 90px;
      background: url("../../assets/map_no.png") no-repeat 30px center;
      background-size:22px 28px;
      &.history{
        background: url("../../assets/tag/history.png") no-repeat 30px center;
        background-size:24px 24px;
        .delete{
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: url("../../assets/tag/delete.png") no-repeat 60px center;
          background-size: 18px 18px;
        }
      }
      .p1{
        position: relative;
        padding-right: 70px;
        margin-bottom:10px;
        line-height:1.4;
        font-size:28px;
      }
      .distance{
        position: absolute;
        right:0;
        top: 5px;
        color:#999;
        font-size:20px;
      }
      .tj{
        display:inline-block;
        width: 56px;
        margin-left:20px;
        padding:14px 0;
        line-height:0;
        text-align:center;
        font-size:18px;
        color:#fff;
        background:#ff6600;
        border-radius:8px;
      }
      .p2{
        padding-right: 70px;
        font-size:24px;
        color:#999;
        line-height:1.4;
      }
      &.active{
        background-color: rgba(0,0,0,.04)
      }
      .tip {
        position: absolute;
        top:50%;
        right:20px;
        margin-top:-20px;
        text-align: right;
        color: #ff6600;
        .text {
          vertical-align: middle;
          font-size: 28px;
        }
      }
    }
  }
  .pat-t-60{
    padding-top:60PX!important;
  }


</style>
