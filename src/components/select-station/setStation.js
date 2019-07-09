export function setStation1 (value, thisVue) {
  console.log(value);
  let _this = thisVue;
  if (!value.province) {
    _this.$store.dispatch('showError', '请输入您的具体地址');
    return
  }
  _this.$store.commit('UPDATE_LOADING', true)
  let start, msg, resource;
  if (_this.dataKey === 'onStation') {
    start = 0
    msg = '您选择的上车点不在范围内，请重新选择'
  } else {
    start = 1
    msg = '您选择的下车点不在范围内，请重新选择'
  }

  let query = {
    productId: _this.productId,
    start: start,
    latitude: value.point.lat,
    longitude: value.point.lng
  }

  if(_this.fromPage === 'expressCreate'){
    msg = '您选择的寄件地址不在范围内，请重新选择';
    resource = 'expressProductInRange'
  }else if (_this.fromPage === 'feeder') {
    resource = 'shuttleInRangeById'
    query.feederId = _this.feederId
    delete query.start
    delete query.productId
  }else if (_this.fromPage === 'airportPickCustom' || _this.fromPage === 'airportSendCustom') {
    start = 1
    resource = 'airportSkuInRange'
  }else if (_this.fromPage === 'trainPickCustom' || _this.fromPage === 'trainSendCustom') {
    resource = 'trainStationSkuInRange'
  }else{
    resource = 'productInRange'
    query.productTypeLevelOne = _this.productTypeLevelOne
  }

  api[resource](query).then(res => {
    const data = TOOL.toJson(res.data)
    _this.$store.commit('UPDATE_LOADING', false)
    if (data.resultCode === '0') {
      let localData = {}
      if (appStorage.get(_this.fromPage)) {
        localData = JSON.parse(appStorage.get(_this.fromPage))
      }
      if(_this.fromPage === 'feeder'){
        localData[_this.dataType][_this.dataKey] = {
          longitude: value.point.lng,
          latitude: value.point.lat,
          name: value.title,
          rank: 1
        }
      }else if(_this.fromPage === 'expressCreate') {
        appStorage.set(_this.fromPage + 'price', data.resultData.price);
	      localData[_this.dataKey] = {
	      	longitude: value.point.lng,
		    latitude: value.point.lat,
		    name: value.title
	      }
      }else{
        localData[_this.dataKey] = {
          longitude: value.point.lng,
          latitude: value.point.lat,
          name: value.title,
          rank: 1
        }
      }
  
      appStorage.set(_this.fromPage, JSON.stringify(localData))
      _this.$router.go(-1)
    } else {
      let showRangePage = [
        'appointBus',
        'scenicBusSpecial',
        'schoolBusSpecial',
        'expressCreate',
        'feeder',
      ]
      if(showRangePage.indexOf(_this.fromPage) === -1){
        _this.$store.dispatch('showError', msg);
      }else{
        _this.$router.push({
          name: 'outOfRange',
          query:{
            productId: _this.productId,
            productTypeLevelOne: _this.productTypeLevelOne,
            start: start,
            feederId: _this.feederId,
            fromPage: _this.fromPage,
            dataKey: _this.dataKey
          }
        })
      }
    }
  })
}

export function setStation2 (value,thisVue) {
  let _this = thisVue;
  if (!value.province) {
    _this.$store.dispatch('showError', '请输入您的具体地址');
    return
  }
  let data = {};
  if(appStorage.get(_this.fromPage)) {
    data = JSON.parse(appStorage.get(_this.fromPage));
  }

  const pageList = [
    'setInfo',
    'applyCharter',
    'applyBus',
    'schApplyBus',
    'commonUsedAddress',
    'carHailingSearch'
  ];
  if ($.inArray(_this.fromPage, pageList) > -1) {
    data[_this.dataKey] = {
      province: value.province,
      city: value.city,
      county: '',
      detailAddress: value.title,
      latitude: value.point.lat,
      longitude: value.point.lng
    }


  }else if(_this.fromPage === 'carpoolingSelf'){
    data[_this.dataKey] = {
      longitude: value.point.lng,
      latitude: value.point.lat,
      name: value.title,
      rank: 1
    };


    let carpoolingSelfStation = {}

    if(appStorage.get('carpoolingSelfStation')){
      carpoolingSelfStation = JSON.parse(appStorage.get('carpoolingSelfStation'))
    }
    let stationArr = []
    if(carpoolingSelfStation[_this.dataKey]){
      stationArr = carpoolingSelfStation[_this.dataKey]
    }
    stationArr.push(data[_this.dataKey])
    carpoolingSelfStation[_this.dataKey] = stationArr
    appStorage.set('carpoolingSelfStation', JSON.stringify(carpoolingSelfStation))
  } else {
    data[_this.dataKey] = {
      longitude: value.point.lng,
      latitude: value.point.lat,
      name: value.title,
      rank: 1
    };
  }

  if(_this.dataKey === 'address1') {
    api.userUpdateCommonAddressOne(data[_this.dataKey]).then(res => {
      const data = TOOL.toJson(res.data);
      if (data.resultCode === '0') {
        _this.$router.go(-1)
      } else {
        _this.$store.dispatch('showError', data.resultMsg);
      }
    })
  } else if (_this.dataKey === 'address2'){
    api.userUpdateCommonAddressTwo(data[_this.dataKey]).then(res=> {
      const data = TOOL.toJson(res.data);
      if (data.resultCode === '0') {
        _this.$router.go(-1)
      } else {
        _this.$store.dispatch('showError', data.resultMsg);
      }
    })
  }else{
    appStorage.set(_this.fromPage, JSON.stringify(data));
    if(_this.fromPage === 'carpoolingSelf'){
      _this.$router.go(-2)
    }else{
      _this.$router.go(-1)
    }
  }

}
