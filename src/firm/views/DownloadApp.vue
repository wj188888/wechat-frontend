<template>
  <div class="app-main">
    <ul class="app-download-box">
      <li v-for="appData in appDatas" :class="[appData.appType]" @click="downloadApp(appData)">
        <p>{{appData.appName}}</p>
        <a>立即下载</a>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        appDatas: [
          {
            appType: 'city',
            appName: '城际专线',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion',
            wxiPhoneDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion-release-1.2.3_123_jiagu_sign.apk',
            iPhoneDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion-release-1.2.3_123_jiagu_sign.apk'
          },
          {
            appType: 'train',
            appName: '接送火车',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.train',
            wxiPhoneDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.train',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_train-release-1.0.0_100_jiagu_sign.apk',
            iPhoneDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_train-release-1.0.0_100_jiagu_sign.apk'
          },
          {
            appType: 'air',
            appName: '接送飞机',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.aircraft',
            wxiPhoneDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.aircraft',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_aircraft-release-1.0.0_100_jiagu_sign.apk',
            iPhoneDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_aircraft-release-1.0.0_100_jiagu_sign.apk'
          },
          {
            appType: 'carhailing',
            appName: '品牌约车',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion_brand',
            wxiPhoneDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion_brand',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_brand-release-1.2.2_122_jiagu_sign.apk',
            iPhoneDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_brand-release-1.2.2_122_jiagu_sign.apk'
          },
          {
            appType: 'taxi',
            appName: '出租的士',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.taxi',
            wxiPhoneDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.undunion.taxi',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_taxi-release-1.0.1_101_jiagu_sign.apk',
            iPhoneDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_taxi-release-1.0.1_101_jiagu_sign.apk'
          },
          {
            appType: 'vehicle',
            appName: '车辆年检',
            wxAnroidDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion',
            wxiPhoneDownloadUrl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.vcolco.undunion',
            androidDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_vehicle_1.0.0.apk',
            iPhoneDownloadUrl:'https://obfiwfjx9.qnssl.com/undunion_vehicle_1.0.0.apk'
          }
        ]
      }
    },
    mounted () {
    
    },
    methods:{
      downloadApp (appData) {
        let userAgent = navigator.userAgent;
        //微信扫描
        if(userAgent.indexOf("MicroMessenger") > 0){
          if (userAgent.indexOf("Android") > 0) {
            window.location.href = appData.wxAnroidDownloadUrl;
          } else if (userAgent.indexOf("iPhone") > 0) {
//            window.location.href  = appData.wxiPhoneDownloadUrl;
            this.$store.dispatch('showError', '苹果版本正在开发中，敬请期待！');
          }else{
            window.location.href  = appData.wxAnroidDownloadUrl;
          }
        }else{
          if (userAgent.indexOf("Android") > 0) {
            window.location.href = appData.androidDownloadUrl;
          } else if (userAgent.indexOf("iPhone") > 0) {
//            window.location.href = appData.iPhoneDownloadUrl;
            this.$store.dispatch('showError', '苹果版本正在开发中，敬请期待！');
          }else{
            window.location.href = appData.androidDownloadUrl;
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .app-main{
    height:100%;
    background:#fff;
  }
  .app-download-box{
    li{
      position: relative;
      padding-left:140px;
      height:140px;
      border-bottom: 1PX solid #f2f2f2;
      background: no-repeat 20px center;
      background-size:100px 100px;
      &.city{
       background-image:url('../../../static/pics/cityApp.png');
      }
      &.air{
        background-image:url('../../../static/pics/airportApp.png');
      }
      &.carhailing{
        background-image:url('../../../static/pics/carhailingApp.png');
      }
      &.taxi{
        background-image:url('../../../static/pics/taxiApp.png');
      }
      &.train{
        background-image:url('../../../static/pics/trainApp.png');
      }
      &.vehicle{
        background-image:url('../../../static/pics/vehicleApp.png');
      }
      p{
        line-height:140px;
        font-size: 32px;
        color:#4c4c4c;
      }
      a{
        position:absolute;
        right:20px;
        top:45px;
        width: 128px;
        padding:12px 0;
        font-size:24px;
        text-align: center;
        color:#ff6600;
        border: 1PX solid #ff6600;
        border-radius:8px;
      }
    }
  }
</style>
