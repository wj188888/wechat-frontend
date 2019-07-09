export default {
  UPDATE_ADDRESS (state, addComp) {
    let cityName = addComp.city
    if (cityName) {
      if (cityName.indexOf('市') > -1) {
        cityName = cityName.substr(0, cityName.length - 1)
      }
      state.appCity = cityName
      state.appAddress = addComp
    }
  },
  FAIL_ADDRESS (state, status) {
    state.appAddress = status
  }
}
