<template>
  <div class="app-main">
    <div class="app-info-box">
      <div class="app-info" :class="[productTypeLevelOne]">
        <p class="app-name">{{appData.appName}}App</p>
        <p class="app-version">版本：{{appData.versionNum}}</p>
      </div>
      <a class="btn-download ios" @click="downloadApp('iphone')">苹果下载</a>
      <a class="btn-download android" @click="downloadApp('android')">安卓下载</a>
    </div>
    <img class="app-txt1" :src="appData.text"/>
    <p class="app-txt2">{{appData.text2}}</p>
    <img class="app-txt3" :src="appData.screenshot"/>
    <share-modal :show="isShare" shareText="点击右上角分享此APP" @closeShare="isShare = false"></share-modal>
  </div>
</template>
<script>
  import ShareModal from 'appComponents/shareModal/index'
  
  export default {
    components: {
      ShareModal,
    },
    data () {
      return {
        productTypeLevelOne:'',
        isShare:false,
        appData: '',
        appDatas: {
          CITY_BUS: {
            appName: '城际专线',
            text: '../../../static/pics/firm/city_txt.png',
            text2: '每日任务，实时查看！',
            versionNum:'',
            screenshot: '../../../static/pics/firm/city.png',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion',
            wxiPhoneDownloadUrl:'',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion-release-1.2.3_123_jiagu_sign.apk',
            iPhoneDownloadUrl:''
          },
          TRAIN_STATION_BUS: {
            appName: '接送火车',
            text: '../../../static/pics/firm/train_txt.png',
            text2: '每日任务，实时查看！',
            versionNum:'',
            screenshot: '../../../static/pics/firm/city.png',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.train',
            wxiPhoneDownloadUrl:'',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_train-release-1.0.0_100_jiagu_sign.apk',
            iPhoneDownloadUrl:''
          },
          AIRPORT_BUS: {
            appName: '接送飞机',
            text: '../../../static/pics/firm/airport_txt.png',
            text2: '每日任务，实时查看！',
            versionNum:'',
            screenshot: '../../../static/pics/firm/city.png',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.aircraft',
            wxiPhoneDownloadUrl:'',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_aircraft-release-1.0.0_100_jiagu_sign.apk',
            iPhoneDownloadUrl:''
          },
          CAR_HAILING: {
            appName: '品牌约车',
            text: '../../../static/pics/firm/carhailing_txt.png',
            text2: '每日任务，实时查看！快捷接单，绝不耽搁！',
            versionNum:'',
            screenshot: '../../../static/pics/firm/carhailing.png',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion_brand',
            wxiPhoneDownloadUrl:'',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_brand-release-1.2.2_122_jiagu_sign.apk',
            iPhoneDownloadUrl:''
          },
          TAXI: {
            appName: '出租的士',
            text: '../../../static/pics/firm/taxi_txt.png',
            text2: '每日任务，实时查看！快捷接单，绝不耽搁！',
            versionNum:'',
            screenshot: '../../../static/pics/firm/taxi.png',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.taxi',
            wxiPhoneDownloadUrl:'',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_taxi-release-1.0.1_101_jiagu_sign.apk',
            iPhoneDownloadUrl:''
          },
          CAR_INSPECTION: {
            appName: '车辆年检',
            text: '../../../static/pics/firm/inspect_txt.png',
            text2: '每日任务，实时查看！快捷接单，绝不耽搁！',
            versionNum:'',
            screenshot: '../../../static/pics/firm/inspect.png',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.vehicleannualinspection',
            wxiPhoneDownloadUrl:'',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_vehicle_1.0.0.apk',
            iPhoneDownloadUrl:''
          }
        }
      }
    },
    created () {
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.isShare = this.$route.query.isShare
      this.appData = this.appDatas[this.productTypeLevelOne]
      api.appVersionFind(this.productTypeLevelOne).then(res => {
        const data = TOOL.toJson(res.data);
        if (data.resultCode === '0') {
          this.appData.androidDownloadUrl = data.resultData[0].downloadUrl
          this.appData.appName = data.resultData[0].appName
          this.appData.versionNum = data.resultData[0].versionNum || 'V1.0.0'
        } else {
          this.$store.dispatch('showError', data.resultMsg);
        }
      })
    },
    methods:{
      downloadApp (type) {
        if(TOOL.browser().weixin){
          if (TOOL.browser().android) {
            window.location.href = this.appData.wxAnroidDownloadUrl;
          } else if (TOOL.browser().iPhone || TOOL.browser().iPad) {
            this.$store.dispatch('showError', '苹果版本正在开发中，敬请期待！');
          }else{
            window.location.href  = this.appData.wxAnroidDownloadUrl;
          }
        }else{
          if (TOOL.browser().android || type === 'android') {
            window.location.href = this.appData.androidDownloadUrl;
          } else if (TOOL.browser().iPhone || TOOL.browser().iPad) {
            this.$store.dispatch('showError', '苹果版本正在开发中，敬请期待！');
          }else{
            window.location.href = this.appData.androidDownloadUrl;
          }
        }
      }
    }
  }
</script>
<style>
  .weui-toast{
    top:300PX!important;
  }
</style>
<style lang="less" scoped>
  .app-main{
    height:100%;
    text-align: center;
  }
  .app-info-box{
    margin-bottom: 40px;
    padding:64px 0 18px;
    text-align:center;
    background:url("../../../static/pics/firm/app_bg.png") no-repeat center 0 #fff;
    background-size:cover;
    .app-info{
      display: inline-block;
      height:128px;
      margin-bottom:48px;
      padding-left: 168px;
      text-align: left;
      color: #fff;
      background: no-repeat 0 center;
      background-size:128px 128px;
      &.CITY_BUS{
        background-image:url('../../../static/pics/cityApp.png');
      }
      &.AIRPORT_BUS{
        background-image:url('../../../static/pics/airportApp.png');
      }
      &.CAR_HAILING{
        background-image:url('../../../static/pics/carhailingApp.png');
      }
      &.TAXI{
        background-image:url('../../../static/pics/taxiApp.png');
      }
      &.TRAIN_STATION_BUS{
        background-image:url('../../../static/pics/trainApp.png');
      }
      &.CAR_INSPECTION{
        background-image:url('../../../static/pics/vehicleApp.png');
      }
      .app-name{
        margin:18px 0 22px;
        font-size: 36px;
      }
      .app-version{
        font-size:28px;
      }
    }
    .btn-download{
      display:block;
      width:320px;
      height:60px;
      line-height:60px;
      margin:0 auto 30px;
      text-align:center;
      font-size:32px;
      color:#ff6600;
      background: #fff;
      border-radius:30px;
      &.ios{
        background:#ccc;
        color: #4c4c4c;
      }
    }
  }
  .app-txt1{
    width: 318px;
    margin:0 auto 16px;
  }
  .app-txt2{
    font-size:28px;
    color:#4c4c4c;
    margin-bottom:60px;
  }
  .app-txt3{
    width:78%;
  }
</style>