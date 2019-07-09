<template>
  <div class="suggestmap">
    <div :id="mapId" class="mapcontainer"></div>
    <div class="pull-down" ref="pullDown" v-show="showList" @click="pullDownList" :class="{'pull-up': pullStatus}"></div>
    <div class="suggest-address-wrapper" ref="stationList">
      <div class="box">
        <ul class="suggest-list-box" v-show="showList">
          <li v-for="(data, index) in addressList"
              :class="{'station-active': data.id === currentSite.id && addressList.length > 1, 'border-b-0': addressList.length === 1}"
              @click="setCurrentSite(data)"
              @touchstart="addActiveCls"
              @touchend="removeActiveCls">
            <p class="p1">
              {{data.name}}
            </p>
            <p class="p2">{{data.address}}</p>
            <a class="button-small-station" v-show="data.id === currentSite.id" @click="selectRecommendItem">确定</a>
          </li>
        </ul>
        <div class="noresult" v-show="!showList">
          <div class="warning pat-t-60">
            <div class="warning-icon">
              <span class="mfic-important"></span>
            </div>
          </div>
          <div class="desc"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import qqMap from 'utils/qqmap/CreateMap'
  import { mapState } from 'vuex'
  
  export default {
    props: {
      isFrom: {
        default: true,
      },
      siteId:'',
      sites: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data () {
      return {
        realTimeGeo:'',
        map: '',
        resetControl:'',
        user:'',
        mapId: "suggestmap1",
        mapCenter: {
          lat: 35.960223,
          lng: 114.257813
        },
        pointer:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 35,
            paddingBottom: 35,
            paddingLeft: 35,
            paddingRight: 35
          }
        },
        currentSite:{},
        addressList:[],
        historys:[],
        showList: true,
        pullStatus: false
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      })
    },
    watch: {
      sites (newVal) {
        if(!this.map){
          this._initMap()
        }
        if(this.bestView.controls.length){
          for(let i = 0; i < this.bestView.controls.length; i ++){
            this.bestView.controls[i].remove()
          }
        }
        this.bestView.controls = []
        this.currentSite = {}
        for(let i = 0; i < this.sites.length; i++){
          if(this.sites[i].id === this.siteId){
            this.setCurrentSite(this.sites[i])
          }
          let pointer = new qqMap.component.Station({
            map: this.map,
            lat: this.sites[i].latitude,
            lng: this.sites[i].longitude,
            type: 4,
            content: this.sites[i].name,
            clickHandler: () => {
              if(this.$refs.stationList && this.addressList.length > 1){
                this.$refs.stationList.scrollTop = this.$refs.stationList.offsetHeight / this.sites.length * i
              }
              this.setCurrentSite(this.sites[i], true)
            }
          })
          this.bestView.controls.push(pointer)
        }
        if(!this.currentSite.id){
          this.setCurrentSite(this.sites[0])
        }
        this.setCenter()
        if(!this.resetControl){
          this._addResetControl()
        }
        this.pullStatus = false
        this.showList = !!newVal.length
        if(!this.showList){
          this.$refs.stationList.removeAttribute('style')
        }
        this.addressList = [].concat(this.sites)
      }
    },
    mounted () {
      this._initMap()
    },
    methods: {
      
      _initMap () {
        this.map = new qqMap.createMap(this.mapId, {
          lat: this.mapCenter.lat,
          lng: this.mapCenter.lng,
          zoom: 16
        })
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
      
      _addResetControl () {
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          cssClass: 'map-reset-2',
          clickHandler: () => {
            this.setCenter()
          }
        })
      },
  
      setCenter () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },
  
      addStartPointer () {
        if(this.pointer){
          this.pointer.remove()
        }
        let type = this.isFrom ? 0 : 1
        this.pointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.currentSite.latitude,
          lng: this.currentSite.longitude,
          type: type
        })
      },
      
      setCurrentSite (data, isSiteClick) {
        this.currentSite = data
        if(isSiteClick) {
          this.changeToCurrentSite()
        }
        if(this.pullStatus){
          this.addressList = [this.currentSite]
        }else{
          this.addressList = [].concat(this.sites)
        }
        this.addStartPointer()
        if(true){
          this.mapCenter = {
            lat: this.currentSite.latitude,
            lng: this.currentSite.longitude
          }
          this.setMapCenter()
        }
      },
  
      setMapCenter () {
        if(this.map){
          this.map.baseMap.panTo(new qq.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng))
        }
      },
      
      selectRecommendItem () {
        let address = {
          name: this.currentSite.name,
          address: this.currentSite.address,
          latLng:{
            lat: this.currentSite.latitude,
            lng: this.currentSite.longitude
          },
          siteId: this.currentSite.id
        }
        this.selectItem(address)
      },
      
      selectItem (address) {
        let _this = this;
        let geocoder = new qq.maps.Geocoder({
          complete:function(result){
            let geoAddress = result.detail
            let param  = {
              city: geoAddress.addressComponents.city,
              county: geoAddress.addressComponents.district,
              town: geoAddress.addressComponents.town,
              name: address.name,
              detailAddress: address.address || (geoAddress.address + geoAddress.addressComponents.street + geoAddress.addressComponents.streetNumber),
              lat: geoAddress.location.lat,
              lng: geoAddress.location.lng,
              siteId: address.siteId
            }
            _this.$emit('stationSelect', param)
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
          this.changeToCurrentSite()
          this.addressList = [this.currentSite]
        }else{
          this.pullStatus = false
          this.$refs.stationList.removeAttribute('style')
          this.addressList = [].concat(this.sites)
          this.$nextTick(()=>{
            for(let i = 0; i < this.sites.length; i++){
              if(this.sites[i].id === this.currentSite.id){
                this.$refs.stationList.scrollTop = this.$refs.stationList.offsetHeight / this.sites.length * i
              }
            }
          })
        }
      },
      
      changeToCurrentSite () {
        this.pullStatus = true
        this.$refs.stationList.style.height = 'auto'
        this.$refs.stationList.scrollTop = 0
        this.$refs.stationList.style.overflow = 'hidden'
      }
      
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
      border-bottom:1PX solid #f2f2f2;
      &.station-active{
        background-color:#fff7f2;
      }
      &.border-b-0{
        border-bottom: 0;
      }
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
        padding-right: 100px;
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
        padding-right: 100px;
        font-size:24px;
        color:#999;
        line-height:1.4;
      }
      &.active{
        background-color: rgba(0,0,0,.04)
      }
      .button-small-station {
        position: absolute;
        top:50%;
        right:20px;
        margin-top:-20px;
        padding:10px 20px;
        border:1PX solid #ff6600;
        border-radius: 8px;
        text-align: right;
        color: #ff6600;
        font-size: 24px;
      }
    }
  }
  .pat-t-60{
    padding-top:60PX!important;
  }
</style>