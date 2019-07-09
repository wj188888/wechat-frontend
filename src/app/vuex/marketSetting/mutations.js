export default {
  ['UPDATE_FIXMARKET'] (state, status) {
    state.showFixMarket = status
  },
  ['UPDATE_SHAREURL'] (state, status) {
    state.showShareUrl = status
  },
  ['UPDATE_MARKETSETTING'] (state, status) {
    state.marketSettingData = status
  }
}
