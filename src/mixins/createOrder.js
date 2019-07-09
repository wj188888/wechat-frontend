export default {
  methods: {
    orderCreated (pageRouter, orderData, isLogin) {
      this.disableBtn = true
      this.$store.commit('UPDATE_LOADING', true)
      let resource
      let resourceArr = TOOL.orderCreateResource

      for(let i = 0; i < resourceArr.length; i++){
        if(resourceArr[i].productTypeLevelTwo && appStorage.get('marketerId') && resourceArr[i].productTypeLevelTwo === appStorage.get('marketerProductTypeLevelTwo')){
          this.orderData.marketerId = appStorage.get('marketerId')
        }
        if(resourceArr[i].pageRouter === pageRouter){
          resource = resourceArr[i].resource
          break
        }
      }
      
      this.orderData.orderSource = TOOL.browserType()
      api[resource](this.orderData).then(res => {
        const result = TOOL.toJson(res.data)
        this.$store.commit('UPDATE_LOADING', false)
        if (result.resultCode === '0') {
          if(typeof this.deleteForm === 'function'){
            this.deleteForm()
          }
          appStorage.remove('feederOrder')
          appStorage.remove('needInvoice')
          this._orderSuccess(result.resultData, pageRouter)
        } else {
          this.disableBtn = false
          if(orderData){
            this.orderData = Object.assign({}, orderData)
          }
          this.orderData.formId = TOOL.getTimeStamp()
          this.$store.dispatch('showError', result.resultMsg)
          if(isLogin){
            this.$router.go(-1)
          }
        }
      })
    },

    _orderSuccess (orderId, pageRouter) {
      appStorage.remove('orderToSubmit')
      appStorage.remove('fromPage')
      if(pageRouter === 'carHailingSearch'){
        this.$router.push({
          name: 'waitForCar',
          query:{
            orderId: orderId,
            productTypeLevelOne: 'CAR_HAILING'
          }
        })
      }else if(pageRouter === 'taxiSearch'){
        this.$router.push({
          name: 'waitForCar',
          query:{
            orderId: orderId,
            productTypeLevelOne: 'TAXI'
          }
        })
      }else if(pageRouter === 'porderWrite') {
        this.$router.replace({
          name: 'orderDetail',
          query: {
            orderId: orderId
          }
        })
      }else{
        this.$router.push({
          name: 'orderDetail',
          query: {
            orderId: orderId
          }
        })
      }
    },

  }
}

