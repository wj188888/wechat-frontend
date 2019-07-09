<template>
  <main-box :title="title">
    <div class="area-alias line line-x-b" v-text="areaAlias"></div>
    <div class="map-container" id="container"></div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import qqMap from '../../utils/qqmap/CreateMap'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: '',
        code:'',

        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
        },
        areaAlias:'',
        rangePolygon:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 80,
            paddingBottom: 80,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        fromPage: ''
      }
    },
    mounted () {
      this.fromPage = this.$route.query.fromPage
      this.code = this.$route.query.code
      this.countyAreaFind()
    },
    methods: {
      countyAreaFind () {
        this.$store.commit('UPDATE_LOADING', true);

        api.countyAreaFind(this.code).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.areaAlias = this.code
            this.drawRange(data.resultData)
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
