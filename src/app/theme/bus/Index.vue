<template>
  <div class="suggestmap">
    <div :id="mapId" class="mapcontainer"></div>
    <div class="top-news-tips" v-show="!isSwipeup">
      <!--<p class="top-tips" v-if="localData.isTapLine && !hideBusIndexTips && this.currentLine && this.currentLine.productTypeLevelTwo === 'PUBLIC_COUNTRYSIDE_BUS'">-->
        <!--该条线路允许用户在线路轨迹上的任何地点上下车。<i @click="closeTips"></i>-->
      <!--</p>-->
      <div class="news-center" @click="jumpToBusNews">
        <span class="news-dot" v-if="hasNewNotice"></span>
      </div>
    </div>
    <div class="shadow-box" v-show="isSwipeup && localData.isTapLine" @click="showMoreLine"></div>
    <div class="bus-box"
         :class="{
      'active': isSwipeup && localData.isTapLine,
      'search-line-tab': !localData.isTapLine,
      'shadow': !isSwipeup}">
      <div class="carpoolmap-login"
           v-show="!isSwipeup"
           :class="{'carpoolmap-login-active': isLogin}"
           @click="jumpToMy">
        <i :style="headimgurl ? {backgroundImage:'url(\'' + headimgurl + '\')'}:''"></i>
      </div>
      <ul class="search-type-box clearfix"
          :class="{'shadow': !isSwipeup}">
        <li :class="{'active': localData.isTapLine}" @click="changeTap(false)">线路</li>
        <li :class="{'active': !localData.isTapLine}" @click="changeTap(true)">附近</li>
      </ul>
      <div class="line-bus-box" v-show="!localData.isTapLine">
        <div class="bg-fff radius-box shadow">
          <div class="inline-box">
            <label class="icon-carhailing-start"></label>
            <input type="text" placeholder="您在哪上车" v-model="from" readonly @click="jumpToSetPosition('from')"/>
          </div>
          <div class="inline-box line line-x-t">
            <label class="icon-carhailing-end"></label>
            <input type="text" placeholder="您要去哪里" v-model="to" readonly @click="jumpToSetPosition('to')"/>
          </div>
        </div>
      </div>
      <div class="search-bus-box" v-show="localData.isTapLine">
        <div class="search-line-box">
          <a @click="jumpToSearchBusLine" class="search-bus-tool">搜索公交线路、目的地</a>
          <p class="show-line-list"
             :class="{'down': isSwipeup}"
             @click="showMoreLine"></p>
        </div>
        <p class="split"></p>
        <div class="station-list bg-fff" ref="stationList">
          <ul class="station-list-box">
            <li class="no-staion-item" v-if="!PUBLIC_COUNTRYSIDE_BUS.length && !PUBLIC_URBAN_BUS.length">{{noStationText}}</li>
            
            <!--当前线路-->
            <li class="station-item line line-x-b" v-if="currentLine">
              <!--v-swipeup="{fn: onSwipeup, name:'上滑'}"-->
              <!--v-swipedown="{fn:onSwipedown, name:'下滑'}"-->
              <div class="station-info"
                   @click="selectCurrentLine(currentLine)">
                <div class="current-station">
                  <p class="name">
                    {{currentLine.lineName}}
                  <!--<i class="tour-type" v-if="data.tourType === 0"></i>-->
                  </p>
                  <p class="time" v-if="currentLine.status === 0 && currentLine.busTime && currentLine.busTime[0] !== undefined">
                    <template v-if="currentLine.busTime[0]"><em>{{currentLine.busTime[0]}}</em>分钟</template>
                    <template v-else-if="currentLine.busTime[0] === 0">已到站</template>
                    <!--<template v-else>暂无数据</template>-->
                  </p>
                  <!--<p class="time" v-if="data.status === 1">等待发车</p>-->
                  <!--<p class="time" v-if="data.status === 2">暂无数据</p>-->
                </div>
                <div class="next-station">
                  <p class="name">
                    <template v-if="currentLine.nextLineSegmentName">
                      <em>下一站·</em>{{currentLine.nextLineSegmentName}}
                    </template>
                    <template v-else>
                      无站点信息
                    </template>
                  </p>
                  <p class="time" v-if="currentLine.status === 0">
                    <template v-if="currentLine.busTime && currentLine.busTime[1]">{{currentLine.busTime[1]}}分钟</template>
                    <template v-else-if="currentLine.busTime && currentLine.busTime[1] === 0">已到站</template>
                    <span :class="{'no-time-data': !(currentLine.status === 0 && currentLine.busTime && currentLine.busTime[0] !== undefined)}" v-else>暂无数据</span>
                  </p>
                  <p class="time no-time-data" v-if="currentLine.status === 1">等待发车</p>
                  <p class="time no-time-data" v-if="currentLine.status === 2">暂无数据</p>
                </div>
              </div>
              <a class="detail" @click="jumpToBusLineDetail(currentLine)">详情</a>
            </li>
            
            <!--城乡公交-->
            <li class="station-item line line-x-b"
                v-if="data.lineId !== currentLine.lineId"
                v-for="(data, index) in PUBLIC_COUNTRYSIDE_BUS">
              <div class="station-info"
                   @click="selectCurrentLine(data)">
                <div class="current-station">
                  <p class="name">{{data.lineName}}</p>
                  <p class="time" v-if="data.status === 0 && data.busTime && data.busTime[0] !== undefined">
                    <template v-if="data.busTime[0]"><em>{{data.busTime[0]}}</em>分钟</template>
                    <template v-else-if="data.busTime[0] === 0">已到站</template>
                  </p>
                </div>
                <div class="next-station">
                  <p class="name">
                    <template v-if="data.nextLineSegmentName">
                      <em>下一站·</em>{{data.nextLineSegmentName}}
                  </template>
                    <template v-else>
                      无站点信息
                    </template>
                  </p>
                  <p class="time" v-if="data.status === 0">
                    <template v-if="data.busTime && data.busTime[1]">{{data.busTime[1]}}分钟</template>
                    <template v-else-if="data.busTime && data.busTime[1] === 0">已到站</template>
                    <span :class="{'no-time-data': !(data.status === 0 && data.busTime && data.busTime[0] !== undefined)}" v-else>暂无数据</span>
                  </p>
                  <p class="time no-time-data" v-if="data.status === 1">等待发车</p>
                  <p class="time no-time-data" v-if="data.status === 2">暂无数据</p>
                </div>
              </div>
              <a class="detail" @click="jumpToBusLineDetail(data)">详情</a>
            </li>
          </ul>
          
          <!--城市公交-->
          <ul class="city-bus">
            <li class="line line-x-b" v-for="(urbanStation, index) in PUBLIC_URBAN_BUS">
              <p class="city-station-name line line-x-b"
                 @click="findCityBusBySite(urbanStation, index)">
                {{urbanStation.siteName}} <i class="icon-t-jt" :class="{'icon-b-jt': index === currentStationIndex && currentStationLines}"></i>
              </p>
              <ul  class="station-list-box" v-if="index === currentStationIndex && currentStationLines">
                <li class="station-item line line-x-b"
                    v-for="(data, index) in currentStationLines">
                  <!--v-swipeup="{fn: onSwipeup, name:'上滑'}"-->
                  <!--v-swipedown="{fn:onSwipedown, name:'下滑'}"-->
                  <div class="station-info"
                       @click="selectCurrentLine(data)">
                    <div class="current-station">
                      <p class="name">
                        {{data.lineName}}
                  <!--<i class="tour-type" v-if="data.tourType === 0"></i>-->
                      </p>
                      <p class="time" v-if="data.status === 0 && data.busTime && data.busTime[0] !== undefined">
                        <template v-if="data.busTime && data.busTime[0]"><em>{{data.busTime[0]}}</em>分钟</template>
                        <template v-else-if="data.busTime && data.busTime[0] === 0">已到站</template>
                        <!--<template v-else>暂无数据</template>-->
                      </p>
                      <!--<p class="time" v-if="data.status === 1">已到站</p>-->
                      <!--<p class="time" v-if="data.status === 2">暂无数据</p>-->
                    </div>
                    <div class="next-station">
                      <p class="name">
                        <template v-if="data.nextLineSegmentName">
                          <em>下一站·</em>{{data.nextLineSegmentName}}
                        </template>
                        <template v-else>
                          无站点信息
                        </template>
                      </p>
                      <p class="time" v-if="data.status === 0">
                        <template v-if="data.busTime && data.busTime[1]">{{data.busTime[1]}}分钟</template>
                        <template v-else-if="data.busTime && data.busTime[1] === 0">已到站</template>
                        <span :class="{'no-time-data': !(data.status === 0 && data.busTime && data.busTime[0] !== undefined)}" v-else>暂无数据</span>
                      </p>
                      <p class="time no-time-data" v-if="data.status === 1">已到站</p>
                      <p class="time no-time-data" v-if="data.status === 2">暂无数据</p>
                    </div>
                  </div>
                  <a class="detail" @click="jumpToBusLineDetail(data)">详情</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import checkLogin from 'mixins/checkLogin'
  import { mapState } from 'vuex'
  import qqMap from 'utils/qqmap/CreateMap'
  import vueTouch from 'directives/vueTouch'
  
  let swipeup = vueTouch.swipeup
  let swipedown = vueTouch.swipedown
  let timestamp = 10000
  
  export default {
    mixins: [checkLogin],
    directives: {
      swipeup,
      swipedown
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
            paddingBottom: 200,
            paddingLeft: 50,
            paddingRight: 50
          }
        },
        mapCenter: {
          lat: 35.960223,
          lng: 114.257813
        },
        
        locationAddress: '',
        direct: 'OUT',
        PUBLIC_COUNTRYSIDE_BUS: [],
        PUBLIC_URBAN_BUS: [],
        noStationText: '正在努力搜索附近线路...',
        currentLine:'',
        nearestLineSegmentName:'',
        
        localData:{
          from: {
            city: '',
            county: '',
            town:'',
            name:'',
            detailAddress: '',
            lat: '',
            lng: '',
          },
          to: {},
          isTapLine: true,
        },
        from:'定位中...',
        to: '',
        
        isLogin: false,
        headimgurl:'',
        warningTips:'',
        locationTips: '定位失败，请手动选择出发城市',
        localtionFail: false, // 定位失败状态
        relocationStatus: false, // 是否正在定位中
        
        isSwipeup: false,
        hasNewNotice: false,
        newestNoticeId: '',
        timer1: '',
        locationTimer: '',
        locationTimerStatus: false,
        hideBusIndexTips:'',
        currentStationIndex: '',
        currentStationLines: []
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
    },
    mounted () {
      this.initialize()
      this.hideBusIndexTips = appStorage.get('hideBusIndexTips')
    },
    destroyed () {
      this.clearTimer()
    },
    methods: {
      clearTimer () {
        clearTimeout(this.timer1)
        clearTimeout(this.locationTimer)
      },
      
      /**
       * 展开关闭线路列表
       */
      showMoreLine () {
        if(this.isSwipeup && this.$refs.stationList){
          this.$refs.stationList.scrollTop = 0
        }
        this.isSwipeup = !this.isSwipeup
      },
      
      /**
       * 关闭提示语
       */
      closeTips () {
        this.hideBusIndexTips = true
        appStorage.set('hideBusIndexTips', true)
      },
      
      /**
       * 上滑事件
       */
      onSwipeup (s, e){
        this.isSwipeup = true
      },
      
      /**
       * 下滑事件
       */
      onSwipedown (s, e){
        this.isSwipeup = false
      },
      
      /**
       * 页面初始化方法
       */
      initialize () {
        this.initMap()
        this.locationHandel()
        
        this.isLogin = appStorage.get('X-Auth-Token')
        if (this.isLogin) {
          this.systemNoticeHasNewNotice()
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.headimgurl = usrInfo.headimgurl
        }
      },
  
      /**
       * 初始化地图
       */
      initMap () {
        if(this.map) return
        this.map = new qqMap.createMap(this.mapId, {
          lat: this.mapCenter.lat,
          lng: this.mapCenter.lng,
          zoom: 4
        })
      },
      
      getLocalData () {
        if(appStorage.get(this.pageRouter)){
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          this.localData = Object.assign(this.localData, localData)
          if(this.localData.from && this.localData.from.city){
            this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.name
          }
          this.localData.to = {}
          this.to = ''
        }
      },
      
      /**
       * 定位处理
       */
      locationHandel () {
        if(this.appAddress){
          if(this.appAddress !== TOOL.locationFail){
            this.successLocation(this.appAddress)
          }else{
            this.failLocation()
          }
        }else{
          this.$store.commit('UPDATE_LOADING_TEXT', '定位中...');
          this.$store.commit('UPDATE_LOADING', true);
          this.$store.watch((state) => {
            return state.city.appAddress;
          }, (newVal, oldVal) => {
            this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('UPDATE_LOADING_TEXT', '');
            if(!this.locationTimerStatus){
              if(newVal && newVal !== TOOL.locationFail){
                this.successLocation(newVal)
              }else{
                this.failLocation(true)
              }
            }else{
              this.setAddressData(newVal)
              this.user.setPosition({lat: newVal.position.lat, lng: newVal.position.lng})
            }
          }, {deep: true});
        }
      },
      
      setAddressData (address) {
        let position = address.position
        this.localtionAddress = {
          city: address.city,
          county: address.district,
          town: address.township,
          name: address.detailAddress,
          detailAddress: address.detailAddress,
          lat: position.lat,
          lng: position.lng
          //          lat: '28.419494',
          //          lng: '115.382518'
        }
  
        this.localData.from = {
          city: address.city,
          county: address.district,
          town: address.township,
          name: address.detailAddress,
          detailAddress: address.detailAddress,
          lat: position.lat,
          lng: position.lng
        }
      },
      
      /**
       * 定位成功处理
       */
      successLocation (address) {
        this.setAddressData(address)
        this.getLocalData()
        this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.name
        this._addUser(this.localtionAddress.lat, this.localtionAddress.lng)
        this.setMapCenter(this.localtionAddress.lat, this.localtionAddress.lng)
        this.renderMapTool()
      },
      
      /**
       * 定位失败
       */
      failLocation (isShowAlert) {
        this.noStationText = '定位失败，请手动搜索您的出行线路'
        this.locationTips = '定位失败，请手动选择出发城市'
        this.relocationStatus = false
        this.localtionFail = true
        this.from = ''
        this.getLocalData()
        if(this.localData.from.lat){
          this.localtionAddress = Object.assign({}, this.localData.from)
          this.renderMapTool()
        }
        if(!isShowAlert) return
        this.$store.dispatch('showConfirm', {
          title: '定位失败',
          confirmText: '手动选择',
          cancelText: '取消',
          content: '请检查您的定位服务是否开启',
          onConfirm: () => {
            this.jumpToBuilding('from')
          },
          onCancel: () => {
          }
        })
      },
      
      /**
       * tab切换
       */
      changeTap (isTapLine) {
        if(this.localData.isTapLine === isTapLine){
          return
        }
        this.saveForm()
        this.localData.isTapLine = isTapLine
        if(this.localData.isTapLine){
          this.isSwipeup = false
        }
        if(this.localData.from.lat){
          this.renderMapTool()
        }
      },
      
      /**
       * 初始化地图组件
       */
      renderMapTool () {
        this.resetMap()
        let margin
        if(this.localData.isTapLine){
          this.publicBusLineFindNear()
          if(appStorage.get('currentLine')){
            this.currentLine = JSON.parse(appStorage.get('currentLine'))
          }
          if(this.currentLine){
            this.findMapDetail()
          }
          margin = '0 0 21rem 1rem'
          if(TOOL.browser().iPhone){
            margin = '0 0 21rem 1rem'
          }
          if(this.resetControl){
            this.resetControl.setMargin(margin)
          }
        }else{
          margin = '0 0 16rem 1rem'
          if(TOOL.browser().iPhone){
            margin = '0 0 17rem 1rem'
          }
          if(this.resetControl){
            this.resetControl.setMargin(margin)
          }
          this.setMapCenter(this.localData.from.lat, this.localData.from.lng)
          this._addProbeControl()
        }
      },
      
      
      /**
       * 跳转个人中心
       */
      jumpToMy () {
        this.saveForm()
        if (!this.isLogin) {
          TOOL.login()
        } else {
          this.$router.push({name: 'carpoolMapMy'})
        }
      },
      
      /**
       * 坐标转换
       */
      tanspoint (address) {
        return TOOL.tencentToBaidu({
          lat: address.lat,
          lng: address.lng,
        })
      },
      
      /**
       * 添加地图浮标组件
       */
      _addProbeControl () {
        if(this.probeControl){
          return
        }
        this.probeControl = new qqMap.control.ProbeControl({
          map: this.map,
          align: 'center',
          content: this.localData.from.name,
          probeLatlng: {
            lat: this.localData.from.lat,
            lng: this.localData.from.lng
          }
        })
        this.probeControl.on("picked", (address) => {
          this.localData.from = address
          this.from = TOOL.getCityOrCounty(this.localData.from) + '·' + this.localData.from.name
        })
      },
  
      /**
       * 添加地图用户图标
       */
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
        this._addResetControl()
        this.freshUserLocation()
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
  
      /**
       * 添加地图重置组件
       */
      _addResetControl () {
        if(this.resetControl){
          return
        }
        let margin = '0 0 21rem 1rem'
        if(TOOL.browser().iPhone){
          margin = '0 0 21rem 1rem'
        }
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          position:'RIGHT_BOTTOM',
          margin: margin,
          left: 0,
          clickHandler: () => {
            if(this.localData.isTapLine){
              this.setBestView()
            }else{
              let lat = this.user.getPosition().lat,
                  lng = this.user.getPosition().lng;
              this.map.setZoom(16)
              this.map.setCenter(lat, lng);
            }
          }
        })
      },
      
      /**
       * 存储订单到本地数据
       */
      saveCurrentLine () {
        appStorage.set('currentLine', JSON.stringify(this.currentLine))
      },
      saveForm () {
        this.saveCurrentLine()
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },
      
      /**
       * 清除本地订单数据
       */
      deleteForm () {
        this.localData.to = {}
        this.localData.startTime = ''
        this.localData.passengerNum = 0
        this.localData.productId = ''
        this.localData.lineType = ''
        this.localData.endPlace = ''
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
      },
      
      jumpToSetPosition (dataKey) {
        this.saveForm()
        this.$router.push({
          name: 'setPosition',
          query:{
            pageRouter: this.pageRouter,
            dataKey: dataKey
          }
        })
      },
      
      jumpToBusNews () {
        if(this.newestNoticeId){
          api.uptBusNoticeToRead(this.newestNoticeId).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              console.log('用户阅读了最新消息！')
            }
          })
        }
        this.saveForm()
        this.$router.push({
          name: 'busNews'
        })
      },
      
      systemNoticeHasNewNotice () {
        api.systemNoticeHasNewNotice().then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.hasNewNotice = data.resultData.hasNew
            this.newestNoticeId = data.resultData.newestNoticeId
          }
        })
      },
      
      /**
       * 查找当前定位附近的城市及城乡公交
       */
      publicBusLineFindNear () {
        let point = this.tanspoint(this.localtionAddress)
        api.publicBusLineFindNear({
          currentLat: point.lat,
          currentLon: point.lng,
          direct: this.direct,
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.setLineInfo(data.resultData)
            if(!this.currentLine){
              if(this.PUBLIC_COUNTRYSIDE_BUS && this.PUBLIC_COUNTRYSIDE_BUS.length){
                this.currentLine = this.PUBLIC_COUNTRYSIDE_BUS[0]
              }
              this.saveCurrentLine()
              this.findMapDetail()
            }
          }
        })
      },
      
      setLineInfo (data) {
        this.PUBLIC_COUNTRYSIDE_BUS = data.PUBLIC_COUNTRYSIDE_BUS || []
        this.PUBLIC_URBAN_BUS = data.PUBLIC_URBAN_BUS || []
        this.noStationText = (this.PUBLIC_COUNTRYSIDE_BUS.length || this.PUBLIC_URBAN_BUS.length) ? '' : '当前城市或您附近暂无线路，请试试手动搜索吧'
      },
      
      /**
       * 查找经过当前点击的站点的公交数据
       */
      findCityBusBySite (stationData, index) {
        this.isSwipeup = true
        if(this.currentStationLines && this.currentStationIndex === index){
          this.currentStationIndex = ''
          return
        }
        api.findCityBusBySite(stationData.siteId)
        .then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.currentStationLines = data.resultData
            this.currentStationIndex = index
          }
        })
      },
      
      selectCurrentLine (data) {
        this.currentLine = data
        this.saveCurrentLine()
        this.$refs.stationList.scrollTop = 0
        this.isSwipeup = false
        this.resetMap()
        this.findMapDetail()
      },
      
      /**
       * 初始化地图数据
       */
      findMapDetail () {
        if(!this.currentLine) return
        let nearestLineSegmentId = this.currentLine.lineSegmentId
        if(this.currentLine.productTypeLevelTwo === 'PUBLIC_URBAN_BUS'){
          nearestLineSegmentId = this.currentLine.siteId
        }
        let point = this.tanspoint(this.localtionAddress)
        api.findMapDetail(this.currentLine.lineId, {
          nearestLineSegmentId: nearestLineSegmentId,
          direct: this.direct,
          currentLat: point.lat,
          currentLon: point.lng,
          productTypeLevelTwo: this.currentLine.productTypeLevelTwo
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.nearestLineSegmentName = data.resultData.nearestLineSegmentName
            if(this.currentLine.productTypeLevelTwo === 'PUBLIC_URBAN_BUS'){
              this.urbanStationMapRender(data.resultData, nearestLineSegmentId)
            }else{
              this.countyStationMapRender(data.resultData, nearestLineSegmentId)
            }
            // 添加车
            let busLoctionDTOs = data.resultData.busLoctionDTOs
            let busArrialInfoDTO = data.resultData.busArrialInfoDTO
            if(busLoctionDTOs){
              for (let i = 0; i < busLoctionDTOs.length; i++) {
                let bus = busLoctionDTOs[i]
                let point = TOOL.baiduToTencent({
                  lat: bus.latitude,
                  lng: bus.longitude
                })
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
            //            this.bestView.controls = [].concat(this.stations)
            this.setBestView()
            this.freshAllLineInfo()
          }
        })
      },
      
      /**
       * 城乡公交添加路线、站点及站点名称
       * @param data
       * @param nearestLineSegmentId
       */
      urbanStationMapRender (data, nearestLineSegmentId) {
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
          if(sites[i].id === nearestLineSegmentId){
            let station = this._addStation(point, sites[i].name, 7)
            this.stations.push(station)
            if(this.user){
              setTimeout(()=>{
                this.guideLayer = new qqMap.vector.GuideLayer({
                  map: this.map,
                  path: [this.user.getPosition(), point],
                  callback: (i, n) => {
                    if(!i){
                      //                      this.mapRoute = n
                    }
                  }
                })
              })
            }
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
//        this.bestView.controls = [].concat(this.stations)
      },
  
      /**
       * 城乡公交添加路线、站点及站点名称
       * @param data
       * @param nearestLineSegmentId
       */
      countyStationMapRender (data, nearestLineSegmentId) {
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
          if(publicBusLineSegments[i].id === nearestLineSegmentId){
            let station = this._addStation(paths[0], publicBusLineSegments[i].name, 7)
            this.stations.push(station)
            if(this.user){
              let nearPoint = TOOL.baiduToTencent({
                lat: data.nearestLatitude,
                lng: data.nearestLongitude
              })
              setTimeout(()=>{
                this.guideLayer = new qqMap.vector.GuideLayer({
                  map: this.map,
                  path: [this.user.getPosition(), nearPoint],
                  callback: (i, n) => {
                    if(!i){
                      //                      this.mapRoute = n
                    }
                  }
                })
              })
            }
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
      },
  
      /**
       * 刷新数据
       */
      freshAllLineInfo () {
        clearTimeout(this.timer1)
        let point = this.tanspoint(this.localtionAddress)
        api.freshAllLineInfo({
          direct: this.direct,
          currentLat: point.lat,
          currentLon: point.lng,
          refreshLineId: this.currentLine.lineId,
          refreshSiteId: this.currentLine.siteId,
          productTypeLevelTwo: this.currentLine.productTypeLevelTwo,
        }).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            if(data.resultData.freshListInfo){
              this.setLineInfo(data.resultData.freshListInfo)
            }
            if(data.resultData.refreshMapInfo){
              this.refreshMapBus(data.resultData.refreshMapInfo)
            }
            if(data.resultData.freshLineInfo){
              this.currentLine = data.resultData.freshLineInfo
            }
            this.timer1 = setTimeout(()=>{
              this.freshAllLineInfo()
            }, timestamp)
          }
        })
        
      },
      
      refreshMapBus (data) {
        let busArrialInfoDTO = data.busArrialInfo
        let busLoctionDTOs = data.busLocations
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
            } else {
              //当前车辆
              if(bus.carId === busArrialInfoDTO.carId){
                this.buses[bus.carId] = this._addCar(point, bus.direct)
                this.setBusTips(this.buses[bus.carId], busArrialInfoDTO)
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
            if(!hasThisCar){
              this.buses[j].remove()
            }
          }
        }
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
        if(this.buses){
          for(let i in this.buses){
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
        if(this.user){
          this.bestView.controls.push(this.user)
        }
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
      
      jumpToSearchBusLine () {
        this.saveForm()
        this.$router.push({
          name: 'searchBusLine',
          
        })
      },
      
      jumpToBusLineDetail (data) {
        this.saveForm()
        let nearestLineSegmentId = data.lineSegmentId
        if(this.currentLine.productTypeLevelTwo === 'PUBLIC_URBAN_BUS'){
          nearestLineSegmentId = data.siteId
        }
        this.$router.push({
          name: 'busLineDetail',
          query:{
            lineId: data.lineId,
            nearestLineSegmentId: nearestLineSegmentId,
            currentLat: this.localtionAddress.lat,
            currentLon: this.localtionAddress.lng,
            productTypeLevelTwo: data.productTypeLevelTwo,
            direct: data.direct,
          }
        })
      },
      
      
    }
  }

</script>
<style lang="less">
  @import "../../../styles/theme.less";
  .suggestmap{
    position: relative;
    width: 100%;
    flex:1;
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
  .top-news-tips{
    position: absolute;
    top:0;
    left:0;
    right:0;
    .top-tips{
      height:100px;
      line-height:100px;
      padding-left:20px;
      font-size:26px;
      color:#4c4c4c;
      background:#fff;
      i{
        position:absolute;
        top:0;
        right:0;
        display:block;
        width:100px;
        height:100px;
        background:url("../../../assets/cha.png") no-repeat center center;
        background-size:30px 30px;
      }
    }
    .news-center{
      position: relative;
      margin-top:20px;
      margin-left:20px;
      width:70px;
      height:70px;
      background:url("../../../assets/bus/news_center.png") center center;
      background-size: 70px 70px;
      z-index:20;
      .news-dot{
        position: absolute;
        right: 18px;
        top: 11px;
        width:12px;
        height:12px;
        border-radius:50%;
        border:2px solid #fff;
        background: #ea5449;
      }
    }
  }
  .shadow-box{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height:100%;
    background: rgba(1, 1, 1, 0.5);
  }
  .bus-box{
    position: absolute;
    bottom: 0;
    left:20px;
    right:20px;
    height: 320px;
    transition: all .5s;
    border-radius: 0 8px 0 0;
    z-index:10;
    &.search-line-tab{
      bottom: 20px;
      height:auto;
    }
    &.active{
      height: 80%;
      transition: all .5s;
      .station-list{
        overflow: scroll;
      }
    }
    &.shadow{
      box-shadow: 0 0 10PX 0 #ccc;
    }
    .carpoolmap-login{
      position: absolute;
      top:-90px;
      right:0;
      width:72px;
      height:72px;
      margin-bottom:20px;
      border-radius:8px;
      border:1PX solid #ccc;
      z-index:200;
      background: #fff;
      i{
        display:block;
        width:48px;
        height:48px;
        margin:12px auto;
        border-radius:50%;
        background-image:url("../../../assets/theme/carpoolbusMap/user-center.png");
        background-size:46px 46px;
        border:1PX solid #ccc;
      }
    }
    .inline-box {
      label{
        width:86px;
        background:no-repeat 10px center;
        background-size:30px 30px;
      }
      .icon-carhailing-start{
        background-image:url("../../../assets/order_start.png")
      }
      .icon-carhailing-end{
        background-image:url("../../../assets/order_end.png")
      }
      span{
        color: #999;
        &.active{
          color: #121212;
        }
      }
    }
    .search-bus-box{
      overflow:hidden;
    }
    .search-line-box{
      position: relative;
      padding-right: 110px;
      background: #fff;
      .search-bus-tool{
        display:block;
        height: 80px;
        padding-left:90px;
        line-height:80px;
        font-size:28px;
        color: @fc-ccc;
        background:url("../../../assets/bus/search.png") no-repeat 30px center;
        background-size: 30px 30px;
      }
      .show-line-list{
        position: absolute;
        right:0;
        top:15px;
        bottom:15px;
        width: 106px;
        border-left:1PX solid #ccc;
        background:url("../../../assets/bus/show_more_line.png") no-repeat 32px center;
        background-size: 42px 30px;
        &.down{
          background:url("../../../assets/bus/show_more_line_down.png.png") no-repeat 32px center;
          background-size: 42px 30px;
        }
      }
    }
    .split{
      height:10px;
      background: @bg-f2f2f2;
    }
    .station-list{
      position: absolute;
      width: 100%;
      top: 90px;
      bottom: 0;
      overflow: hidden;
    }
    .city-station-name{
      height:80px;
      line-height:80px;
      padding-left:104px;
      font-size:28px;
      color:#888;
      background:url("../../../assets/bus/bus_station_current.png") no-repeat 30px center;
      background-size:44px 44px;
      i:after{
        right:20px;
      }
    }
    .no-staion-item{
      padding: 80px 0;
      font-size:28px;
      color: @fc-888;
      text-align: center;
    }
    .station-item{
      padding: 40px 0;
      display:flex;
      .station-info{
        flex:1;
        padding:0 30px;
        border-right:1PX solid @bc-ccc;
      }
      .detail{
        display: block;
        line-height:80px;
        padding: 0 30px;
        font-size:24px;
        color: @fc-888;
      }
      .current-station{
        display: flex;
        margin-bottom:20px;
        .name{
          flex:1;
          font-weight:bold;
          font-size:32px;
          color: @fc-121212;
        }
        .tour-type{
          display:inline-block;
          margin-left: 20px;
          width:24px;
          height:34px;
          background:url("../../../assets/bus/change.png") no-repeat center center;
          background-size: 24px 34px;
        }
        .time{
          text-align:right;
          padding-right: 40px;
          background:url("../../../assets/bus/signal.gif") no-repeat right center;
          background-size: 20px 18px;
          font-size:28px;
          color: @fc-2290f9;
        }
        em{
          font-size:40px;
        }
      }
      .next-station{
        display: flex;
        color: @fc-888;
        .name{
          flex:1;
          font-size:28px;
        }
        em{
          color: @fc-2290f9;
        }
        .time{
          font-size:24px;
        }
        .no-time-data{
          position: relative;
          top: -22px;
        }
      }
    }
    
    .search-type-box{
      position: absolute;
      left:0;
      top:-80px;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      &.shadow{
        box-shadow: 0 0 0 #ccc, 0 -2PX 3PX #eee, 0 0 0 #ccc, 0 0 0 #ccc;
      }
      li{
        float:left;
        width:120px;
        height:80px;
        line-height:80px;
        text-align:center;
        font-size: @fs-28;
        color: @fc-121212;
        background: @bg-fff;
        &.active{
          color: @fc-999;
          background: #f2f2f2;
        }
      }
    }
  }

</style>