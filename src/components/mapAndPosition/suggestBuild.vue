<template>
  <div class="suggestlist">
    <div class="split"></div>
    <div class="list-wrapper" ref="wrapper">
      <div>
        <ul class="build-map-tool line line-x-b">
          <li class="icon-build-map line line-y-r" @click="setMapView">地图模式</li>
          <li class="icon-build-area line line-y-r" @click="jumpToShowRange">接送范围</li>
          <li class="icon-build-fav line line-y-r" @click="setMyaddress(address1, 'myAddress1')">常用地址1</li>
          <li class="icon-build-fav" @click="setMyaddress(address2, 'myAddress2')">常用地址2</li>
        </ul>
        <ul class="suggest-list-box" v-show="showList">
          <li class="history" v-for="(data, index) in historys"
              @click="selectItem(data)">
            <p class="p1">
              {{data.name}}
                        </p>
            <p class="p2">{{data.address}}</p>
            <p class="delete" @click.stop="deleteHistory(index)"></p>
          </li>
          <li v-for="(data, index) in firmRecommendAddess"
              v-show="!addressQuery"
              @click="selectRecommendItem(data)">
            <p class="p1">
              {{data.name}}<i class="tj">推荐</i>
            </p>
            <p class="p2">{{data.detailAddress}}</p>
          </li>
          <li v-for="(data, index) in recommendAddess"
              v-show="!addressQuery"
              @click="selectRecommendItem(data)">
            <p class="p1">
              {{data.name}}
            </p>
            <p class="p2">{{data.detailAddress}}</p>
          </li>
          <li v-for="data in dataList"
              @click="selectItem(data)"
              @touchstart="addActiveCls"
              @touchend="removeActiveCls">
            <p class="p1">
              {{data.name}}
            <span class="distance" v-if="inRange">{{data.dist | formatMeter}}</span>
            </p>
            <p class="p2">{{data.address}}</p>
          </li>
        </ul>
        <div class="noresult" v-show="!showList">
          <div class="warning">
            <div class="warning-icon">
              <span class="mfic-important"></span>
            </div>
          </div>
          <div class="desc" v-html="resultDesc"></div>
          <a v-show="showPhone" class="button-call" @click="callService('')"><i></i>联系客服</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import MyAddress from 'appComponents/myAddress/index'
  import phone from 'mixins/phone'
  
  export default {
    components: {
      MyAddress
    },
    props: {
      addressQuery: {
        default: '',
      },
      currentCity: {
        default: '',
      },
      showPhone: {
        default: '',
      },
      isFrom: {
        default: true,
      },
      inRange: {
        default: false,
      },
      resultDesc: {
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
      firmRecommendAddess: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    computed: {
      historyKey () {
        if(this.isFrom){
          return 'carpool_starts'
        }else{
          return 'carpool_ends'
        }
      }
    },
    mixins: [phone],
    data () {
      return {
        address1: '',
        address2: '',
        historys:[],
        showList: true
      }
    },
    watch: {
      dataList (newVal) {
        let _this = this;
        if(newVal.length){
          this.$nextTick(() => {
            if(this.scroll){
              this.scroll.refresh()
            }else{
              this.scroll = new BScroll(this.$refs.wrapper, {
                click: true
              })
              this.scroll.on('beforeScrollStart', function () {
                _this.$emit('beforeScrollStart')
              })
            }
          })
        }
        this.showList = !!newVal.length
      },
      currentCity () {
        this.setHistory()
      }
    },
    mounted () {
      this.setHistory()
      this.getAddress()
    },
    methods: {
      setHistory () {
        let tag = true
        if(appStorage.get(this.historyKey)){
          let addresses = JSON.parse(appStorage.get(this.historyKey))
          for(let i = 0; i < addresses.length; i++){
            if(addresses[i].city.indexOf(this.currentCity) > -1){
              tag = false
              this.historys = addresses[i].datas
              break;
            }
          }
        }
        if(tag){
          this.historys = []
        }
      },
      
      deleteHistory (index, $event) {
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
      
      selectItem (address, addressType) {
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
            _this.$emit('addressSelect', param, addressType, address)
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
      
      setMapView () {
        this.$emit('setMapView')
      },
      
      jumpToShowRange () {
        this.$emit('jumpToShowRange')
      },
      
      /**
       * 获取常用地址
       */
      getAddress () {
        api.userGetCommonAddressOne().then(res1 => {
          if(res1.data.resultCode === '0') {
            this.address1 = res1.data.resultData;
          }
          
        });
        api.userGetCommonAddressTwo().then(res2 => {
          if(res2.data.resultCode === '0') {
            this.address2 = res2.data.resultData;
          }
        });
      },
      
      /**
       * 将后台地址转换成百度地图格式
       */
      toTencentAddress (address) {
        if (!address) {
          return ''
        }
        let latLng = TOOL.baiduToTencent({lat:address.latitude, lng:address.longitude})
        return {
          name:address.detailAddress,
          latLng: latLng
        }
      },
      
      /**
       * 设置我的地址信息
       */
      setMyaddress (infoAddress, addressType) {
        infoAddress = this.toTencentAddress(infoAddress);
        if (infoAddress && infoAddress.name) {
          this.selectItem(infoAddress, addressType)
        } else {
          this.$router.push({name: 'setInfo'})
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .build-map-tool{
    display:flex;
    li{
      flex:1;
      text-align:center;
      padding:82px 0 10px;
      font-size:24px;
      color:#888;
      background: no-repeat center 20px;
      background-size:40px 40px;
    }
    .icon-build-map{
      background-image:url("../../assets/tag/icon_build_map.png");
    }
    .icon-build-area{
      background-image:url("../../assets/tag/icon_build_area.png");
    }
    .icon-build-fav{
      background-image:url("../../assets/tag/icon_build_fav.png");
    }
  }
  .suggestlist {
    width: 100%;
    height: 100%;
  }
  
  .suggestlist .split {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 10PX;
    background: #f3f4f5
  }
  
  .suggestlist .list-wrapper {
    width: 95%;
    height: 100%;
    margin: 0 auto;
    border-radius: 2PX;
    background: #fff;
    box-shadow: 0 1PX 3PX rgba(0,0,0,.1)
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
    }
  }
</style>