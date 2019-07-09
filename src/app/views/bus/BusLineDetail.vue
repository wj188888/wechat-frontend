<template>
  <main-box :title="title" :show-more="false">
    <a class="to-line" :class="{'to-map': !isLine}" slot="title" @click="jumpToBusLineDetail"></a>
    <div class="bus-line-info">
      <p class="name">
        <span>{{currentLine.firstLineSegmentName}} - {{currentLine.lastLineSegmentName}}</span>
        <!--<i>{{currentLine.tourType === 0 ? '' : ''}}</i>-->
        <span class="status" v-if="currentLine.status === 0">运营中</span>
        <span class="status" v-if="currentLine.status === 1">已收车</span>
        <span class="status" v-if="currentLine.status === 2">无数据</span>
      </p>
      <p class="time">
        <span>首班：{{currentLine.startFlightTime}}</span><span>
          末班：{{currentLine.finalFlightTime}}</span><span>
          票价：{{currentLine.minPrice === currentLine.maxPrice ? currentLine.minPrice : `${currentLine.minPrice} - ${currentLine.maxPrice}` }}元</span>
      </p>
    </div>
    <div :style="!isLine ? {visibility:'visible'} : {visibility: 'hidden'}" class="suggestmap bus-line-map-box">
      <div :id="mapId" class="mapcontainer"></div>
    </div>
    <div :style="isLine ? {visibility:'visible'} : {visibility: 'hidden'}" class="bus-line-map-box bus-timeline-box scrollingBox">
      <ul class="bus-timeline-list">
        <li class="timeline-item line line-x-b"
            :class="{'active': currentSegmentId === data.id}"
            @click="setCurrentStation(data)"
            v-for="data in (currentLine.lineSegmentDTOs || currentLine.sites)">
          <!--<i class="icon-bus bus-last"></i>-->
          <!--<i class="icon-bus bus-first"></i>-->
          <i class="icon-bus" :class="{'bus-top': !data.arrive && productTypeLevelTwo === 'PUBLIC_URBAN_BUS'}" v-if="data.busLocationDTOs"></i>
          <i class="icon-dot"></i>
          <p class="name">{{data.name}}<span class="mar-l-20" v-if="nearestLineSegmentId === data.id">(离我最近)</span></p>
          
          <!--<p class="tips">不在运营时间</p>-->
          <!--status: 0：距离某站有车，1：等待发车-->
          <ul class="bus-status-list clearfix" v-if="currentSegmentId === data.id && data.busArrialInfoDTOs && data.busArrialInfoDTOs.length">
            <li v-for="busData in data.busArrialInfoDTOs">
              <p class="p1" v-if="busData.status === 0 && busData.arrive">已到站</p>
              <p class="p1" v-if="busData.status === 0 && !busData.arrive" :class="{' time-p1': !busData.arrive}">{{busData.time}}<em>分钟</em>·{{busData.segmentNum}}<em>站</em></p>
              <p class="p2" v-if="busData.status === 0">{{busData.licensePlat}}</p>
              <p class="p1 mar-b-0" v-if="busData.status === 1">等待发车</p>
            </li>
            <!--<li>-->
            <!--<p class="p1 time-p1">18<em>分钟</em>·2<em>站</em></p>-->
            <!--<p class="p2">川A5323</p>-->
            <!--</li>-->
            <!--<li>-->
            <!--<p class="p1 time-p1">18<em>分钟</em>·2<em>站</em></p>-->
            <!--<p class="p2">川A5323</p>-->
            <!--</li>-->
          </ul>
        </li>
        <!--<li class="timeline-item">-->
        <!--<i class="icon-dot"></i>-->
        <!--<p class="name">建设北路三段东站</p>-->
        <!--</li>-->
        <!--<li class="timeline-item active">-->
        <!--<i class="icon-bus"></i>-->
        <!--<i class="icon-dot"></i>-->
        <!--<p class="name">建设北路三段东站 <span class="mar-l-20">(离我最近)</span></p>-->
        <!--<p class="tips">不在运营时间</p>-->
        <!--</li>-->
        <!--<li class="timeline-item active">-->
        <!--<i class="icon-bus"></i>-->
        <!--<i class="icon-dot"></i>-->
        <!--<p class="name">建设北路三段东站 <span class="mar-l-20">(离我最近)</span></p>-->
        <!--<ul class="bus-status-list clearfix">-->
        <!--<li>-->
        <!--<p class="p1">已到站</p>-->
        <!--<p class="p2">川A5323</p>-->
        <!--</li>-->
        <!--<li>-->
        <!--<p class="p1 time-p1">18<em>分钟</em>·2<em>站</em></p>-->
        <!--<p class="p2">川A5323</p>-->
        <!--</li>-->
        <!--<li>-->
        <!--<p class="p1 time-p1">18<em>分钟</em>·2<em>站</em></p>-->
        <!--<p class="p2">川A5323</p>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</li>-->
        <!--<li class="timeline-item">-->
        <!--<i class="icon-bus bus-last"></i>-->
        <!--<i class="icon-dot"></i>-->
        <!--<p class="name">建设北路三段东站</p>-->
        <!--</li>-->
      </ul>
    </div>
    <template slot="footer">
      <div class="abs-btn-box">
        <div class="fresh" @click="freshLine">
          <p><i class="icon-fresh"></i>刷新</p>
        </div>
        <div class="change" @click="changeLine" v-if="currentLine.tourType === 0">
          <p><i class="icon-change"></i>换向</p>
        </div>
      </div>
    </template>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import qqMap from 'utils/qqmap/CreateMap'
  import { mapState } from 'vuex'
  
  let timestamp = 10000
  
  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        mapId: "suggestmap",
        map: '',
        resetControl:'',
        probeControl: '',
        user:'',
        stations: [],
        mapRoute: [],
        currentBus:'',
        buses: {},
        guideLayer:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 10,
            paddingBottom: 160,
            paddingLeft: 50,
            paddingRight: 50
          }
        },
        mapCenter: {
          lat: 35.960223,
          lng: 114.257813
        },
  
        lineId: '',
        lineSegmentId: '',
        nearestLineSegmentId: '',
        nearestLineSegmentName:'',
        currentSegmentId: '',
        currentLat: '',
        currentLon: '',
        direct: '',
        currentLine:'',
        timer1: '',
        timer2: '',
        isLine: true,
  
        locationTimerStatus: '',
        locationTimer: false,
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
    },
    mounted () {
      this.initialize()
    },
    destroyed () {
      this.clearTimer()
    },
    methods: {
      initialize () {
        this.initMap()
        this._addResetControl()
        this.lineId = this.$route.query.lineId
        this.nearestLineSegmentId = this.$route.query.nearestLineSegmentId
        this.currentSegmentId = this.nearestLineSegmentId
        this.currentLon = this.$route.query.currentLon
        this.currentLat = this.$route.query.currentLat
        this.direct = this.$route.query.direct
        this.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
        if(this.currentLon && this.currentLat){
          this._addUser(this.currentLat, this.currentLon)
        }
        this.publicBusLineFindDetail()
      },
      
      clearTimer () {
        clearTimeout(this.timer1)
        clearTimeout(this.timer2)
        clearTimeout(this.locationTimer)
      },
      
      initMap () {
        if(this.map) return
        this.map = new qqMap.createMap(this.mapId, {
          lat: this.mapCenter.lat,
          lng: this.mapCenter.lng,
          zoom: 4
        })
      },
      
      _addUser (lat, lng) {
        if(!this.user){
          this.user = new qqMap.component.User({
            map: this.map,
            type: 0,
            geo: false,
            lat: lat,
            lng: lng
          });
        }
        this.bestView.controls.push(this.user)
        this.freshUserLocation()
        this.$store.watch((state) => {
          return state.city.appAddress;
        }, (newVal, oldVal) => {
          if(this.locationTimerStatus){
            this.currentLat = newVal.position.lat
            this.currentLon = newVal.position.lng
            this.user.setPosition({lat: newVal.position.lat, lng: newVal.position.lng})
          }
        }, {deep: true});
      },
  
      /**
       * 刷新地图用户图标
       */
      freshUserLocation () {
        this.locationTimerStatus = true
        this.locationTimer = setInterval(()=>{
          this.$store.dispatch('gaodeLocation');
        }, 10000)
      },
      
      _addResetControl () {
        if(this.resetControl){
          return
        }
        let margin = '0 0 1rem 1rem'
        if(TOOL.browser().iPhone){
          margin = '0 0 1rem 1rem'
        }
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          position:'RIGHT_BOTTOM',
          margin: margin,
          left: 0,
          clickHandler: () => {
            this.setBestView()
          }
        })
      },
      
      freshLine () {
        this.refreshDetailBus('fresh')
      },
      
      changeLine () {
        if(this.direct === 'OUT'){
          this.direct = 'BACK'
        }else{
          this.direct = 'OUT'
        }
        this.deleteAllCars()
        this.publicBusLineFindDetail()
      },
  
      tanspoint (address) {
        return TOOL.tencentToBaidu({
          lat: address.lat,
          lng: address.lng,
        })
      },
  
      /**
       * 查看当前站点情况
       * @param data
       */
      setCurrentStation (data) {
        this.lineSegmentId = data.id
        this.findSegmentNearBusLocation()
      },
      
      publicBusLineFindDetail () {
        let point = this.tanspoint({lat:this.currentLat, lng:this.currentLon})
        api.publicBusLineFindDetail(this.lineId, {
          currentLat: point.lat,
          currentLon: point.lng,
          direct: this.direct,
          productTypeLevelTwo: this.productTypeLevelTwo
        }).then(res=>{
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            if(data.resultData.nearestLineSegmentId){
              this.nearestLineSegmentId = data.resultData.nearestLineSegmentId
              this.currentSegmentId = this.nearestLineSegmentId
            }
            this.currentLine = data.resultData
            this.title = this.currentLine.lineName
            this.refreshDetailBus()
            this.findMapDetail()
          }
        })
      },
  
      refreshDetailBus (type) {
        if(!this.currentLat) return
        clearTimeout(this.timer1)
        let point = this.tanspoint({lat: this.currentLat, lng: this.currentLon})
        api.refreshDetailBus(this.lineId, {
          currentLat: point.lat,
          currentLon: point.lng,
          direct: this.direct,
          productTypeLevelTwo: this.productTypeLevelTwo
        }).then(res=> {
          const data = TOOL.toJson(res.data);
          if (data.resultCode === '0') {
            if(type === 'fresh'){
              this.$store.dispatch('showError', '刷新成功');
              this.currentSegmentId = this.nearestLineSegmentId
            }
            if(type === 'changeStation'){
              this.currentLine = Object.assign({}, this.currentLine, {
                busLocationDTOs: data.resultData.busLocations
              })
            }else{
              this.currentLine = Object.assign({}, this.currentLine, {
                busLocationDTOs: data.resultData.busLocations,
                busArrialInfoDTOs: data.resultData.busArrialInfo,
              })
            }
            
            this.renderBus()
            this.timer1 = setTimeout(()=>{
              this.refreshDetailBus()
            }, timestamp)
          }
        })
      },
  
      renderBus () {
        let sitesName = 'lineSegmentDTOs'
        if(this.productTypeLevelTwo === 'PUBLIC_URBAN_BUS'){
          sitesName = 'sites'
        }
        for(let i in this.currentLine[sitesName]){
          //线路上在跑得车
          let tag1 = false
          for(let j in this.currentLine.busLocationDTOs){
            if(this.currentLine[sitesName][i].id === this.currentLine.busLocationDTOs[j].lineSegmentId){
              this.currentLine[sitesName][i].busLocationDTOs = this.currentLine.busLocationDTOs[j]
              tag1 = true
            }
          }
          if(!tag1){
            this.currentLine[sitesName][i].busLocationDTOs = null
          }
      
          //离我最近的三班车
          let tag2 = false
          for(let j in this.currentLine.busArrialInfoDTOs){
            if(this.currentLine[sitesName][i].id === this.currentLine.busArrialInfoDTOs[j].lineSegmentId){
              this.currentLine[sitesName][i].busArrialInfoDTOs = this.currentLine.busArrialInfoDTOs
              tag2 = true
            }
          }
          if(!tag2){
            this.currentLine[sitesName][i].busArrialInfoDTOs = []
          }
        }
      },
  
      findSegmentNearBusLocation () {
        api.findSegmentNearBusLocation(this.lineId, {
          lineSegmentId: this.lineSegmentId,
          direct: this.direct,
          productTypeLevelTwo: this.productTypeLevelTwo
        }).then(res=> {
          const data = TOOL.toJson(res.data);
          if (data.resultCode === '0') {
            this.currentLine = Object.assign({}, this.currentLine, {busArrialInfoDTOs:data.resultData})
            this.currentSegmentId = this.lineSegmentId
            this.refreshDetailBus('changeStation')
          }
        })
      },
      
      findMapDetail () {
        this.resetMap()
        let point = this.tanspoint({lat: this.currentLat, lng: this.currentLon})
        api.findMapDetail(this.lineId, {
          nearestLineSegmentId: this.nearestLineSegmentId,
          currentLat: point.lat,
          currentLon: point.lng,
          direct: this.direct,
          productTypeLevelTwo: this.productTypeLevelTwo,
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.nearestLineSegmentName = data.resultData.nearestLineSegmentName
            if(this.productTypeLevelTwo === 'PUBLIC_URBAN_BUS'){
              this.urbanStationMapRender(data.resultData)
            }else{
              this.countyStationMapRender(data.resultData)
            }
            
            // 添加车
            let busLoctionDTOs = data.resultData.busLoctionDTOs
            let busArrialInfoDTO = data.resultData.busArrialInfoDTO
            if(busLoctionDTOs){
              this.deleteAllCars()
              for (let i = 0; i < busLoctionDTOs.length; i++) {
                let bus = busLoctionDTOs[i]
                let point = TOOL.baiduToTencent({
                  lat: bus.latitude,
                  lng: bus.longitude
                })
                //当前车辆
                if(busArrialInfoDTO && bus.carId === busArrialInfoDTO.carId){
                  this.buses[bus.carId] = this._addCar(point, bus.direct)
                  console.log(this.buses)
                  this.setBusTips(this.buses[bus.carId], busArrialInfoDTO)
                  this.bestView.controls.push(this.buses[bus.carId])
                }else{
                  this.buses[bus.carId] = this._addCar(point, bus.direct)
                  this.buses[bus.carId].hideTip()
                }
              }
            }
       
            this.setBestView()
            this.refreshMapBus()
          }
        })
      },
  
      /**
       * 初始化车前清除所有已有的车
       */
      deleteAllCars () {
        console.log(this.buses)
        for(let j in this.buses){
          this.buses[j].remove()
        }
      },
      
      /**
       * 城乡公交添加路线、站点及站点名称
       * @param data
       */
      urbanStationMapRender (data) {
        let points = data.points;
        let pointsLen = points.length;
        let paths = []
        for(let i = 0; i < pointsLen; i ++ ) {
          let point = TOOL.baiduToTencent({
            lat: points[i][1],
            lng: points[i][0]
          })
          paths.push(point)
        }
        this.mapRoute.push(this._addRoute(paths))
    
        let sites = data.sites
        let siteLen = sites.length
        for(let i = 0; i < siteLen; i ++ ) {
          let point = TOOL.baiduToTencent({
            lat: sites[i].point[1],
            lng: sites[i].point[0]
          })
          if(sites[i].id === this.currentSegmentId){
            let station = this._addStation(point, sites[i].name, 7)
            this.stations.push(station)
            setTimeout(()=>{
              this.guideLayer = this._addGuideLayer(point)
            })
            this.bestView.controls.push(station)
          }else{
            let type = 6
            if(i === 0){
              type = 10
            }else if(i === siteLen - 1){
              type = 11
            }
            this.stations.push(this._addStation(point, sites[i].name, type))
          }
        }
        if(!this.bestView.controls.length){
          this.bestView.controls = this.bestView.controls.concat(this.stations)
        }
      },
  
      /**
       * 城乡公交添加路线、站点及站点名称
       * @param data
       */
      countyStationMapRender (data) {
        let publicBusLineSegments = data.publicBusLineSegments || []
        let lineSegmentsLen = publicBusLineSegments.length
        //最近站点
        for(let i = 0; i < lineSegmentsLen; i ++ ){
          let linePoints = publicBusLineSegments[i].linePoints
          let paths = []
          for (let j = 0; j < linePoints.length; j++) {
            let point = TOOL.baiduToTencent({
              lat: linePoints[j].latitude,
              lng: linePoints[j].longitude
            })
            paths.push(point)
          }
          this.mapRoute.push(this._addRoute(paths))
    
          //最近站点
          if(publicBusLineSegments[i].id === this.currentSegmentId){
            let nearPoint = TOOL.baiduToTencent({
              lat: data.nearestLatitude,
              lng: data.nearestLongitude
            })
            let station = this._addStation(paths[0], publicBusLineSegments[i].name, 7)
            this.stations.push(station)
            setTimeout(()=>{
              this.guideLayer = this._addGuideLayer(nearPoint)
            })
            this.bestView.controls.push(station)
          }else{
            let last = lineSegmentsLen - 1
            let type = 6
            if(i === 0){
              type = 10
            }else if(i === last){
              type = 11
            }
            if(i !== last){
              this.stations.push(this._addStation(paths[0], publicBusLineSegments[i].name, type))
            }else{
              this.stations.push(this._addStation(paths[paths.length - 1], publicBusLineSegments[i].name, type))
            }
            
          }
        }
//        this.bestView.controls = [].concat(this.stations)
      },
  
      refreshMapBus () {
        let point = this.tanspoint({
          lat: this.currentLat,
          lng: this.currentLon
        })
        clearTimeout(this.timer2)
        api.refreshMapBus(this.currentLine.lineId, {
          currentLat: point.lat,
          currentLon: point.lng,
          direct: this.direct,
          productTypeLevelTwo: this.productTypeLevelTwo,
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            let busArrialInfoDTO = data.resultData.busArrialInfo
            let busLoctionDTOs = data.resultData.busLocations
            if(busLoctionDTOs){
              for(let i = 0; i < busLoctionDTOs.length; i++){
                let bus = busLoctionDTOs[i]
                let point = TOOL.baiduToTencent({
                  lat: bus.latitude,
                  lng: bus.longitude
                })
                if(this.buses[bus.carId]){
                  //当前车辆
                  if(bus.carId === busArrialInfoDTO.carId){
                    this.buses[bus.carId].drive({lat: point.lat, lng: point.lng})
                    this.setBusTips(this.buses[bus.carId], busArrialInfoDTO)
                  }else{
                    this.buses[bus.carId].drive({lat: point.lat, lng: point.lng})
                    this.buses[bus.carId].hideTip()
                  }
                }else{
                  //当前车辆
                  if(busArrialInfoDTO && bus.carId === busArrialInfoDTO.carId){
                    this.buses[bus.carId] = this._addCar(point, bus.direct)
                    this.setBusTips(this.buses[bus.carId], busArrialInfoDTO)
                    this.bestView.controls.push(this.buses[bus.carId])
                  }else{
                    this.buses[bus.carId] = this._addCar(point, bus.direct)
                    this.buses[bus.carId].hideTip()
                  }
                }
              }
         
              for(let j in this.buses){
                let hasThisCar = false
                for(let i = 0; i < busLoctionDTOs.length; i++){
                  if(busLoctionDTOs[i].carId === j){
                    hasThisCar = true
                    break;
                  }
                }
                //                console.log(hasThisCar)
                if(!hasThisCar){
                  this.buses[j].remove()
                }
              }
            }
    
            this.timer2 = setTimeout(()=>{
              this.refreshMapBus()
            }, timestamp)
    
          }
        })
      },
  
      setBusTips (bus, busArrialInfoDTO) {
        let carTime
        if(busArrialInfoDTO.status === 0){
          carTime = busArrialInfoDTO.time === 0 ? '已到达' : busArrialInfoDTO.time + '分钟'
        }else if(busArrialInfoDTO.status === 1){
          carTime = '已到达'
        }
        bus.showTip(`<p class="car-time">${carTime}<i></i></p><p class="car-p">抵达${this.nearestLineSegmentName}</p>`)
      },
      
      setMapCenter (lat, lng, zoom) {
        this.mapCenter = {lat: lat, lng: lng}
        if(this.map){
          this.map.setZoom(zoom || 16)
          this.map.baseMap.panTo(new qq.maps.LatLng(lat, lng))
        }
      },
  
      setBestView () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },
      
      resetMap () {
        if(this.mapRoute.length){
          for(let i = 0; i < this.mapRoute.length; i++){
            this.mapRoute[i].remove()
          }
        }
        if(this.stations.length){
          for(let i = 0; i < this.stations.length; i++){
            this.stations[i].remove()
          }
        }
        if(this.buses.length){
          for(let i = 0; i < this.buses.length; i++){
            this.buses[i].remove()
          }
        }
        if(this.currentBus){
          this.currentBus.remove()
        }
        if(this.probeControl){
          this.probeControl.remove()
        }
        if(this.guideLayer){
          this.guideLayer.remove()
        }
        this.mapRoute = []
        this.stations = []
        this.buses = {}
        this.currentBus = ''
        this.guideLayer = ''
        this.probeControl = ''
        this.bestView.controls = []
      },
  
      _addRoute (paths) {
        return new qqMap.component.Route({
          map: this.map,
          createType: 'custom',
          path: paths,
          outlineColor: '#FC924C',
          lineColor: '#FC924C',
          callback: (i, n) => {
            if(!i){
              //                    this.mapRoute = n
            }
          }
        })
      },
  
      _addGuideLayer (endPoints) {
        return new qqMap.vector.GuideLayer({
          map: this.map,
          path: [this.user.getPosition(), endPoints],
          callback: (i, n) => {
            if(!i){
              //                      this.mapRoute = n
            }
          }
        })
      },
      
      _addStation (point, name, type) {
        return new qqMap.component.Station({
          map: this.map,
          lat: point.lat,
          lng: point.lng,
          type: type || 6,
          content: name,
          clickHandler: () => {
            //                    this.addStartPointer(sites[i])
          }
        })
      },
  
      _addCar (point, angle) {
        let ag = typeof angle === 'number' ? angle : 109;
        return new qqMap.vector.CarLayer({
          map: this.map,
          type: 274,
          angle: ag,
          lat: point.lat,
          lng: point.lng,
        })
      },
      
      jumpToBusLineDetail () {
        this.isLine = !this.isLine
        if(!this.isLine){
          this.title = '线路地图'
        }else{
          this.title = '线路详情'
        }
      }
      
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .suggestmap{
    .mapcontainer {
      width: 100%;
      height: 100%;
      .csssprite{
        display:none!important;
      }
      div[draggable="false"][onresize="return;"]{
        display:none!important;
      }
    }
    .map-background {
      background:url("../../../assets/tag/32.png") repeat 0 0 #e5e3df;
    }
  }
  .to-line{
    position: absolute;
    right: 0;
    top: 0;
    width: 90px;
    height: 86px;
    background: url("../../../assets/bus/to_map.png") no-repeat 28px center;
    background-size: 40px 40px;
    &.to-map{
      background: url("../../../assets/bus/to_line.png") no-repeat 28px center;
      background-size: 40px 40px;
      
    }
  }
  .bus-line-info{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height:136px;
    padding:30px 20px;
    background:#fff;
    box-shadow: 0 0 0 transparent, 0 2PX 3PX #ccc, 0 0 0 transparent, 0 0 0 transparent;
    z-index:10;
    .name{
      margin-bottom:20px;
      font-size:28px;
      color:#121212;
      i{
        display: inline-block;
        margin-left:10px;
        padding:4px 6px;
        border:1PX solid #ff6600;
        font-size:18px;
        color:#ff6600;
        border-radius:8px;
      }
      .status{
        margin-left:20px;
        font-size:24px;
        color:#888;
      }
    }
    .time{
      font-size:24px;
      color:#888;
      span{
        margin-right:30px;
      }
    }
  }
  .bus-line-map-box{
    position: absolute;
    width: 100%;
    top:136px;
    bottom:100px;
    background:#fff;
    &.bus-timeline-box{
      padding-left:98px;
      overflow: auto;
    }
  }
  .bus-timeline-list{
    min-height:100%;
    border-left:1PX solid #ffd1b2;
    .timeline-item{
      position: relative;
      padding-left:33px;
      padding-right:20px;
      font-size:26px;
      color:#4c4c4c;
      .icon-bus{
        position:absolute;
        left:-73px;
        top:20px;
        width:38px;
        height:38px;
        background:url("../../../assets/bus/bus.png") no-repeat center center;
        background-size:38px 38px;
        &.bus-top{
          top: 50%;
          margin-top:1rem;
        }
      }
      .icon-first{
        background-image:url("../../../assets/bus/bus_first.png");
      }
      .icon-last{
        background-image:url("../../../assets/bus/bus_last.png");
      }
      .icon-dot{
        position: absolute;
        left:-13px;
        top:30px;
        width:26px;
        height:26px;
        background:url("../../../assets/bus/bus_station.png") no-repeat center center;
        background-size:26px 26px;
      }
      .name{
        padding:30px 0;
        span{
          color: #2290f9;
        }
      }
      &.active{
        background:#edf4fa;
        color: #2290f9;
        .tips{
          padding:6px 0 50px;
          font-size:24px;
        }
        .icon-dot{
          top:28px;
          left: -16px;
          width:34px;
          height:34px;
          background:url("../../../assets/bus/bus_station_current.png") no-repeat center center;
          background-size:34px 34px;
        }
        .bus-status-list{
          padding:0 0 30px;
          li{
            float:left;
            padding:20px;
            margin-right:20px;
            margin-bottom:20px;
            background:#fff;
            text-align: center;
          }
          .p1{
            height:28px;
            margin-bottom:20px;
            font-size:28px;
            color:#4c4c4c;
          }
          .time-p1{
            font-size:32px;
            em{
              font-size:24px;
            }
          }
          .p2{
            font-size:22px;
            color:#2290f9;
          }
        }
      }
    }
  }
  
  .abs-btn-box{
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    z-index: 200;
    background-color: #fff;
    box-shadow: 0 -1px 10px #ccc;
    overflow: hidden;
  }
  .fresh,
  .change{
    flex:1;
    padding:20px;
    p{
      height:60px;
      line-height:60px;
      font-size:28px;
      color:#888;
      text-align: center;
    }
    i{
      display: inline-block;
      width:24px;
      height:100%;
      margin-right: 40px;
      background:url("../../../assets/bus/change.png") no-repeat center center;
      background-size: 24px 34px;
      vertical-align: middle;
    }
  }
  .change{
    p{
      border-left:1PX solid #e5e5e5;
    }
  }
  .fresh{
    i{
      position: relative;
      top:-4px;
      width:28px;
      height:100%;
      background:url("../../../assets/bus/fresh.png") no-repeat center center;
      background-size: 28px 30px;
    }
  }
</style>