export default {
  UPDATE_LOADING (state, status) {
    state.showLoading = status
  },
  
  UPDATE_LOADING_TEXT (state, status) {
    state.text = status || '数据加载中'
  }
}
