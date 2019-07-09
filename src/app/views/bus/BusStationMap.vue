<template>
  <main-box :title="title" :show-more="false">
    <div class="flex-box">
      <div :id="mapId" class="mapcontainer bus-line-map"></div>
    </div>
    
    <div slot="footer">
      <!--创建产品-->
      <div class="station-abs" :class="{'to-top': isShowLineDetail}" v-if="lineId">
        <div class="station-item" @click="upAndDownLineDetail">
          <div class="bus-line-box">
            <div class="more-lines">
              <p class="bus-item">
                <i class="icon-bus"></i>
                <span class="name">{{lineData.lineName}}</span>
                <i class="line-urban" :class="{'line-county': productTypeLevelTwo === 'PUBLIC_COUNTRYSIDE_BUS'}"></i>
              </p>
            </div>
          </div>
          <p class="address">{{lineData.aLineSegmentName}}上车·需<span v-if="hour != 0">{{hour}}小时</span><span v-if="minute">{{minute}}分钟</span>·步行{{warkMeter | formatMeter}}</p>
        </div>
        
        <div class="bus-station-list-box line line-x-t scrollingBox" ref="stationList" v-show="isShowLineDetail">
          <ul class="bus-staiton-list">
            <li class="start-walk">
              <i class="dot start-dot"></i>
              <p class="name">{{localData.from.name}}<em>(起点)</em></p>
              <p class="walk">步行{{aDistance | formatMeter}}</p>
            </li>
          </ul>
          <ul class="bus-staiton-list"
          :class="{'urban-list': productTypeLevelTwo === 'PUBLIC_URBAN_BUS', 'county-list':productTypeLevelTwo === 'PUBLIC_COUNTRYSIDE_BUS'}">
            <li class="station"
                :class="{'middle-station': index && index !== sitesDataLen - 1}"
                v-for="(data, index) in sitesData">
              <i class="station-dot"></i>
              <p class="name">
                <span>{{data}}</span>
                <em v-if="index === 0">上车</em>
                <em v-if="index && index === sitesDataLen - 1">下车</em>
              </p>
              <p class="p1" v-if="index === 0"><i>{{lineData.lineName}}</i>开往{{terminal}}站</p>
              <p class="p2" v-if="index === 0">首班{{lineData.startFlightTime}} 末班{{lineData.finalFlightTime}}</p>
            </li>
          </ul>
          <ul class="bus-staiton-list">
            <li class="end-walk">
              <i class="dot end-dot"></i>
              <p class="walk">步行{{bDistance | formatMeter}}</p>
              <P class="name">{{localData.to.name}}<em>(终点)</em></P>
            </li>
          </ul>
        </div>
      </div>
  
      <!--高德换乘-->
      <div class="station-abs" :class="{'to-top': isShowLineDetail}" v-if="!lineId && transferPlan.segments.length">
        <div class="station-item" @click="upAndDownLineDetail">
          <div class="bus-line-box"
               v-for="(segment, index) in transferPlan.segments"
               :class="{'more': index !== 0}"
               v-if="segment.transit_mode === 'BUS' || segment.transit_mode === 'SUBWAY'">
            <div class="more-lines">
              <div class="bus-item">
                <i class="icon-bus" :class="{'icon-subway': segment.transit_mode === 'SUBWAY'}"></i>
                <span class="name" v-for="(line, i) in segment.transit.lines">
                  <em v-if="i !== 0">/</em>
                  {{line.name | formatBusName}}
                </span>
                <i class="line-urban" :class="{'line-subway': segment.transit_mode === 'SUBWAY'}"></i>
              </div>
              <!--<span class="more-line-text" v-if="i !== segment.transit.lines.length - 1">或</span>-->
            </div>
          </div>
          <p class="address">{{transferPlan.firstStationName}}上车·需<span>{{transferPlan.time | formatViewTime('s')}}</span>·步行{{transferPlan.walking_distance | formatMeter}}</p>
        </div>
        
        <div class="bus-station-list-box line line-x-t scrollingBox" ref="stationList" v-show="isShowLineDetail">
          <ul class="bus-staiton-list">
            <li class="start-walk">
              <i class="dot start-dot"></i>
              <p class="name">{{localData.from.name}}<em>(起点)</em></p>
              <p class="walk">步行{{transferPlan.segments[0].distance | formatMeter}}</p>
            </li>
          </ul>
          <ul class="bus-staiton-list"
              v-for="(segment, index) in transferPlan.segments"
              :class="{'urban-list': segment.transit_mode === 'BUS', 'subway-list':segment.transit_mode === 'SUBWAY'}">
            
            <li class="start-walk pad-t-20" v-if="segment.transit_mode === 'WALK' && index !== 0 && index !== transferPlan.segments.length - 1">
              <p class="walk">步行{{segment.distance | formatMeter}}</p>
            </li>
            
            <li class="station" v-if="segment.transit_mode === 'BUS' || segment.transit_mode === 'SUBWAY'">
              <i class="station-dot"></i>
              <p class="name">
                <span>{{segment.transit.on_station.name}}</span>
                <em v-if="segment.transit.entrance">{{segment.transit.entrance.name}}</em>
                <em v-else>上车</em>
              </p>
              <p class="p1 clearfix" @click="showCurrentStation(segment, index)">
                <i>{{segment.transit.lines[0].name | formatBusName}}</i>开往{{getTerminalName(segment.transit.lines[0].name)}}
                <span class="station-num"
                      v-if="segment.transit.via_num"
                      :class="{'pull-down': segment.showMiddleStation}">
                {{`${segment.transit.via_num}站`}}
                </span>
              </p>
              <p class="p2" v-if="typeof segment.transit.lines[0].stime === 'string'">
                首班{{segment.transit.lines[0].stime | splitTime}} 末班{{segment.transit.lines[0].etime | splitTime}}
              </p>
            </li>
  
            <li class="station middle-station"
                v-for="(stops, i) in segment.transit.via_stops"
                v-if="(segment.transit_mode === 'BUS' || segment.transit_mode === 'SUBWAY') && segment.showMiddleStation">
              <i class="station-dot"></i>
              <p class="name">
                <span>{{stops.name}}</span>
              </p>
            </li>
            
            <li class="station" v-if="segment.transit_mode === 'BUS' || segment.transit_mode === 'SUBWAY'">
              <i class="station-dot"></i>
              <p class="name">
                <span>{{segment.transit.off_station.name}}</span>
                <em v-if="segment.transit.exit">{{segment.transit.exit.name}}</em>
                <em v-else>下车</em>
              </p>
            </li>
            
          </ul>
          <ul class="bus-staiton-list">
            <li class="end-walk">
              <i class="dot end-dot"></i>
              <p class="walk">步行{{transferPlan.segments[transferPlan.segments.length - 1].distance | formatMeter}}</p>
              <P class="name">{{localData.to.name}}<em>(终点)</em></P>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import qqMap from 'utils/qqmap/CreateMap'
  
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
        stations: [],
        mapRoute: [],
        resetControl:'',
        startPointer: '',
        endPointer: '',
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
        
        lineId:'',
        direct:'',
        hour:'',
        minute:'',
        warkMeter:'',
        aDistance:'',
        bDistance:'',
        aLineSegmentId:'',
        bLineSegmentId:'',
        productTypeLevelTwo:'',
        lineData:'',
        isShowLineDetail:false,
        localData:{
          from:{},
          to:{}
        },
        transferPlan:{
          segments:[],
        }
      }
    },
    computed:{
      sitesData () {
        if(this.lineData.lineSegmentNames){
          return this.lineData.lineSegmentNames
        }else if(this.lineData.sites){
          return this.lineData.sites
        }else{
          return []
        }
      },
      sitesDataLen () {
        return this.sitesData.length
      },
      terminal () {
        return this.sitesData[this.sitesDataLen - 1]
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.initMap()
        this.lineId = this.$route.query.lineId
        this.direct = this.$route.query.direct
        this.hour = this.$route.query.hour
        this.minute = this.$route.query.minute
        this.warkMeter = this.$route.query.warkMeter
        this.aDistance = this.$route.query.aDistance
        this.bDistance = this.$route.query.bDistance
        this.aLineSegmentId = this.$route.query.aLineSegmentId
        this.bLineSegmentId = this.$route.query.bLineSegmentId
        this.productTypeLevelTwo = this.$route.query.productTypeLevelTwo
        
        if(appStorage.get('busIndex')){
          let localData = JSON.parse(appStorage.get('busIndex'))
          this.localData = Object.assign(this.localData, localData)
        }
        if(this.lineId){
          this.findBusRoutPlanInfo()
        }else{
          if(appStorage.get('transferPlan')){
            this.transferPlan = JSON.parse(appStorage.get('transferPlan'))
            this.renderTransferMap()
          }else{
            this.goback()
          }
        }
      },
  
      upAndDownLineDetail () {
        this.isShowLineDetail = !this.isShowLineDetail
      },
      
      initMap () {
        if(this.map) return
        this.map = new qqMap.createMap(this.mapId, {
          lat: this.mapCenter.lat,
          lng: this.mapCenter.lng,
          zoom: 4
        })
        this._addResetControl()
      },
  
      _addResetControl () {
        if(this.resetControl){
          return
        }
        let margin = '0 0 8.5rem 1rem'
        if(TOOL.browser().iPhone){
          margin = '0 0 8.1rem 1rem'
        }
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          position:'RIGHT_BOTTOM',
          margin: margin,
          left: 0,
          clickHandler: () => {
            if(!this.lineId){
              this.bestView.controls = [this.startPointer, this.startStation]
            }
            this.setBestView()
          }
        })
      },
      
      goback () {
        this.$router.go(-1)
      },
  
      findBusRoutPlanInfo () {
        api.findBusRoutPlanInfo(this.lineId, {
          aLineSegmentId: this.aLineSegmentId,
          bLineSegmentId: this.bLineSegmentId,
          direct: this.direct,
          productTypeLevelTwo: this.productTypeLevelTwo
        }).then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.lineData = data.resultData
            if(this.productTypeLevelTwo === 'PUBLIC_URBAN_BUS'){
              this.urbanStationMapRender(data.resultData)
            }else{
              this.countyStationMapRender(data.resultData)
            }
          }
        })
      },
  
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
    
        let allSites = data.allSites
        let allSitesLen = allSites.length
        let sites = data.sites
        let siteLen = sites.length
        this.bestView.controls = []
        for(let i = 0; i < allSitesLen; i ++ ) {
          let point = TOOL.baiduToTencent({
            lat: allSites[i].point[1],
            lng: allSites[i].point[0]
          })
          if(allSites[i].id === sites[0].id){
            let startStation = this._addStation(point, allSites[i].name, 8)
            this.stations.push(startStation)
            if(this.localData.from.lat && this.localData.from.lng){
              this.startPointer = this._addPointer(this.localData.from, 0)
              this._addGuideLayer([{
                lat: this.localData.from.lat,
                lng: this.localData.from.lng
              } ,point])
            }
            this.bestView.controls.push(this.startPointer)
            this.bestView.controls.push(startStation)
          }else if(allSites[i].id === sites[siteLen - 1].id){
            let endStation = this._addStation(point, allSites[i].name, 9)
            this.stations.push(endStation)
            if(this.localData.to.lat && this.localData.to.lng){
              this.endPointer = this._addPointer(this.localData.to, 1)
              this._addGuideLayer([point, {
                lat: this.localData.to.lat,
                lng: this.localData.to.lng
              }])
            }
            this.bestView.controls.push(endStation)
            this.bestView.controls.push(this.endPointer)
          }else{
            let type = 6
            if(i === 0){
              type = 10
            }else if(i === allSitesLen - 1){
              type = 11
            }
            this.stations.push(this._addStation(point, allSites[i].name, type))
          }
          this.setBestView()
        }
      },
  
      /**
       * 城乡公交添加路线、站点及站点名称
       * @param data
       */
      countyStationMapRender (data) {
        let allPublicBusLineSegments = data.allPublicBusLineSegments || []
        let allPublicBusLineSegmentsLen = allPublicBusLineSegments.length
        
        let publicBusLineSegments = data.publicBusLineSegments || []
        let lineSegmentsLen = publicBusLineSegments.length
        
        //最近站点
        for(let i = 0; i < allPublicBusLineSegmentsLen; i ++ ){
          let linePoints = allPublicBusLineSegments[i].linePoints
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
          this.bestView.controls = []
          if(allPublicBusLineSegments[i].id === publicBusLineSegments[0].id){
            let station = this._addStation(paths[0], allPublicBusLineSegments[i].name, 7)
            this.stations.push(station)
            if(this.localData.from.lat && this.localData.from.lng){
              this.startPointer = this._addPointer(this.localData.from, 0)
              this._addGuideLayer([{
                lat: this.localData.from.lat,
                lng: this.localData.from.lng
              } , paths[0]])
            }
            this.bestView.controls.push(this.startPointer)
            this.bestView.controls.push(station)
          }else{
            let type = 6
            let last = allPublicBusLineSegmentsLen - 1
            if(i === 0){
              type = 10
            }else if(i === allPublicBusLineSegmentsLen - 1){
              type = 11
            }
            if(i !== last){
              this.stations.push(this._addStation(paths[0], allPublicBusLineSegments[i].name, type))
            }else{
              this.stations.push(this._addStation(paths[paths.length - 1], allPublicBusLineSegments[i].name, type))
            }
            if(this.localData.to.lat && this.localData.to.lng && i === last){
              if(allPublicBusLineSegments[i].id === publicBusLineSegments[lineSegmentsLen - 1].id){
                this.endPointer = this._addPointer(this.localData.to, 1)
                this._addGuideLayer([paths[paths.length - 1], {
                  lat: this.localData.to.lat,
                  lng: this.localData.to.lng
                }])
              }
            }
          }
          this.setBestView()
        }
      },
  
      showCurrentStation (segment, index) {
        segment.showMiddleStation = !segment.showMiddleStation
        this.$set(this.transferPlan.segments, index, segment)
      },
      
      renderTransferMap () {
        if(this.localData.from.lat && this.localData.from.lng){
          this.startPointer = this._addPointer(this.localData.from, 0)
          this.bestView.controls.push(this.startPointer)
        }
  
        let segments = []
        for(let i = 0; i < this.transferPlan.segments.length; i++){
          let segment = this.transferPlan.segments[i]
          if(segment.transit_mode === 'WALK'){
            this.renderTransferWalk(segment)
          }else{
            segments.push(segment)
          }
        }
        
        let segmentsLen = segments.length
        for(let i = 0; i < segmentsLen; i++){
          let segment = segments[i]
          segment.showMiddleStation = false
          let needTransfer = true;
          if(segmentsLen === 1 || i === segmentsLen -1){
            needTransfer = false
          }
          if(segment.transit_mode === 'BUS'){
            this.renderTransferBus(segment, needTransfer, i)
          }else if(segment.transit_mode === 'SUBWAY'){
            this.renderTransferSubway(segment, needTransfer, i)
          }
        }
       
        if(this.localData.to.lat && this.localData.to.lng){
          this.endPointer = this._addPointer(this.localData.to, 1)
          this.bestView.controls.push(this.endPointer)
        }
        
        this.setBestView()
      },
      
      renderTransferWalk (segment) {
        let paths = JSON.parse(JSON.stringify(segment.transit.path))
        paths = paths.map((e) => {
          return {
            lat: e.lat,
            lng: e.lng
          }
        })
        this._addGuideLayer(paths)
      },

      renderTransferBus (segment, needTransfer, index) {
        this.renderTransfer(segment, 'bus', needTransfer, index)
      },
      
      renderTransferSubway (segment, needTransfer, index) {
        this.renderTransfer(segment, 'subway', needTransfer, index)
      },
      
      renderTransfer (segment, type, needTransfer, index) {
        let on_station = segment.transit.on_station
        let startType = type === 'bus' ? 8 : 12
        let startStation = this._addStation(on_station.location, on_station.name, startType)
        if(index === 0){
          this.startStation = startStation
        }
        
        let stationType = type === 'bus' ? 15 : 14
        this.renderStation(segment, stationType)
        
        let off_station = segment.transit.off_station
        let endType = type === 'bus' ? 9: 13
        let endName = off_station.name
        if(needTransfer){
          endName = ''
          this._addStation(off_station.location, '', 16)
        }
        this._addStation(off_station.location, endName, endType)
        this.renderLine(segment, type)
      },
      
      renderLine (segment, colorType) {
        let paths = JSON.parse(JSON.stringify(segment.transit.path))
        paths = paths.map((e) => {
          return {
            lat: e.lat,
            lng: e.lng
          }
        })
        this._addRoute(paths, colorType)
      },
      
      renderStation (segment, stationType) {
        let stationDatas = segment.transit.via_stops
        let stationDatasLen = stationDatas.length
        for(let i = 0; i < stationDatasLen; i++){
          let station = this._addStation(stationDatas[i].location, stationDatas[i].name, stationType)
          this.bestView.controls.push(station)
        }
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
        this.mapRoute = []
        this.stations = []
        this.bestView.controls = []
      },
  
      _addRoute (paths, type) {
        let lineColor = '#fc924c'
        if(type === 'bus'){
          lineColor = '12b796'
        }else if(type === 'subway'){
          lineColor = '#2290f9'
        }
        return new qqMap.component.Route({
          map: this.map,
          createType: 'custom',
          path: paths,
          outlineColor: lineColor,
          lineColor: lineColor,
          callback: (i, n) => {
            if(!i){
              //                    this.mapRoute = n
            }
          }
        })
      },
  
      _addGuideLayer (paths) {
        return new qqMap.vector.GuideLayer({
          map: this.map,
          path: paths,
          callback: (i, n) => {
            if(!i){
              //                      this.mapRoute = n
            }
          }
        })
      },
      
      _addPointer (address, type) {
        return new qqMap.component.Pointer({
          map: this.map,
          lat: address.lat,
          lng: address.lng,
          type: type,
          content:''
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
  
      /**
       * 获取高德地图线路终点站名称
       */
      getTerminalName (name) {
        if(name){
          let start = name.indexOf('--')
          let end = name.lastIndexOf(')') || name.lastIndexOf('）')
          return name.substring(start + 2, end)
        }
        return ''
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .flex-box{
    display: flex;
    height:100%;
    flex-direction: column;
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
  .bus-line-map{
    flex: 1;
    padding-bottom:150px;
  }
  .station-abs{
    position: fixed;
    bottom:0;
    width: 100%;
    padding-top:28px;
    display: flex;
    flex-direction: column;
    &.to-top{
      padding-top:0;
      top: 86px;
      background:#fff;
    }
  }
  .to-top{
    .station-item{
      background:url("../../../assets/bus/down.png") no-repeat center 10px #fff;
      background-size: 15px 8px;
    }
  }
  .bus-line-box{
    position: relative;
    display:inline-block;
    &:first-child.more{
      margin-left:0;
      padding-left:0;
      background:none;
    }
    &.more{
      margin-left:20px;
      padding-left:28px;
      background:url("../../../assets/bus/right.png") no-repeat 0 center;
      background-size:8px 15px;
    }
  }
  .more-lines{
    display:inline-block;
    margin-bottom:16px;
    .more-line-text{
      padding:0 20px;
      font-size:28px;
      color: #888;
    }
  }
  .station-item{
    padding: 30px 20px 20px;
    background:url("../../../assets/bus/up.png") no-repeat center 10px #fff;
    background-size: 15px 8px;
    .bus-item{
      position: relative;
      display:inline-block;
      padding:10px 10px 12px;
      border:1PX solid #e5e5e5;
      border-radius:8px;
      font-size:28px;
      color:#121212;
      vertical-align: middle;
      overflow: hidden;
      .icon-bus{
        display: inline-block;
        width:26px;
        height:26px;
        background:url("../../../assets/bus/station.png") no-repeat center center;
        background-size: 26px 26px;
        vertical-align: bottom;
        &.icon-subway{
          background:url("../../../assets/bus/sub_way.png") no-repeat center center;
          background-size: 26px 26px;
        }
      }
      .line-urban{
        position: absolute;
        left:0;
        bottom:0;
        width:100%;
        height:6px;
        background:#12b796;
        &.line-county{
          background:#ff6600;
        }
        &.line-subway{
          background:#2290f9;
        }
      }
    }
    .address{
      font-size:24px;
      color:#888;
    }
  }
  .bus-station-list-box{
    flex:1;
    padding:20px 0 80px;
    overflow-y: scroll;
  }
  .bus-staiton-list{
    padding-left: 50px;
    li{
      position: relative;
      padding: 20px 30px;
    }
    .start-walk{
      padding-top:0;
    }
    .end-walk{
      padding-bottom:0;
    }
    .start-walk,
    .end-walk{
      border-left: 1PX dashed #ccc;
      .dot{
        position: absolute;
        left: -15px;
        width:30px;
        height:30px;
      }
      .start-dot{
        top:0;
        background:url("../../../assets/order_start.png") no-repeat center bottom #fff;
        background-size:30px 30px;
      }
      .end-dot{
        bottom:0;
        background:url("../../../assets/order_end.png") no-repeat center bottom #fff;
        background-size:30px 30px;
      }
      .walk{
        padding:16px 0 10px 38px;
        font-size:24px;
        color:#888;
        background:url("../../../assets/bus/walk.png") no-repeat left center;
        background-size:18px 30px;
      }
    }
    .name{
      line-height: 1.4;
      font-size:28px;
      color:#121212;
      .small-name{
        font-size:20px;
        color:#4c4c4c;
      }
      em{
        color:#888;
        margin-left:10px;
      }
    }
    .station{
      .station-dot{
        position: absolute;
        top:50%;
        margin-top:-6px;
        left: -6px;
        width:12px;
        height:12px;
      }
      .p1{
        position: relative;
        margin-top:20px;
        margin-bottom:10px;
        font-size:24px;
        color:#888;
        i{
          display:inline-block;
          margin-right:20px;
          padding:5px 7px;
          background: #12b796;
          border-radius:8px;
          font-size:20px;
          color:#fff;
        }
        .station-num{
          float:right;
          font-size:24px;
          color:#888;
          padding-right:25px;
          background: url("../../../assets/bus/down.png") no-repeat right center;
          background-size: 15px 8px;
          &.pull-down{
            background-image: url("../../../assets/bus/up.png");
          }
        }
      }
      .p2{
        margin-bottom:14px;
        font-size:20px;
        color:#888;
      }
    }
    .middle-station{
      padding:3px 30px;
      font-size:20px;
      color:#4c4c4c;
      .name{
        font-size:20px;
        color:#4c4c4c;
      }
      .station-dot{
        position: absolute;
        top:50%;
        margin-top:-6px;
        left: -6px;
        width:10px;
        height:10px;
      }
    }
  }
  .county-list{
    background:#fcf6f2;
    li{
      border-left: 1PX solid #fcdeca;
    }
    .station {
      .p1{
        i{
          background: #fc924c;
        }
      }
      .station-dot {
        background: url("../../../assets/bus/county_dot.png") no-repeat left center;
        background-size: 12px 12px;
      }
    }
    .middle-station{
      .station-dot{
        background:url("../../../assets/bus/county_dot.png") no-repeat left center;
        background-size:10px 10px;
      }
    }
  }
  .urban-list{
    background:#f6fffd;
    li{
      border-left: 1PX solid #baece2;
    }
    .station {
      .p1{
        i{
          background: #2290f9;
        }
      }
      .station-dot {
        background: url("../../../assets/bus/urban_dot.png") no-repeat left center;
        background-size: 12px 12px;
      }
    }
    .middle-station{
      .station-dot{
        background:url("../../../assets/bus/urban_dot.png") no-repeat left center;
        background-size:10px 10px;
      }
    }
  }
  .subway-list{
    background:#f2f9ff;
    li{
      border-left: 1PX solid #cce6ff;
    }
    .station {
      .p1{
        i{
          background: #2290f9;
        }
      }
      .station-dot {
        background: url("../../../assets/bus/subway_dot.png") no-repeat left center;
        background-size: 12px 12px;
      }
    }
    .middle-station{
      .station-dot{
        background:url("../../../assets/bus/subway_dot.png") no-repeat left center;
        background-size:10px 10px;
      }
    }
  }
</style>