export default {
  data () {
    return {
      activityList: [],
      optimalActivity:{}, // 活动
      ticketTotalAmount: 0, // 总票价
      reducedAmount: 0, // 满减金额
      orderCoupons:'',
      orderCouponPrice: 0,
      passengerNum: 0,
      childrenNum: 0,
      adultNum:0,
      ticketAmount: 0,
      showPrice: true,
      activityAndCounponParam: {},
      scoreRule:{},
      salePrice: 0, //减去优惠券和活动后的价格
      integralPrice: 0,
      showScoreDialog:false,
      showPayDialog: false,
      payPassword:'',
      type:'',
      myScore: 0,
    }
  },
  mounted () {
    if(appStorage.get('userInfo')){
      let usrInfo = JSON.parse(appStorage.get('userInfo'));
      this.myScore = usrInfo.points || 0
    }
  },
  methods: {
    /**
     * 查询车票保险信息
     */
    insurancePlanTypeFind (price) {
      //票价小于等于1元时不能购买保险，则乘客保险选项设为不选
      if (price < 1) {
        this.orderData.insureTypeId = ''
        this.orderData.totalPrem = 0
        return
      }
      this.$store.commit('UPDATE_LOADING', true)
      api.insurancePlanTypeFind({
        price: price
      }).then(res => {
        const data = TOOL.toJson(res.data)
        this.$store.commit('UPDATE_LOADING', false)
        if (data.resultCode === '0') {
          let len = data.resultData.length
          if (len > 0) {
            if(this.ticketInfo && this.ticketInfo.productTypeLevelTwo === 'CITY_EXPRESS_BUS'){
              this.orderData.insureTypeId = ''
              this.orderData.totalPrem = 0
            }else{
              let insure = data.resultData[len - 1];
              this.orderData.insureTypeId = insure.id
              this.orderData.totalPrem = insure.totalPrem
            }
          }

          //选择保险后赋值
          if (appStorage.get(this.pageRouter)) {
            let localData = JSON.parse(appStorage.get(this.pageRouter))
            if(typeof localData.insureTypeId !== 'undefined'){
              this.orderData.insureTypeId = localData.insureTypeId
              this.orderData.totalPrem = localData.totalPrem
            }

          }
        } else {
          this.$store.dispatch('showError', data.resultMsg);
        }
      })
    },

    setPassengerInsure () {
      if(this.orderData.insureTypeId){
        for (let i in this.orderData.passengers) {
          if (this.orderData.passengers.hasOwnProperty(i)) {
            this.orderData.passengers[i].buyInsurance = true
          }
        }

        if(this.orderData.children){
          for (let i in this.orderData.children) {
            if (this.orderData.children.hasOwnProperty(i)) {
              this.orderData.children[i].buyInsurance = true
            }
          }
        }
      }
    },

    checkActivity () {
      this.showPrice = false
      this.orderData.useActivity = !this.orderData.useActivity
      if(!this.orderData.useActivity){
        this.reducedAmount = 0;
        this.orderData.discountInfo.activityId = ''
      }else{
        this.getActivity()
      }
      this.orderCouponPrice = 0
      this.wxUserCouponFindOrderCoupon(this.orderData.useActivity)
    },

    changeActivity (optimalActivity) {
      this.optimalActivity = optimalActivity
      this.getActivity(true)
      this.orderCouponPrice = 0
      this.wxUserCouponFindOrderCoupon(this.orderData.useActivity)
    },

    /**
     * 查询最优活动
     */
    getOptimalActivity () {
      this.reducedAmount = 0
      this.orderCouponPrice = 0
      this.orderData.discountInfo.userCouponId = ''
      this.orderData.discountInfo.activityId = ''

      if(!this.passengerNum){
        this.showPrice = true
        return
      }
      api.getOptimalActivity({
        [this.activityAndCounponParam.type]: this.activityAndCounponParam.id,
        productTypeLevelOne: this.activityAndCounponParam.productTypeLevelOne,
        passengerNum: this.passengerNum,
        ticketAmount: this.ticketAmount,
        serviceCity: this.activityAndCounponParam.serviceCity,
        ticketTotalAmount: this.ticketTotalAmount,
        startupTime: this.activityAndCounponParam.startupTime,
      }).then(res => {
        const data = TOOL.toJson(res.data)
        if (data.resultCode === '0') {
          this.activityList = data.resultData.activityList || []

          let localData = {}
          if (appStorage.get(this.pageRouter)) {
            localData = JSON.parse(appStorage.get(this.pageRouter))
          }
          if(localData.discountInfo && localData.discountInfo.activityId){
            this.activityList.map((x) => {
              if(x.id === localData.discountInfo.activityId){
                this.optimalActivity = x
              }
            })
          }else{
            this.optimalActivity = data.resultData.optimalActivity || {}
          }
          this.getActivity()
          this.wxUserCouponFindOrderCoupon()
        } else {
          this.$store.dispatch('showError', data.resultMsg);
        }
      })
    },

    getActivity (isChange) {
      // 更换活动后优惠金额清零
      if(isChange){
        this.reducedAmount = 0
      }
      if(this.optimalActivity.id && this.orderData.useActivity){
        this.orderData.discountInfo.activityId = this.optimalActivity.id
        let preferentialWays = this.optimalActivity.preferentialWays
        let len = preferentialWays.length
        for(let i = 0; i < len; i++){
          if(preferentialWays[i].type === 2){
            if(preferentialWays[i].fullAmount &&
              this.ticketTotalAmount >= preferentialWays[i].fullAmount &&
              this.ticketTotalAmount > preferentialWays[i].reducedAmount &&
              this.reducedAmount < preferentialWays[i].reducedAmount){
              this.reducedAmount = preferentialWays[i].reducedAmount
            }else if(preferentialWays[i].fullPeople && this.passengerNum >= preferentialWays[i].fullPeople){
              let freePeopleAmount = this.ticketAmount * preferentialWays[i].freePeopleNum
              if(this.ticketTotalAmount >= freePeopleAmount && this.reducedAmount < freePeopleAmount){
                this.reducedAmount = freePeopleAmount
              }
            }else if(!preferentialWays[i].fullAmount && !preferentialWays[i].fullPeople) {
              if(this.ticketTotalAmount > preferentialWays[i].reducedAmount && this.reducedAmount < preferentialWays[i].reducedAmount){
                this.reducedAmount = preferentialWays[i].reducedAmount
              }
            }
          }
        }
      }
    },

    /**
     * 查询优惠券
     */
    wxUserCouponFindOrderCoupon (resetScore) {
      if(!this.activityAndCounponParam.startupTime){
        this.showPrice = true
        return
      }
      let counponChangeTag = resetScore
      let startupTime = TOOL.newGetDate({date: this.activityAndCounponParam.startupTime, type: 'holeDate'})
      api.wxUserCouponFindOrderCoupon({
        [this.activityAndCounponParam.type]: this.activityAndCounponParam.id,
        productTypeLevelOne: this.activityAndCounponParam.productTypeLevelOne,
        startupTime: startupTime,
        passengerNum: this.passengerNum,
        ticketAmount: this.ticketAmount,
        ticketTotalAmount: this.ticketTotalAmount,
        activityId: this.orderData.discountInfo.activityId,
      }).then(res => {
        const data = TOOL.toJson(res.data)
        if (data.resultCode === '0') {
          if(data.resultData.length){
            this.orderCoupons = data.resultData
            if(this.orderCoupons.length){
              let price = this.ticketTotalAmount - this.reducedAmount
              for(let i = 0; i < this.orderCoupons.length; i++){
                if (appStorage.get(this.pageRouter)) {
                  let localData = JSON.parse(appStorage.get(this.pageRouter))
                  if(localData.discountInfo.userCouponId && localData.discountInfo.userCouponId === this.orderCoupons[i].id){
                    this.checkCoupon(price, this.orderCoupons[i], true)
                    counponChangeTag = true
                    break
                  } else {
                    this.checkCoupon(price, this.orderCoupons[i])
                  }
                  counponChangeTag = true
                } else {
                  this.checkCoupon(price, this.orderCoupons[i])
                }
              }
            }
          }else{
            this.orderCouponPrice = 0
            this.orderData.discountInfo.userCouponId = ''
          }
          this.getExchangeRule(counponChangeTag)
          this.showPrice = true
        } else {
          this.$store.dispatch('showError', data.resultMsg);
        }
      })
    },

    checkCoupon (price, orderCoupon, flag) {
      if(price >= orderCoupon.amount){
        if(flag){
          this.orderCouponPrice = orderCoupon.amount
          this.orderData.discountInfo.userCouponId = orderCoupon.id
        } else if(this.orderCouponPrice < orderCoupon.amount){
          this.orderCouponPrice = orderCoupon.amount
          this.orderData.discountInfo.userCouponId = orderCoupon.id
        }
      }
    },

    getExchangeRule (resetScore) {
      api.getExchangeRule({
        productId: this.activityAndCounponParam.productId,
        productTypeLevelOne: this.activityAndCounponParam.productTypeLevelOne,
        productTypeLevelTwo: this.activityAndCounponParam.productTypeLevelTwo,
        exchangeType: 1
      }).then(res => {
        const data = TOOL.toJson(res.data)
        if (data.resultCode === '0') {
          this.scoreRule = data.resultData;

          let localData = {}
          if (appStorage.get(this.pageRouter)) {
            localData = JSON.parse(appStorage.get(this.pageRouter))
          }

          if(localData.integralExId && !resetScore){
            this.orderData.integralExId = localData.integralExId
            this.orderData.integralPrice = localData.integralPrice
            this.orderData.useScore = true
          }else{
            this.resetScore()
          }


          this.salePrice = this.ticketTotalAmount - this.reducedAmount - this.orderCouponPrice;

          let interalPrice = this.orderData.integralPrice * this.scoreRule.exchangeAmount / this.scoreRule.baseUseNum
          if(this.salePrice <= interalPrice){
            this.resetScore()
          }
        } else {
          this.$store.dispatch('showError', data.resultMsg);
        }
      })
    },

    resetScore () {
      this.score = 0
      this.orderData.integralExId = ''
      this.orderData.integralPrice = 0
      this.orderData.useScore = false
    },

    checkScore (value, length) {
      this.orderData.useScore = !this.orderData.useScore
      if(this.orderData.useScore){
        this.orderData.integralExId = this.scoreRule.id
        this.orderData.integralPrice = this.score || this.scoreRule.baseUseNum;
      }else{
        this.orderData.integralExId = ''
        this.orderData.integralPrice = 0
        this.integralPrice = 0
      }
    },

    changeScore (score) {
      this.score = score;
      this.orderData.integralPrice = this.score
    },

    showScoreDialogHandle () {
      this.showScoreDialog = true
    },

    hideScoreDialogHandle () {
      this.showScoreDialog = false
    },

    verifyPayPassword (payPassword) {
      this.payPassword = payPassword
      this.$store.commit('UPDATE_LOADING', true)
      api.verifyPayPassword(this.payPassword).then(res => {
        this.$store.commit('UPDATE_LOADING', false)
        const data = TOOL.toJson(res.data)
        if (data.resultCode === '0') {
          this.showPayDialog = false
          let ticketPrice = this.totalPrice
          this.createOrderEvent(ticketPrice, this.type)
        } else {
          this.$store.dispatch('showError', data.resultMsg);
        }
      })
    },

    orderCreateHandel (type) {
      this.type = type
      let validata
      if(type === 'express'){
        validata = this.checkExpressForm()
      }else if(type === 'special'){
        validata = this.checkSpeacilForm()
      }else if(type === 'station'){
        validata = this.checkStationForm()
      }else if(type === 'tour'){
        if (!appStorage.get('X-Auth-Token')) {
          this.disableBtn = false
          this.saveForm()
          TOOL.login()
          return;
        }
        validata = this.checkTourForm()
      }

      if (validata && !validata.valid) {
        this.$store.dispatch('showError', validata.msg);
        return false;
      }

      let ticketPrice = this.totalPrice

      if(this.orderData.integralExId && appStorage.get('X-Auth-Token')){
        let usrInfo = JSON.parse(appStorage.get('userInfo'));
        if(!usrInfo.whetherSetPayPS){
          this.$store.dispatch('showConfirm', {
            title: '支付密码提示',
            confirmText: '立即设置',
            cancelText: '暂不设置',
            content: '使用积分抵现需要输入平台支付密码<br/>您还没有设置支付密码',
            onConfirm: () => {
              this.$router.push({
                name: 'setPayPasswordStep1'
              })
            },
            onCancel: () => {}
          })
        }else{
          if(this.orderData.integralType === 1){
            if(this.myScore >= this.totalPrice){ //用户积分必须大于兑换产品才能下单
              this.showPayDialog = true
            }else{
              this.$store.dispatch('showError', '您的积分不足，当前积分' + this.myScore)
            }
          }else{
            this.showPayDialog = true
          }

        }
      }else{
        this.createOrderEvent(ticketPrice, type)
      }
    },

    checkExpressForm () {
      return TOOL.formValidate([
        {value: this.orderData.onStation.name, emptyTips: '上车站点不能为空'},
        {value: this.orderData.offStation.name, emptyTips: '下车站点不能为空'},
        {value: this.orderData.passengers, emptyTips: '至少添加一个旅客', minlength: 1},
        {value: this.orderData.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
      ]);
    },

    checkSpeacilForm () {
      return TOOL.formValidate([
        {value: this.startTime, emptyTips: '时间不能为空'},
        {value: this.orderData.carType, emptyTips: '车型不能为空'},
        {value: this.orderData.onStation.name, emptyTips: '上车点不能为空'},
        {value: this.orderData.offStation.name, emptyTips: '下车点不能为空'},
        {value: this.orderData.contactTelephone,emptyTips: '手机号码不能为空',regName: 'telephone',regTips: '手机号码格式不正确'},
      ]);
    },

    checkStationForm () {
      return TOOL.formValidate([
        {value: this.orderData.passengers, emptyTips: '至少添加一个旅客',minlength:1},
        {value: this.orderData.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
      ]);
    },

    checkTourForm () {
      return TOOL.formValidate([
        {value: this.orderData.passengers, emptyTips: '至少添加一个旅客',minlength:1},
        {value: this.orderData.skuId, emptyTips: '请选择日期'},
        {value: this.orderData.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
      ]);
    },

    createOrderEvent (ticketPrice, type) {
      let orderData = Object.assign({}, this.orderData)
      if(type === 'express'){
        this.setPassengerInsure()
        delete this.orderData.totalPrem
        delete this.orderData.useActivity
        delete this.orderData.useScore

        this.orderData.onSiteId = this.orderData.onStation.siteId
        this.orderData.offSiteId = this.orderData.offStation.siteId
        this.orderData.onStation = this.orderData.onStation.name
        this.orderData.offStation = this.orderData.offStation.name

      }else if(type === 'special'){
        delete this.orderData.useActivity
        delete this.orderData.useScore
        this.orderData.startTime = TOOL.newGetDate({date: this.startTime, type: 'holeDate'})

      }else if(type === 'station'){
        this.setPassengerInsure()
        delete this.orderData.totalPrem
        delete this.orderData.useActivity
        delete this.orderData.useScore
      }else if(type === 'tour'){
        this.setPassengerInsure()

        delete this.orderData.totalPrem
        delete this.orderData.startupTime
        delete this.orderData.price
        delete this.orderData.childPrice
        delete this.orderData.availableSeats
        delete this.orderData.useActivity
        delete this.orderData.useScore

        //处理儿童乘客和成人乘客数据差异
        let children = this.orderData.children
        for (let i = 0; i < children.length; i++) {
          children[i].childId = children[i].passengerIdCard
          delete children[i].passengerIdCard
          delete children[i].email
          delete children[i].carryKid
        }
        this.orderData.children = children;
      }

      if(!this.isFeeder){
        if (!appStorage.get('X-Auth-Token')) {
          this.saveOrder(this.pageRouter, this.orderData)
          return;
        }
        this.orderCreated(this.pageRouter, orderData)
      }else{
        this.orderData.ticketPrice = ticketPrice
        appStorage.set('feederOrder', JSON.stringify(this.orderData))
        this.$router.push({
          name: 'feeder',
          query: {
            skuId: this.orderData.skuId,
            fromPage: this.pageRouter,
          }
        })
      }
    }



  }
}
