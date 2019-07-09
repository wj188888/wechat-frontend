export default {
  methods: {
    checkIsLogin () {
      if ((!TOOL.browser().weixin) && !appStorage.get('X-Auth-Token')) {
        TOOL.login()
        return false
      }
      return true
    },

    checkAllIsLogin () {
      if (!appStorage.get('X-Auth-Token')) {
        TOOL.login()
        return false
      }
      return true
    },

    saveOrder (pageRouter, order) {
      appStorage.set('orderToSubmit', JSON.stringify(order))
      appStorage.set('fromPage', JSON.stringify({name: pageRouter}))
      TOOL.login()
    },


  }
}
