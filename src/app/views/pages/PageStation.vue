<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="container-map bg-gray">
      <div class="box-map">
        <div class="map-container map-box" id="container"></div>
      </div>
      <div class="box-station">
        <ul class="station-list">
          <li class="line line-x-b" v-if="fromPageRouter === 'carpoolingSelf'" @click="jumpToBdStation">
            <i class="station-add"></i>
            <span>添加新的位置</span>
          </li>
          <li class="line line-x-b" v-for="(station, key) in stationList" @click="setStation(station)">
            <i class="station-num"
               :class="{'station-start': key === 0}"
               v-if="(fromPageRouter === 'busDetail' || fromPageRouter === 'schoolBusExpress' || fromPageRouter === 'scenicBusExpress') &&　stationType === 'onStation'">
              {{key === 0 ? '起' : key + 1}}
            </i>
            <i class="station-num"
               :class="{'station-end': key === stationList.length - 1}"
               v-if="(fromPageRouter === 'busDetail' || fromPageRouter === 'schoolBusExpress' || fromPageRouter === 'scenicBusExpress') &&　stationType === 'offStation'">
              {{key === stationList.length - 1 ? '终' : key + 1}}
            </i>
            <i class="station-num" v-if="fromPageRouter !== 'busDetail' || fromPageRouter === 'schoolBusExpress' || fromPageRouter === 'scenicBusExpress'">{{key + 1}}</i>
            <span>{{station.name}}</span>
            <p class="statup-time"
               :class="{'station-green': key === 0 && stationType === 'onStation'}"
               v-if="(fromPageRouter === 'busDetail' || fromPageRouter === 'schoolBusExpress' || fromPageRouter === 'scenicBusExpress') && station.reachTime">
              {{(key === 0 && stationType === 'onStation') ? '发车' : '预计'}}
              <em>{{getTime(station.reachTime)}}</em>
              <em class="day"> {{getDay(station.reachTime) > 0 ? '+'+ getDay(station.reachTime) + '天' : ''}}</em>
            </p>
          </li>
        </ul>
        <ul class="station-list local-station-list" v-if="fromPageRouter === 'carpoolingSelf' && localStationList">
          <li class="local-address line line-x-b">历史地址</li>
          <li class="line line-x-b" v-for="(station, key) in localStationList" @click="setStation(station)">
            <i class="icon-station-local"></i>
            <span v-text="station.name"></span>
          </li>
        </ul>
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
        mapObj: '', //地图对象
        skuId: '', //产品id
        fromPageRouter: '', //返回界面路由、本地存储key
        stationType: '', //站点类型 onStation, offStation
        stationList: '', //站点信息
        localStationList: '', //站点信息
        stationData: {},
        startupTime:'',
        productTypeLevelOne:'',
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
    mounted () {
      this.skuId = this.$route.query.skuId
      this.fromPageRouter = this.$route.query.fromPageRouter
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
      this.stationType = this.$route.query.stationType
      this.startupTime = this.$route.query.startupTime
      this.getStationById()
    },
    methods: {
      /**
       * 查询上下车站点信息
       */
      getStationById () {
        this.$store.commit('UPDATE_LOADING', true)
        let resource;
        switch (this.fromPageRouter) {
          case 'busDetail':
            resource = api.citySkuGetStationById(this.skuId)
            break;
          case 'scenicBusExpress':
            resource = api.scenicSkuGetStationById(this.skuId)
            break;
          case 'schoolBusExpress':
            resource = api.schoolSkuGetStationById(this.skuId)
            break;
          case 'airportTicket':
            resource = api.airportSkuGetStationById(this.skuId)
            break;
          case 'trainstationTicket':
            resource = api.trainStationSkuGetStationById(this.skuId)
            break;
          case 'carpooling':
          case 'carpoolingSelf':
          case 'carpoolingJoin':
            resource = api.lineProductFindStations(this.skuId)
            break;
          case 'scoreBusExpress':
            resource = api.integralExchangeGetStation(this.skuId, this.productTypeLevelOne)
            break;
        }

        resource.then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.$store.commit('UPDATE_LOADING', false)
            this.stationList = data.resultData[this.stationType + 'List']
            if (this.fromPageRouter === 'carpoolingSelf') {
              this.stationData = data.resultData
              let localData = {}
              if (appStorage.get('carpoolingSelfStation')) {
                localData = JSON.parse(appStorage.get('carpoolingSelfStation'))
              }
              if (localData[this.stationType]) {
                this.localStationList = localData[this.stationType]
              }
            }

            let len = this.stationList.length
            for(let i = 0; i < len; i++){
              let point = TOOL.baiduToTencent({
                lat: this.stationList[i].latitude,
                lng: this.stationList[i].longitude
              })

              if(!this.map){
                this.mapConfig.lat = point.lat;
                this.mapConfig.lng = point.lng;
                this.map = new qqMap.createMap(this.container, this.mapConfig)
              }

              let type = 5
              if(this.stationType === 'offStation'){
                type = 6
              }

              let stationNum;
              if(this.stationType === 'onStation' && i !== 0){
                type = 9
                stationNum = i + 1
              }else if(this.stationType === 'offStation' && i !== (len - 1)){
                type = 9
                stationNum = i + 1
              }

              let pointer = new qqMap.component.Pointer({
                map: this.map,
                lat: point.lat,
                lng: point.lng,
                type: type,
                stationNum: stationNum,
                content: this.stationList[i].stationName
              })
              this.bestView.controls.push(pointer)
            }
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
       * 跳转百度地图选择
       */
      jumpToBdStation () {
        appStorage.remove('CURRENTCITY')
        let addressCity
        if (this.fromPageRouter === 'carpoolingSelf') {
          if (this.stationType === 'onStation') {
            addressCity = this.stationData.aAddress.city
          } else {
            addressCity = this.stationData.bAddress.city
          }
        }
        this.$router.push({
          name: 'bdStation',
          query: {
            fromPage: this.fromPageRouter,
            dataKey: this.stationType,
            addressCity: addressCity
          }
        })
      },

      /**
       * 设置站点
       */
      setStation (station) {
        let data = {}
        if (appStorage.get(this.fromPageRouter)) {
          data = JSON.parse(appStorage.get(this.fromPageRouter))
        }
        let stationPages = [
          'carpooling',
          'carpoolingSelf',
          'carpoolingJoin',
          'busDetail',
          'scenicBusExpress',
          'schoolBusExpress',
          'airportTicket',
          'trainstationTicket',
          'scoreBusExpress'
        ]
        if (stationPages.indexOf(this.fromPageRouter) > -1) {
          data[this.stationType] = station
        } else {
          data[this.stationType] = station.name
        }
        appStorage.set(this.fromPageRouter, JSON.stringify(data))
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang="less" scoped>
  .statup-time{
    position:absolute;
    top:0;
    right:20px;
    height:120px;
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
    background-image:url("../../../assets/station_start.png")!important;
  }
  .station-end{
    background-image:url("../../../assets/station_end.png")!important;
  }
</style>
