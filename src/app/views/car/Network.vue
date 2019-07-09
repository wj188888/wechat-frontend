<template>
  <main-box :title="title">
    <div class="map-container map-box" id="container" style="height:100%;"></div>
    <div class="map-network-base" :class="{'has-jt': !type}" v-if="currentData" @click="showDetailEvent">
      <h2 class="base-tit">{{currentData.name}}</h2>
      <p class="base-address">地址：{{currentData.storeAddress}}</p>
      <p class="base-phone" v-if="currentData.telephone == '暂无'">电话：{{currentData.telephone}}</p>
      <p class="base-phone" v-else>电话：{{currentData.telephone | formatPhone}}</p>
    </div>
    <div class="map-network-detail" v-if="showDetail">
      <div class="shadow" @click="showDetail = false"></div>
      <div class="network-detail-box scrollingBox">
        <div class="address">
          <h2>
            {{currentData.name}}
            <i class="icon-type" :class="{'icon-store': !currentData.type, 'icon-station': currentData.type}"></i>
          </h2>
          <p>{{currentData.storeAddress}}</p>
        </div>
        <div class="network-info-box">
          <h3 class="network-tit"><i class="shu"></i>信息</h3>
          <div class="info">
            <span class="info-tit">联系姓名：</span>{{currentData.contactName}}
          </div>
          <div class="info">
            <span class="info-tit">联系电话：</span>{{currentData.telephone | formatPhone}}
          </div>
          <div class="info">
            <span class="info-tit">运营时间：</span>
            <p class="time" v-for="businessHourse in currentData.businessHourses">
              {{businessHourse.describe + ' ' + businessHourse.busStartTime + ' ~ ' + businessHourse.busEndTime}}<br/>
            </p>
          </div>
          <div class="info">
            <span class="info-tit">公交线路：</span>{{currentData.reachWay}}
          </div>
        </div>
        <div class="network-info-box">
          <h3 class="network-tit"><i class="shu"></i>照片</h3>
          <div class="pic-box">
            <swiper class="index-swiper" height="10rem" dots-position="center">
              <swiper-item class="swiper-demo-img" v-for="(storeImageUrl, index) in currentData.storeImageUrls" :key="index">
                <a>
                  <img style="width:100%;height:10rem;" :src="storeImageUrl">
                </a>
              </swiper-item>
            </swiper>
          </div>
        </div>
        <div class="network-info-box mar-b-0">
          <h3 class="network-tit"><i class="shu"></i>简介</h3>
          <div class="intro">{{currentData.brief}}</div>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import qqMap from '../../../utils/qqmap/CreateMap'
  import {Swiper, SwiperItem } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        title: this.$route.meta.title,
        mapObj: '',
        map:'',
        container:'container',
        mapConfig:{
          lat: 0,
          lng: 0,
          zoom:14
        },
        bestView: {
          controls: [],
          pos: {
            paddingTop: 30,
            paddingBottom: 100,
            paddingLeft: 30,
            paddingRight: 30
          }
        },
        currentData: '',
        showDetail:false,
        type: 0,
      }
    },
    mounted () {
      this.subStoreFind()
    },
    methods: {
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
          let store =  new qqMap.component.Store({
            map: this.map,
            lat: points[i].point.lat,
            lng: points[i].point.lng,
            type: this.type,
            clickHandler: () => {
              if(this.type == 2){
                this.currentData = {
                  name: points[i].data.name,
                  storeAddress: points[i].data.address || '暂无',
                  telephone: '暂无'
                }
              }else{
                this.currentData = points[i].data
              }

            }
          })
          this.bestView.controls.push(store)
        }
        this.setCenter()
        this.resetControl()
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
  .map-network-base{
    position:absolute;
    bottom:0;
    left:0;
    width:100%;
    height:200px;
    padding:35px 20px;
    font-size:24px;
    color:#888;
    background: no-repeat center 10px #fff;
    overflow:hidden;
  &.has-jt{
     background-image: url("../../../assets/jt_map_up.png");
     background-size: 22px 12px;
   }
  .base-tit{
    margin-bottom:30px;
    font-size:32px;
    color:#121212;
  }
  .base-address{
    margin-bottom:18px;
  }
  }
  .map-network-detail{
    position:absolute;
    bottom:0;
    left:0;
    width:100%;
    height: 100%;
  .shadow{
    position: absolute;
    bottom:0;
    left:0;
    width:100%;
    height: 100%;
    background:rgba(0, 0, 0, 0.7);
  }
  }
  .network-detail-box{
    position: absolute;
    bottom:-2px;
    left:0;
    top:160px;
    width:100%;
    z-index:10;
    background-color:#f2f2f2;
    overflow-x:auto;
  .address{
    padding:20px 20px 26px;
    margin-bottom:20px;
    background-color:#fff;
  h2{
    margin-bottom:30px;
    font-size:32px;
    color:#121212;
  }
  .icon-type{
    display:inline-block;
    width:30px;
    height:30px;
    margin-left:10px;
    background-repeat:no-repeat;
    background-size:30px 30px;
    vertical-align: bottom;
  }
  .icon-store{
    background-image:url("../../../assets/tag/map_store_3.png");
  }
  .icon-station{
    background-image:url("../../../assets/tag/map_station_3.png");
  }
  p{
    font-size:28px;
    color:#888;
  }
  }
  .network-tit{
    margin-bottom: 24px;
    font-size:28px;
    color:#121212;
  .shu{
    position: relative;
    top:10px;
    display: inline-block;
    width: 4px;
    height: 16px;
    margin-right: 18px;
    border-radius: 2px;
    background-color: #ff6600;
    vertical-align: text-top;
  }
  }
  .network-info-box{
    margin-bottom: 20px;
    padding:20px 20px 40px;
    background:#fff;
    font-size:28px;
    color:#4c4c4c;
  .pic-box{
    height:200px;
  }
  .info{
    position: relative;
    padding-left:140px;
    margin-bottom:20px;
  .info-tit{
    position: absolute;
    left:0;
    top:0;
  }
  }
  .time{
    margin-bottom: 10px;
  }
  .intro{
    padding-bottom:140px;
    line-height:1.4;
  }
  }
  }
</style>
