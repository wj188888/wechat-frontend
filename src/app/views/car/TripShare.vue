<template>
  <main-box :title="title" main-class="scrollingBox" :go-back="goBack">
    <follow-us :is-follow="false"></follow-us>
    <div class="trip-box">
      <div class="map-box">
        <div class="map-container map-box" id="container"></div>
        <trip-driver-info :task-data="taskData"></trip-driver-info>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import FollowUs from 'components/followUs/index.vue'
  import TripDriverInfo from 'appComponents/tripDriverInfo/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'

  export default {
    components: {
      MainBox,
      FollowUs,
      TripDriverInfo
    },
    data () {
      return {
        title: this.$route.meta.title,
        showDialog: false,
        taskId: '',
        taskData: {
          aAddress:{},
          bAddress:{},
        },
        mapObj: '',
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
          zoom:14
        },
        startPoint:'',
        startPointer:'',
        endPoint:'',
        endPointer:'',
        mapRoute:'',
        resetControl:'',
        carPosition:'',
        carPointer:'',
        bestView: {
          controls: [],
          pos: {
            paddingTop: 250,
            paddingBottom: 80,
            paddingLeft: 10,
            paddingRight: 10
          }
        },
      }
    },
    computed: {
      starHtml () {
        return TOOL.renderStar(this.taskData.driverScore)
      },
    },
    mounted(){
      this.taskId = this.$route.query.taskId
      this.taskShareFindByTaskId()
    },
    methods: {
      goBack () {
        this.$router.push({
          name: appStorage.get('indexRouter')
        })
      },

      /**
       * 行程分享
       */
      taskShareFindByTaskId () {
        api.taskShareFindByTaskId(this.taskId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', true)
          if (data.resultCode == '0') {
            this.taskData = data.resultData
            this.$store.commit('UPDATE_LOADING', false)
            if(!this.map){
              this.startPoint = TOOL.baiduToTencent({
                lat: this.taskData.aAddress.latitude,
                lng: this.taskData.aAddress.longitude
              })
              this.endPoint = TOOL.baiduToTencent({
                lat: this.taskData.bAddress.latitude,
                lng: this.taskData.bAddress.longitude
              })
              this.mapConfig = this.startPoint;
              this.carPosition = this.startPoint;
              this.map = new qqMap.createMap(this.container, this.mapConfig)
              this._addStartPointer()
            }
          }
        })
      },

      _addStartPointer () {
        this.startPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.startPoint.lat,
          lng: this.startPoint.lng,
          type: 0,
          content: this.taskData.aAddress.detailAddress || (this.taskData.aAddress.city + this.taskData.aAddress.county)
        })
        this._addEndPointer()
        this._addCar()
      },

      _addEndPointer () {
        this.endPointer = new qqMap.component.Pointer({
          map: this.map,
          lat: this.endPoint.lat,
          lng: this.endPoint.lng,
          type: 1,
          content: this.taskData.bAddress.detailAddress || (this.taskData.bAddress.city + this.taskData.bAddress.county)
        })
        this.bestView.controls = [this.startPointer, this.endPointer]
        this.setCenter()
        this._resetControl()
      },

      _addCar () {
        let pointArr = []
        if(this.taskData.trackInfo && this.taskData.trackInfo.points){
          let pointListMap = this.taskData.trackInfo.points

          for (let i = 0; i < pointListMap.length; i ++) {
            let point = TOOL.baiduToTencent({
              lat: pointListMap[i].latitude,
              lng: pointListMap[i].longitude
            })
//            point = new qq.maps.LatLng(point.lat, point.lng)
            pointArr.push(point)
          }

          let len = pointArr.length
          if (len > 3) {
            this.carPosition = pointArr[len - 1]; //车坐标
          }
        }
        if(this.taskData.status == 1){
          let carType = 260
          if($.inArray(this.taskData.productTypeLevelTwo, TOOL.sofa) !== -1){
            carType = 273
          }
          if($.inArray(this.taskData.productTypeLevelTwo, TOOL.bus) !== -1){
            carType = 274
          }
          this.carPointer = new qqMap.vector.CarLayer({
            map: this.map,
            type: carType,
            angle:109,
            lat: this.carPosition.lat,
            lng: this.carPosition.lng,
          })
        }
        this._addGuideLayer (pointArr)
      },

      _addGuideLayer (pointArr) {
//        if(pointArr.length > 0){
//          this.mapRoute = new qqMap.vector.RouteLayer({
//            map: this.map,
//            path: pointArr,
//            callback: function(i, n) {
//              if(!i){
//                this.mapRoute = n
//              }
//            }
//          })
//        }else{
        this.mapRoute = new qqMap.component.Route({
          map: this.map,
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          callback: (i, n) => {
            if(!i){
              this.mapRoute = n
            }
          }
        })
//        }
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
