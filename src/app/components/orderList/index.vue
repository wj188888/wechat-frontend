<template>
  <div>
    <ul class="top-flex-nav line line-x-b">
      <li v-for="tab in tabBar" :class="{'active': searchKeys.status == tab.status}" @click="changeTab(tab)">
        <a v-text="tab.name"></a>
      </li>
    </ul>
    <div class="order-list-box" v-show="payLists.length > 0">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="ticket-order">
          <ul class="order-list">
            <li class="line line-x" v-for="(payList, index) in payLists">
              <div class="hd clearfix" v-if="payList.productTypeLevelTwo !== 'GOODS'">
                <p class="pull-left">
                  <span class="product-type line line-y-r">{{ payList.productTypeLevelTwo | getProductTwoName }}</span>
                  <span class="startup-time">
                    {{ payList.startupTime | formatDate('monthDayHour') }}
                    <span v-if="payList.productTypeLevelTwo !== 'CAR_RENTAL'">出发</span>
                    <span v-if="payList.productTypeLevelTwo === 'CAR_RENTAL'">取车</span>
                  </span>
                </p>
                
                <p class="pull-right">
                  <span v-if="payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'"
                        :class="{'text-gray': payList.status === 2 || payList.status === 3 || payList.status === 6}">
                    {{payList.status | getCityCarpoolOrderStatusText(payList.carpoolStatus, payList.consumeType)}}
                  </span>
                  <span v-else :class="{'text-gray': payList.carPoolStatus === 4 || payList.carPoolStatus === 5}">
                    {{payList.status | getOrderStatusText(payList.productTypeLevelOne, payList.tripType, payList.chStatus)}}
                  </span>
                </p>
              </div>

              <div class="hd clearfix" v-if="payList.productTypeLevelTwo === 'GOODS'">
                <P class="pull-left">
                  {{ payList.productTypeLevelTwo | getProductTwoName }}
                </P>
                <P class="pull-right">
                  {{payList.status | getGoodsOrderStatusText(payList.productTypeLevelOne)}}
                </P>
              </div>

              <div class="bd line line-x" v-if="payList.productTypeLevelTwo === 'GOODS'" @click="jumpToOrderDetail(payList)">
                <div class="order-station"
                     :class="{'mar-b-0':!payList.propertyMap}"
                >
                  {{payList.name}}
                </div>
                <div v-if="payList.propertyMap">
                  <div class="goods__property" v-for="(key, val) in payList.propertyMap">
                    {{val}}：{{key}}
                  </div>
                </div>


                <p class="num">
                  &times;<em>{{payList.num}}</em>
                </p>
              </div>

              <div class="bd line line-x" v-if="payList.productTypeLevelTwo !== 'GOODS'" @click="jumpToOrderDetail(payList)">
                <div class="order-station">
                  <i class="circle-bg-start">始</i>
                  <span class="rental-address-limit">{{ payList.aAddress | getAddressStation(payList.onStation) }}</span>
                  <span v-if="payList.productTypeLevelTwo === 'CAR_RENTAL'">（上门取）</span>
                  <p class="pad-l-50 c-f-4c4c4c f-s-24 mar-t-10"
                     v-if="payList.productTypeLevelTwo === 'CAR_RENTAL'">
                    &nbsp;&nbsp;{{ payList.startupTime | formatDate('monthDayHour') }} 取车</p>
                </div>
                <div class="order-station off-station">
                  <i class="circle-bg-end" v-if="!payList.terminal || payList.offStation.name === payList.terminal">终</i>
                  <i class="circle-bg-station" v-else>过</i>
                  <span class="rental-address-limit">{{ payList.bAddress | getAddressStation(payList.offStation) }}</span>
                  <span v-if="payList.productTypeLevelTwo === 'CAR_RENTAL'">（上门还）</span>
                  <p class="pad-l-50 c-f-4c4c4c f-s-24 mar-t-10"
                     v-if="payList.productTypeLevelTwo === 'CAR_RENTAL'">
                    &nbsp;&nbsp;{{ payList.endTime | formatDate('monthDayHour') }} 还车</p>
                  <p class="c-f-4c4c4c f-s-24 mar-t-10 order-feeder-text" v-if="payList.serviceTypes && payList.serviceTypes.length > 0">
                    本订单含<span v-for="x in payList.serviceTypes">{{x !== 1 ? '接' : '送'}}</span>站服务
                  </p>
                </div>
                <P class="num" v-if="payList.productTypeLevelOne !== 'CAR_HAILING' && payList.productTypeLevelOne !== 'TAXI' && payList.productTypeLevelOne !== 'CAR_RENTAL'">&times;<em>{{payList.ticketNum }}</em></P>
              </div>

              <div class="ft clearfix">
                <p class="my-price pull-left" v-if="payList.actualPayment > 0 && payList.integralType !== 0">
                  <span class="tol">总计&nbsp;</span>
                  <!--<span class="tol-prc">¥ <em>{{(payList.actualPayment + payList.prePayAmount).toFixed(2)}}</em></span>-->
                  <span class="tol-prc">¥ <em>{{(payList.actualPayment).toFixed(2)}}</em></span>
                </p>
                <p class="my-price pull-left" v-if="payList.integralType === 0">
                  <span class="tol">总计&nbsp;</span>
                  <span class="tol-prc">
                    <em v-if="payList.integralPrice">{{payList.integralPrice}}</em>
                    {{payList.integralPrice ? ' 积分' : ''}}
                    {{payList.integralPrice && payList.actualPayment ? ' + ' : ''}}
                    {{payList.actualPayment ? ' ¥' : ''}}
                    <em>{{ payList.actualPayment ? payList.actualPayment : ''}}</em>
                  </span>
                </p>

                <div class="pull-right">
                  <a class="button button-small button-black-empty line line-box radius-box pull-left"
                     v-if="payList.status !== 5 && (payList.productTypeLevelOne !== 'CAR_HAILING' || payList.productTypeLevelOne !== 'TAXI')"
                     @click="jumpToOrderDetail(payList)">查看详情</a>
                  
                 <!-- <a class="button button-small button-primary pull-left"
                         v-if="payList.status === 0 &&
      (payList.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS' || (payList.consumeType === 0 && payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS')) "
                         :class="{'disabled': disableBtn && listIndex === index}"
                         @click="payMoney(payList, index)">支付</a>-->
                  <a class="button button-small button-primary pull-left"
                     v-if="payList.status === 0 &&
      (payList.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS' || (payList.consumeType === 0 && payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS') || (payList.consumeType === 1 && payList.carpoolStatus === 3 && payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS')) "
                     :class="{'disabled': disableBtn && listIndex === index}"
                     @click="payMoneyConfirm(payList, index)">支付</a>
                  
                  <a class="button button-small button-primary pull-left"
                     v-if="payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && payList.carpoolStatus === 2 && payList.status !== 11"
                     @click="carpoolOrderConfirm(payList, index)">确认上车</a>
                  
                  <a class="button button-small button-black-empty line line-box radius-box pull-left"
                     v-if="payList.status === 4 && payList.productTypeLevelOne !== 'CUSTOM_BUS'&& payList.productTypeLevelOne !== 'GOODS'"
                     @click="jumpToEval(payList.id, payList.productTypeLevelOne)"
                  >前去评价</a>
                  
                  <a class="button button-small button-black-empty line line-box radius-box pull-left"
                     v-if="payList.status === 5 && payList.productTypeLevelOne !== 'CUSTOM_BUS'"
                     @click="jumpToEvalDetail(payList.id, payList.productTypeLevelOne)">查看评价</a>
                
                </div>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
    <div class="city-no-bus" v-if="payLists.length === 0">
      <img src="../../../assets/lose.png">
      <p v-text="emptyTips"></p>
    </div>
  </div>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import Scroll from 'components/betterScroll/scroll/scroll'
  
  export default {
    components: {
      MainBox,
      Scroll,
    },
    data () {
      return {
        title: this.$route.meta.title,
//      未付款0:未付款, 未出行1:已付款, 2:已失效 3:已退款 (未评价4:已出行) (已评价5:已评价) 6:已过期
//      0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
        tabBar: [
          {name: '全部', status: -1, emptyTips: '暂无订单'},
          {name: '未付款', status: 0, emptyTips: '暂无未支付订单'},
          {name: '待出行', status: 1, emptyTips: '暂无未出行订单'},
          {name: '待评价', status: 4, emptyTips: '暂无未评价订单'},
          {name: '已评价', status: 5, emptyTips: '暂无已评价订单'}
        ],
        totalPage: '',
        searchKeys: {
          status: -1,
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        payLists: [],
        emptyTips: '暂无订单',
        disableBtn: false,
        listIndex: '',
        detailData:{}
      }
    },
    watch: {
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.searchKeys.pageNo = 0
        this.searchKeys.status = this.$route.query.status
        this.onPullingUp()
      },
      
      /**
       * tab切换
       */
      changeTab (tab) {
        this.emptyTips = tab.emptyTips
        let orderListRouter = TOOL.getOrderListPageRouter()
        this.$router.replace({
          name: orderListRouter,
          query: {
            status: tab.status
          }
        })
      },
      
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.payLists = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
  
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.orderFind(this.searchKeys).then(res=>{
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.totalPage = data.resultData.totalPages
            this.payLists = this.payLists.concat(data.resultData.content)
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
  
      /**
       * 确认上车
       */
      carpoolOrderConfirm (payList, index) {
        if(payList.consumeType === 0){
          this.confirmToBus(payList)
        }else{
            if(payList.status === 1 && payList.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS'){
                this.confirmToBus(payList)
            }else{
                if(payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && payList.carpoolStatus ===2){
                    this.orderDetailById('confirmToBus',payList,index);

//                    this.confirmToBus(payList)
                }else if(payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && payList.carpoolStatus ===3){
                  this.orderDetailById('payMoney',payList,index);
//                    this.payMoney(payList, index)

                }else{
                    this.payMoney(payList, index)
                }
            }
          /*if(payList.status === 1){
            this.confirmToBus(payList)
          }else{
            this.payMoney(payList, index)
          }*/
        }
      },

      /**
       * 查找订单详情
       */
      orderDetailById (type,payList,index) {
        this.$store.commit('UPDATE_LOADING', true)
        api.orderDetailById({
          orderId: payList.id
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.detailData = Object.assign(this.detailData, data.resultData);
            if(this.detailData.addAmountFlag === 1 && this.detailData.addAmount > 0 && this.firstConFun(payList.id)){
              this.confirmAddAmount(payList.id)
            }else{
              if(type && type === 'confirmToBus'){
                this.confirmToBus(payList);
              }else if(type && type === 'payMoney'){
                this.payMoney(payList, index)
              }
            }

          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /*
       * 判断是否是第一次弹窗提醒
       * */
      firstConFun (id) {
        let firstConfirm = true;
        if(appStorage.get('orderCache')){
          for (let x in JSON.parse(appStorage.get('orderCache'))){
            if(x ===  id){
              firstConfirm = false;
            }
          }
        }
        return firstConfirm;
      },

      /*
       * 确认加价弹窗提示
       * */
      confirmAddAmount (id) {
        let content = '司机已经标注了您' + this.detailData.addAmountReason + ',为您修改了价格，请在下车前完成支付。';
        this.$store.dispatch('showAlert', {
          title: '司机调价通知',
          buttonText: '知道了',
          content: content,
          onHide: () => {
            if(appStorage.get('orderCache')){
              this.orderCacheObj = JSON.parse(appStorage.get('orderCache'))
            }else{
              this.orderCacheObj = {};
            }
            this.orderCacheObj[id] = true;
            appStorage.set('orderCache', JSON.stringify(this.orderCacheObj));
          }
        })
      },
      
      confirmToBus (payList) {
        this.$store.dispatch('showConfirm', {
          title: '温馨提醒',
          content: '是否确定已经上车？',
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.carpoolOrderConfirm(payList.id).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode === '0') {
                this.$store.dispatch('showSuccess', '您已确认上车')
                this.initialize();
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          },
          onCancel: () => {
          }
        })
      },

      /**
       *  订单支付确认
       */
      payMoneyConfirm (payList, index) {
        if(payList.productTypeLevelTwo === 'CITY_CAR_POOL_BUS' && payList.carpoolStatus ===3 && payList.consumeType === 1){
            this.orderDetailById('payMoney',payList,index);
          }else{
          this.payMoney(payList, index);
        }
      },
      
      /**
       *  订单支付
       */
      payMoney (payList, index) {
        this.listIndex = index
        if(payList.productTypeLevelOne === 'TAXI'){
          this.$router.push({
            name: 'carhailingOrderDetail',
            query:{
              orderId: payList.id,
              productTypeLevelOne: payList.productTypeLevelOne
            }
          })
        }else{
          if(this.disableBtn) return
          this.disableBtn = true
          interfaceApi.wxPay({
            tradeNo: payList.id,
            productTypeLevelOne: payList.productTypeLevelOne,
            payType: payList.payType,
            wxPaySuccess: TOOL.wxPaySuccess,
            wxPayFail: TOOL.wxPayFail,
            price: payList.actualPayment
          })
          setTimeout(()=>{
            this.disableBtn = false
          },1000)
        }
      },
      
      jumpToDetail (orderId) {
        this.$router.push({
          name: 'orderDetail',
          query: {
            orderId: orderId
          }
        })
      },
      
      jumpToRentDetail (orderId) {
        this.$router.push({
          name: 'rentOrderDetail',
          query: {
            orderId: orderId
          }
        })
      },
      
      jumpToOrderWait (productTypeLevelOne, id) {
        this.$router.push({
          name: 'orderWait',
          query: {
            productTypeLevelOne: productTypeLevelOne,
            id: id
          }
        })
      },
      
      /**
       * 跳转订单详情页面
       * 注： 如是线路包车，则需根据拼团状态判断跳转页面
       */
      jumpToOrderDetail (orderData) {
        let orderId = orderData.id
        let productTypeLevelOne = orderData.productTypeLevelOne
        let productTypeLevelTwo = orderData.productTypeLevelTwo
        let status = orderData.status
        let enquiryId = orderData.enquiryId
        let carPoolStatus = orderData.carPoolStatus
        if (productTypeLevelOne === 'LINE_BUS') {
          api.orderFindLineStatus({
            id: orderId,
            productTypeLevelOne: productTypeLevelOne
          }).then(res=>{
              const data = TOOL.toJson(res.data)
              if (data.resultCode === '0') {
                let carPoolStatus = data.resultData.carPoolStatus
                let charterStatus = data.resultData.charterStatus
                let teamExpireTime = data.resultData.teamExpireTime
                let firmResponseEndTime = data.resultData.firmResponseEndTime
                let skuId = data.resultData.skuId
                let nowTime = TOOL.newGetDate({type: 'holeDate'})
                if (productTypeLevelTwo === 'LINE_CAR_POOL_BUS') {
                  /**
                   * carPoolStatus(拼车状态) 0.未付款 1.未成团 2.未安排 3.已安排 4.已失效 5.已取消
                   * teamExpireTime(拼车有效时间)
                   * firmResponseEndTime(企业响应截止时间，包车或拼车成团后，企业未及时响应，需要全额退款)
                   * 订单状态 0:未付款, 1:已付款, 2:已失效 3:已退款 4:已出行 5:已评价 6:已过期
                   */
                  switch (carPoolStatus) {
                    case 1:
                      //未过拼车有效时间，等待拼团成功
                      if (TOOL.dateCompare(nowTime, teamExpireTime, 'datetime') <= 0) {
                        this.$router.push({
                          name: 'carpoolingSuccess',
                          query: {
                            skuId: skuId
                          }
                        })
                      } else {
                        this.jumpToDetail(orderId)
                      }
                      break;
                    case 2:
                      //未过企业响应截止时间，等待配车
                      if (status === 1 && TOOL.dateCompare(nowTime, firmResponseEndTime, 'datetime') <= 0) {
                        this.jumpToOrderWait(productTypeLevelOne, skuId)
                      } else {
                        this.jumpToDetail(orderId)
                      }
                      break;
                    case 5:
                      //订单已付款状态下企业未配车则跳到配车失败等待退款
                      if (status === 1) {
                        this.$router.push({name: 'carpoolingWaitFail'})
                      } else {
                        this.jumpToDetail(orderId)
                      }
                      break;
                    default:
                      this.jumpToDetail(orderId)
                  }
                } else {
                  /**
                   * charterStatus(包车状态) 0.未付款 1.未安排，2.已安排，3.已失效，4.已取消
                   * teamExpireTime(拼车有效时间)
                   * firmResponseEndTime(企业响应截止时间，包车或拼车成团后，企业未及时响应，需要全额退款)
                   * 订单状态 0:未付款, 1:已付款, 2:已失效 3:已退款 4:已出行 5:已评价 6:已过期
                   */
                  if (charterStatus === 1) {
                    //未过企业响应截止时间，等待配车
                    if (TOOL.dateCompare(nowTime, firmResponseEndTime, 'datetime') <= 0) {
                      this.jumpToOrderWait(productTypeLevelOne, skuId)
                    } else {
                      this.jumpToDetail(orderId)
                    }
                  } else if (charterStatus === 4) {
                    //订单已付款状态下企业未配车则跳到配车失败等待退款
                    if (status === 1) {
                      this.$router.push({name: 'carpoolingWaitFail'})
                    } else {
                      this.jumpToDetail(orderId)
                    }
                  } else {
                    this.jumpToDetail(orderId)
                  }
                }
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            }
          )
        } else if (productTypeLevelOne === 'CUSTOM_BUS') {
          /**
           * (询价状态) 0报价中, 1已报价, 2已收款, 3已失效, 4已取消, 5已服务, 6已安排
           * 订单状态 0:未付款, 1:已付款, 2:已失效 3:已退款 4:已出行 5:已评价 6:已过期
           */
          api.enquiryFindAllStatus(enquiryId).then(res=> {
            const data = TOOL.toJson(res.data)
            if (data.resultCode === '0'){
              let charterStatus = data.resultData.status
              let enquiryId = data.resultData.enquiryId
              if(status === 1 && charterStatus === 2){
                this.jumpToOrderWait(productTypeLevelOne, enquiryId)
              }else{
                this.jumpToDetail(orderId)
              }
            }
          })
        } else if (productTypeLevelOne === 'CAR_HAILING' || productTypeLevelOne === 'TAXI'){
          //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
          if(orderData.chStatus === 1){
            if(orderData.tripType){
              this.$router.push({
                name: 'waitForTime',
                query: {
                  orderId: orderId,
                  productTypeLevelOne: productTypeLevelOne
                }
              })
            }else{
              this.$router.push({
                name: 'holdForCar',
                query: {
                  orderId: orderId,
                  productTypeLevelOne: productTypeLevelOne
                }
              })
            }
          }else if (orderData.chStatus === 2 || orderData.chStatus === 3 || orderData.chStatus === 10){
            this.$router.push({
              name: 'holdForCar',
              query: {
                orderId: orderId,
                productTypeLevelOne: productTypeLevelOne
              }
            })
          }else{
            this.$router.push({
              name: 'carhailingOrderDetail',
              query: {
                orderId: orderId,
                productTypeLevelOne: productTypeLevelOne
              }
            })
          }
        }else if(productTypeLevelTwo === 'CAR_RENTAL') {
          this.jumpToRentDetail(orderId)
        }else if(productTypeLevelTwo === 'GOODS') {
            this.$router.push({
                name: 'shopOrderDetail',
                query: {
                    orderId: orderId
                }
            })
        }else{
          this.jumpToDetail(orderId)
        }
      },
      
      jumpToEval(orderId, productTypeLevelOne) {
        if(productTypeLevelOne === 'CAR_RENTAL'){
          this.$router.push({
            name:'rentOrderEval',
            query: {
              orderId: orderId,
              productTypeLevelOne: productTypeLevelOne
            }
          })
        }else{
          this.$router.push({
            name:'orderEval',
            query: {
              orderId: orderId,
              productTypeLevelOne: productTypeLevelOne
            }
          })
        }
      },
      
      jumpToEvalDetail (orderId, productTypeLevelOne) {
        if(productTypeLevelOne === 'CAR_HAILING' || productTypeLevelOne === 'TAXI'){
          this.$router.push({
            name:'carhailingOrderDetail',
            query: {
              orderId: orderId,
              productTypeLevelOne: productTypeLevelOne
            }
          })
        } else if(productTypeLevelOne == 'CAR_RENTAL') {
          this.$router.push({
            name:'rentOrderEval',
            query: {
              orderId: orderId,
              productTypeLevelOne: productTypeLevelOne,
              webType: 'watch'
            }
          })
        }else{
          this.$router.push({
            name:'orderEval',
            query: {
              orderId: orderId,
              productTypeLevelOne: productTypeLevelOne,
              webType: 'watch'
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .order-list-box {
    position: absolute;
    top: 86px;
    bottom: 0;
    width: 100%;
  }
  
  .top-flex-nav li {
    padding: 16px 12px;
  }
  .pad-l-50 {
    padding-left: 50px;
  }
  .rental-address-limit {
    display: inline-block;
    vertical-align: middle;
    max-width: 400px;
    /*height: 32px;*/
    margin-top: -2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .order-feeder-text{
    position: relative;
    padding-left:60px;
  }
  .goods__property {
    padding: 0 80px 20px 0;
    font-size: 28px;
    line-height: 1.2;
    /*-webkit-text-size-adjust: none;*/
    color: #999;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>