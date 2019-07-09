<template>
  <main-box :title="title">
    <div class="map-content-outer">
      <div class="map-content-box" id="container"></div>
      <div class="store-box">
        <div class="current-address line line-x-t">
          <span class="icon-position"></span>
          <span class="mar-r-10 posiDataDetail">{{posiData.detail}}</span>
          <span class="c-f-888">附近的门店</span>
        </div>
        <div class="store-item line line-x-t" v-for="site in storeList"
             @click="selectSite(site)"
        >
            <div class="store-posi-icon"></div>
            <div class="store-address">
                <!--<span class="icon-position mar-posi"></span>-->
                <span class="f-s-28 mar-r-10">{{site.name}}</span>
                <span class="c-f-primary f-s-22">距离{{(site.distance/1000).toFixed(1)}}公里</span>
                <p class="f-s-24 c-f-888 store-mar-t text-overHide detail-address">{{site.address}}</p>
            </div>
            <div class="check-box">
              <input class="hide" type="radio" :value="true" :checked="currentSiteId==site.id">
              <i class="icon-check"></i>
            </div>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'
  import {Swiper, SwiperItem } from 'vux'

  export default {
    components: {
      MainBox,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.query.pageRouter,
        dataKey: this.$route.query.dataKey,
        siteType: this.$route.query.siteType,
        posiData: JSON.parse(this.$route.query.posiData),
        mapObj: '',
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
          zoom:14
        },
        storeList: [],
        bestView: {
          controls: [],
          pos: {
            paddingTop: 30,
            paddingBottom: 100,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        localData: {
          from:{},
          to:{},
          getSite: {},
          returnSite: {},
          aAddress: {},
          bAddress: {}
        },
        currentSiteId: '',
        currentData: '',
        showDetail:false,
        type: 0,
        isAllowFindStore: true
      }
    },
    mounted () {
      this.initData();
      console.log(this.posiData.detail);
//      this.subStoreFind()
    },
    methods: {
      initData() {
        if(this.isAllowFindStore) {
            this.isAllowFindStore = false;
        } else {
            return false;
        }
        if(appStorage.get(this.pageRouter)) {
          this.localData = Object.assign(this.localData, JSON.parse(appStorage.get(this.pageRouter)))
        }
        this.currentSiteId = this.localData[this.siteType].id;
        this.rentStoreFind();
      },
      rentStoreFind() {
        if(!this.posiData.city) {
            return false;
        }
        this.$store.commit('UPDATE_LOADING', true);
        api.rentStoreFind(this.posiData).then(res => {
            const data = TOOL.toJson(res.data);
            this.$store.commit('UPDATE_LOADING', false);
            if(data.resultCode == 0) {
                this.storeList = data.resultData;
                if(!this.storeList||this.storeList.length==0) {
                  this.$store.dispatch('showAlert', {
                    content: '当前城市暂未开通服务！',
                    buttonText: '知道了'
                  })
                }
                this.createMap(data.resultData)
            } else {
                this.$store.dispatch('showError',data.resultMsg);
            }
        })
      },
      selectSite(site) {
          this.localData[this.siteType] = Object.assign(this.localData[this.siteType],site);
          this.currentSiteId = site.id;
  
        appStorage.set(this.pageRouter, JSON.stringify(this.localData))
          this.$router.back();
      },
      /**
       * 查找店铺门店
       */
      subStoreFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.subStoreFind().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            if(data.resultData.length){
              this.createMap(data.resultData)
            }else{
              this.siteFind()
            }
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 查找店铺站点
       */
      siteFind () {
        this.$store.commit('UPDATE_LOADING', true)
        api.siteFind().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            if(data.resultData.length){
              this.type = 2
              this.createMap(data.resultData)
            }else{

            }
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      createMap (data) {
        if(!this.map){
          let len = data.length
          let points = []
          for (let i = 0; i < len; i++) {
            if (data[i].longitude && data[i].latitude) {
              let point = TOOL.baiduToTencent({
                lng: data[i].longitude,
                lat: data[i].latitude
              })
              points.push({
                point: point,
                data: data[i]
              })
            }
          }
          this.mapConfig.lat = points[0].point.lat
          this.mapConfig.lng = points[0].point.lng
          this.map = new qqMap.createMap(this.container, this.mapConfig)
          this.addPointer(points)
        }
      },

      addPointer (points) {
        for(let i = 0; i <　points.length; i++){
          let pointData = points[i].data;
          let store =  new qqMap.component.Store({
            map: this.map,
            lat: points[i].point.lat,
            lng: points[i].point.lng,
            type: this.type,
            clickHandler: () => {
                let site = this.storeList[i];
                this.selectSite(site);
            }
          })
          this.bestView.controls.push(store)
        }

        this.setCenter()
        this.resetControl()
      },

      changeType(type) {
          let store =   this.bestView.controls[0];
          store.pointerMarker.changeType(3);
      },

      resetControl () {
        this.resetControl = new qqMap.control.ResetControl({
          map: this.map,
          margin: '0 0 9rem 10px',
          clickHandler: () => {
            this.setCenter()
          }
        })
      },

      setCenter () {
        this.map.setView(this.bestView.controls, this.bestView.pos)
      },

      showDetailEvent () {
        if(!this.type){
          this.showDetail = true
        }
      }
    }
  }
</script>
<style lang="less" scoped>
    .posiDataDetail {
        /*display: inline-block;*/
        /*width: 70%;*/
        /*overflow: hidden;*/
    }
  .map-content-outer {
    height: 100%;
    width: 100%;

    background: #fff;
  }
  .map-content-box {
    width: 100%;
    height: 45%;
  }
  .store-box {
    width: 100%;
    height: 55%;

    overflow-y: auto;
  }
  .current-address {
    width: 100%;
    /*height: 80px;
    line-height: 80px;*/
      line-height: 36px;
    padding: 20px 20px;

    font-size: 28px;
    color: #4c4c4c;
  }
  .icon-position {
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-top: -2px;

    vertical-align: middle;
    background: url("../../../assets/rent/position.png") no-repeat center center;
    background-size: 28px 28px;
  }
  .store-item {
    display: flex;

    width: 100%;
    height: 120px;
    padding: 30px 20px;

    font-size: 28px;
    color: #4c4c4c;
  }
  .store-mar-t {
    margin-top: 18px;
  }
  .store-posi-icon {
    width: 28px;
    height: 100%;
    margin-right: 30px;

    background: url("../../../assets/rent/position.png") no-repeat center center;
    background-size: 28px 28px;
  }
  .store-address {
    width: 0;
    flex: 1;
  }
  .check-box {
    width: 34px;
    /*height: 82px;*/
    height: 100%;
  }
  .mar-posi {
    vertical-align: middle;
    margin-top: -5px;
  }
  .f-s-22 {
    font-size: 22px;
  }
  .detail-address {
    width: 100%;
  }

</style>
