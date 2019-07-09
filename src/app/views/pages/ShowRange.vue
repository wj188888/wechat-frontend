<template>
  <main-box :title="title">
    <div class="area-alias line line-x" v-if="areaAlias">{{areaAlias}}</div>
    <div class="area-alias line line-x" v-else>{{city}}接送范围（阴影区域）</div>
    <div class="map-container" id="container"></div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: '',
        productId:'',
        productTypeLevelOne:'',
        start:'',
        lineType:'',
        feederId:'',
        fromPage: '',
        dataKey: '',
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
        },
        city:'',
        areaAlias:'',
        rangePolygon:'',
        user:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10
          }
        },
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.start = this.$route.query.start
      this.lineType = this.$route.query.lineType
      this.feederId = this.$route.query.feederId
      this.fromPage = this.$route.query.fromPage
      this.code = this.$route.query.code
      this.city = this.$route.query.city
      this.dataKey = this.$route.query.dataKey
      this.cityProductGetArea()
    },
    methods: {
      cityProductGetArea () {
        this.$store.commit('UPDATE_LOADING', true);
        let resource;
        if(this.fromPage === 'expressCreate'){
          resource = api.expressProductGetArea(this.productId);
        }else if(this.fromPage === 'feeder'){
          resource = api.shuttleGetAreaById(this.feederId);
        }else if(this.fromPage === 'busCarpooling' || this.fromPage === 'carpoolbusIndex' || this.fromPage === 'carpoolbusMap'){
          if(this.dataKey === 'from'){
            if(this.productId) {
              resource = api.carpoolProductGetAreaById(this.productId, this.productTypeLevelOne, 0, this.lineType);
            } else {
              resource = api.carpoolProductGetArea(this.code);
            }
          }else{
            resource = api.carpoolProductGetAreaById(this.productId, this.productTypeLevelOne, 1, this.lineType);
          }
        }else{
          resource = api.productGetArea(this.productId, this.productTypeLevelOne, this.start);
        }

        resource.then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            if(this.fromPage != 'expressCreate') {
              if(Object.prototype.toString.call(data.resultData) === '[object Array]'){
                let areaAliasArr = []
                for(let i = 0; i < data.resultData.length; i++){
                  if(this.fromPage === 'busCarpooling' || this.fromPage === 'carpoolbusIndex' || this.fromPage === 'carpoolbusMap'){
                    this.drawRange(data.resultData[i])
                  }else{
                    areaAliasArr.push(data.resultData[i].areaAlias)
                    this.drawRange(data.resultData[i].area)
                  }
                }
                this.areaAlias = areaAliasArr.join('、')
              }else{
                this.areaAlias = data.resultData.areaAlias
                this.drawRange(data.resultData.area)
              }
            }else{
              if(Object.prototype.toString.call(data.resultData.area) === '[object Array]'){
                let areaAliasArr = []
                for(let i = 0; i < data.resultData.area.length; i++){
                  areaAliasArr.push(data.resultData.area[i].name)
                  this.drawRange(data.resultData.area[i].points)
                }
                this.areaAlias = areaAliasArr.join('、')
              }else{
                this.areaAlias = data.resultData.areaAlias
                this.drawRange(data.resultData.area)
              }
            }
//            if(this.dataKey === 'from'){
              if(this.appAddress && this.appAddress !== TOOL.locationFail){
                this.addUser(this.appAddress)
              }
              this.$watch("appAddress", (address) => {
                if(address && address!== TOOL.locationFail){
                  this.addUser(address)
                }
              })
//            }
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      addUser (address) {
        if(!address.position || !address.position.lat) return
        let position = address.position
        this.user = new qqMap.component.User({
          map: this.map,
          type: 0,
          geo: false,
          lat: position.lat,
          lng: position.lng
        });
//        this.bestView.controls.push(this.user)
//        this.setCenter()
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
          opacity: 0.3
        })
        this.bestView.controls.push(this.rangePolygon)
        this.setCenter()
        if(!this.resetControl){
          this._resetControl ()
        }
      },

      _resetControl () {
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          clickHandler: () => {
            this.setCenter()
          }
        })
      },

      setCenter () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },
    }
  }
</script>
<style lang="less" scoped>
  .area-alias{
    position: absolute;
    top:0;
    left:0;
    z-index:500;
    width: 100%;
    padding:0 150px;
    height:80px;
    line-height:80px;
    font-size:28px;
    color:#4c4c4c;
    text-align:center;
    background:#fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow:hidden;
  }
</style>
