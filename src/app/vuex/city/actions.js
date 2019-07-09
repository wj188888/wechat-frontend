
export default {
  gaodeLocation ({ dispatch, commit, state }) {
    AMap.plugin('AMap.Geolocation', function () {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 5000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      // // ios环境切换到使用远程https定位
      // if (AMap.UA.ios && document.location.protocol !== 'https:') {
      //   //使用远程定位，见 remogeo.js
      //   var remoGeo = new RemoGeoLocation();
      //   //替换方法
      //   navigator.geolocation.getCurrentPosition = function() {
      //     return remoGeo.getCurrentPosition.apply(remoGeo, arguments);
      //   };
      //   //替换方法
      //   navigator.geolocation.watchPosition = function() {
      //     return remoGeo.watchPosition.apply(remoGeo, arguments);
      //   };
      // }
  
      geolocation.getCurrentPosition();
  
      AMap.event.addListener(geolocation, 'complete', function(result){
        if(result.type === 'complete'){
          let position = result.position
          if(result.addressComponent){
            let addComp = result.addressComponent
            let detailAddress = result.formattedAddress
            if(!addComp.city && addComp.province) {
              addComp.city = addComp.province;
            }
            if(detailAddress){
              detailAddress = detailAddress.replace(addComp.province, '')
              detailAddress = detailAddress.replace(addComp.city, '')
              detailAddress = detailAddress.replace(addComp.district, '')
              detailAddress = detailAddress.replace(addComp.township, '')
              detailAddress = detailAddress.replace(addComp.street, '')
              detailAddress = detailAddress.replace(addComp.streetNumber, '')
            }
            addComp.detailAddress = detailAddress || addComp.street || addComp.district;
            addComp.position = position;
            commit('UPDATE_ADDRESS', addComp)
          }else{
            commit('FAIL_ADDRESS', TOOL.locationFail)
          }
        }else{
          commit('FAIL_ADDRESS', TOOL.locationFail)
        }
      });
  
      AMap.event.addListener(geolocation, 'error', function(result){
        commit('FAIL_ADDRESS', TOOL.locationFail)
      });
      
    });
  },
}
