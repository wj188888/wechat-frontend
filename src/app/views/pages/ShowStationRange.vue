<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="area-alias line line-x-b" v-show="this.rangeData.type === 1" v-text="areaAlias"></div>
    <div class="map-container" v-show="this.rangeData.type === 1" id="container"></div>
    <div class="pad-20">
      <h2 class="carpool-h2">基础价格</h2>
      <p class="carpool-p">拼车价格 <span class="carpool-span">{{rangeData.carpoolPrice}}元/座</span></p>
      <p class="carpool-p">包车价格 <span class="carpool-span">{{rangeData.charteredBusPrice}}元/车</span></p>
      <p class="carpool-p">提供车型 <span :class="{'carpool-span': index === 0}" v-for="(seat, index) in rangeData.seats">{{index === 1 ? '、' : ''}}{{seat}}座</span></p>
      <div v-if="rangeData.carpoolFloatPriceItems && rangeData.carpoolFloatPriceItems.length">
        <h2 class="carpool-h2 mar-t-40">浮动价格 - {{rangeData.carpoolFloatPriceItems[0].city}}</h2>
        <table class="carpool-table">
          <thead>
          <tr>
            <th>城市</th>
            <th>区县</th>
            <th>
              <p>拼车</p>
              <p>浮动价</p>
            </th>
            <th>
              <p>包车</p>
              <p>浮动价</p>
            </th>
            <th>备注</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="data in rangeData.carpoolFloatPriceItems">
            <td>{{data.city}}</td>
            <td>{{data.county}}</td>
            <td>{{data.carpoolFloatPrice}}</td>
            <td>{{data.charteredBusFloatPrice}}</td>
            <td>{{data.remark ? data.remark : '-'}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'

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
        type:'',
        feederId:'',
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
        },
        areaAlias:'',
        rangePolygon:'',
        rangeData: {
          carpoolFloatPriceItems: [],
          seats: []
        },
        bestView: {
          controls: [],
          pos: {
            paddingTop: 80,
            paddingBottom: 80,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        fromPage: '',
        lineType:''
      }
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.type = this.$route.query.type
      this.feederId = this.$route.query.feederId
      this.fromPage = this.$route.query.fromPage
      this.lineType = this.$route.query.lineType
      this.cityProductGetArea()
    },
    methods: {
      cityProductGetArea () {
        api.carpoolProductGetArea(this.productId, this.productTypeLevelOne, this.type, this.lineType).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.rangeData = data.resultData
            if(this.rangeData.type === 1){
              if(Object.prototype.toString.call(this.rangeData.carpoolFloatPriceItems) === '[object Array]'){
                let areaAliasArr = []
                for(let i = 0; i < this.rangeData.carpoolFloatPriceItems.length; i++){
                  areaAliasArr.push(this.rangeData.carpoolFloatPriceItems[i].areaAlias)
                  this.drawRange(this.rangeData.carpoolFloatPriceItems[i].area)
                }
                this.areaAlias = areaAliasArr.join('、')
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
  @import "../../../styles/theme.less";
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
  .map-container{
    height:600px;
  }
  .carpool-h2{
    font-size:28px;
    color: @fc-4c4c4c;
    margin-top:20px;
    .mar-t-40{
      margin-top:50px;
    }
  }
  .carpool-p{
    font-size:24px;
    color: @fc-888;
    margin-top:30px;
    span{
      color: @fc-4c4c4c;
    }
    .carpool-span{
      margin-left: 30px;
    }
  }
  .carpool-table{
    margin-top:20px;
    width: 100%;
    border-collapse: collapse;
    th,td{
      height:80px;
      line-height:1.4;
      border: 1PX solid @bc-ccc;
      text-align:center;
    }
    th{
      font-weight: normal;
      font-size:28px;
      color: @fc-4c4c4c;
    }
    td{
      font-size:24px;
      color: @fc-888;
    }
  }
</style>
