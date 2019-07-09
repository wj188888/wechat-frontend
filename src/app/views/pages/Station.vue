<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="container-map bg-gray">
      <div class="box-map">
        <div class="map-container map-box" id="container"></div>
      </div>
      <div class="box-station">
        <ul class="station-list">
          <li class="line line-x-b"
              v-for="(station, key) in stationList"
              @click="setStation(station)"
              v-if="((station.type === 1 || station.type === 2) && stationType === 'onStation') || ((station.type === 3 || station.type === 4) && stationType === 'offStation')">
            <i class="station-num"
               v-if="station.type === 1"
               :class="{'station-start': station.type === 1}">起</i>
            <i class="station-num"
               v-if="station.type === 2 || station.type === 3">{{key + 1}}</i>
            <i class="station-num"
               v-if="station.type === 4"
               :class="{'station-end': station.type === 4}">终</i>
            <p class="station-name">{{station.stationName}}</p>
            <p class="statup-time" :class="{'station-green': key === 0 && stationType === 'onStation'}">
              {{(key === 0 && stationType === 'onStation') ? '发车' : '预计'}}
              <em>{{getTime(station.during)}}</em>
              <em class="day"> {{getDay(station.during) > 0 ? '+'+ getDay(station.during) + '天' : ''}}</em>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import markerStart from '../../../../static/pics/marker_start.png'
  import markerEnd from '../../../../static/pics/marker_end.png'
  import { mapState } from 'vuex'
  import qqMap from '../../../utils/qqmap/CreateMap'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        mapObj: '', //地图对象
        productId: '', //产品id
        fromPageRouter: '', //返回界面路由、本地存储key
        stationType: '', //站点类型 onStation, offStation
        stationList: '', //站点信息
        localStationList: '', //站点信息
        stationData: {},
        lineInfo: {},
        startupTime:'',
        productTypeLevelTwo:'',

        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
          zoom:14
        },
        mapRoute:'',
        resetControl:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 35,
            paddingBottom: 35,
            paddingLeft: 35,
            paddingRight: 35
          }
        },

      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity
      })
    },
    mounted () {
      this.productId = this.$route.query.productId
      this.fromPageRouter = this.$route.query.fromPageRouter
      this.stationType = this.$route.query.stationType
      this.startupTime = this.$route.query.startupTime
      this.getStationBusWayStations()
    },
    methods: {
      /**
       * 查询上下车站点信息
       */
      getStationBusWayStations () {
        api.getStationBusWayStations(this.productId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.stationList = data.resultData.wayStations
            this.lineInfo = data.resultData.lineInfo
            for(let i = 0; i < this.stationList.length; i++){
              let point = TOOL.baiduToTencent({
                lat: this.stationList[i].latitude,
                lng: this.stationList[i].longitude
              })

              if(!this.map){
                this.mapConfig.lat = point.lat;
                this.mapConfig.lng = point.lng;
                this.map = new qqMap.createMap(this.container, this.mapConfig)
              }

              let type = 3
              if(this.stationList[i].type === 3 || this.stationList[i].type === 4){
                type = 4
              }
              let pointer = new qqMap.component.Pointer({
                map: this.map,
                lat: point.lat,
                lng: point.lng,
                type: type,
                content: this.stationList[i].stationName
              })
              this.bestView.controls.push(pointer)
            }

            let lineInfo = []
            for(let i = 0; i < this.lineInfo.length; i++) {
              let point = TOOL.baiduToTencent({
                lat: this.lineInfo[i].latitude,
                lng: this.lineInfo[i].longitude
              })
              lineInfo.push(point)
            }
            new qqMap.component.Route({
              map: this.map,
              createType: 'custom',
              path: lineInfo,
              callback: (i, n) => {
                if(!i){
                  this.mapRoute = n
                }
              }
            })
            this.setCenter()
            this._resetControl()
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
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

      getTime(reachTime){
        let time = reachTime * 60 * 1000 + +TOOL.newGetDate({date: this.startupTime, type: 'formatDate'})
        return TOOL.newGetDate({date: time, type: 'time'})
      },

      getDay(reachTime){
        let time = reachTime * 60 * 1000 + +TOOL.newGetDate({date: this.startupTime, type: 'formatDate'})
        let day1 = +TOOL.newGetDate({date: this.startupTime, type: 'day'})
        let day2 = +TOOL.newGetDate({date: time, type: 'day'})
        if(day2 > day1){
          return day2 - day1
        }else if(day2 < day1){
          return day2
        }
      },

      /**
       * 设置站点
       */
      setStation (station) {
        let data = {}
        if (appStorage.get(this.fromPageRouter)) {
          data = JSON.parse(appStorage.get(this.fromPageRouter))
        }
        data.ticketInfo[this.stationType] = station
        appStorage.set(this.fromPageRouter, JSON.stringify(data))
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang="less" scoped>
  .station-name{
    line-height:1.4;
    padding:20px 0 20px;
  }
  .statup-time{
    line-height:1.4;
    color:#2290f9;
    &.station-green{
      color:#56ab71;
    }
    em{
      color:#888;
    }
    .day{
      font-size:24px;
      color:#2290f9;
    }
  }
  .station-start{
    background-image:url("../../../assets/city/station_start.png")!important;
  }
  .station-end{
    background-image:url("../../../assets/city/station_end.png")!important;
  }
</style>
