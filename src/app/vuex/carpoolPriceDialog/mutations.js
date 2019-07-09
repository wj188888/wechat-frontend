export default {
  ['UPDATE_CARPOOLPRICE_DIALOG'] (state, status) {
    state.showCarpoolPriceDialog = status
  },
  ['UPDATE_CARPOOLPRICE'] (state, status) {
    state.carpoolPriceDatas = status
  }
}
