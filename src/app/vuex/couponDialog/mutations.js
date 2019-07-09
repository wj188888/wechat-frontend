export default {
  ['UPDATE_DIALOG'] (state, status) {
    state.showCouponDialog = status
  },
  ['UPDATE_COUPON'] (state, status) {
    state.couponDatas = status
  }
}
