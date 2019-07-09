<template>
  <main-box :title="title">
    <follow-us :is-follow="false" v-show="isShare"></follow-us>
    <div class="pay-success line line-x-b" v-show="!isShare">
      <span class="success-img"></span>
      <span>支付成功</span>
      <span class="c-f-primary float-r f-s-money">{{orderData.actualPayment | formatPrice}}</span>
    </div>

    <order-base-info :data="orderData" v-if="orderData.productTypeLevelTwo !== 'CAR_RENTAL'&&orderData.productTypeLevelTwo !== 'GOODS'"></order-base-info>

    <div class="shop__properties" v-if="orderData.productTypeLevelTwo === 'GOODS'">
      <p class="shop__name">{{ orderData.productTypeLevelTwo | getProductTwoName }}</p>
      <p class="shop__name"
         :class="{'pad-b-0':!orderData.propertyMap}"
      >{{orderData.name}}</p>
      <div v-if="orderData.propertyMap">
        <p class="shop__properties-item" v-for="(key, val) of orderData.propertyMap">
          {{val}}：{{key}}
        </p>
      </div>
    </div>

    <div class="group-eval mar-b-20 line line-x-t" v-show="orderData.productTypeLevelTwo === 'CITY_CAR_POOL_BUS'">
      <div>送客到家</div>
      <div>时间自定</div>
      <div>价格优惠</div>
      <div>体验极佳</div>
    </div>

    <rent-address :detailData="orderData" v-if="orderData.productTypeLevelTwo === 'CAR_RENTAL'"></rent-address>

    <!--* 订单状态 -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）-->
    <!--* 拼车状态 0.未付款 1.未成团，2.未安排，3.已安排，4.已失效（过期未支付），5.已取消（司机或企业超时未响应）-->
    <div class="pay-btn-box"
         v-if="orderData.productTypeLevelTwo !== 'CAR_RENTAL'">
      <!--<a class="btn-pay-share" :class="{'mar-r-0': isShare}" @click="showShare = true">分享给我的朋友</a>-->
      <a class="btn-pay-detail" @click="jumpToOrderDetail">查看订单详情</a>
    </div>


    <div slot="footer">
      <share-modal :show="showShare" @closeShare="showShare = false"></share-modal>
    </div>

  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index'
  import FollowUs from 'components/followUs/index'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index'
  import ShareModal from 'appComponents/shareModal/index'
  import RentAddress from 'appComponents/rentAddress/index'

  export default {
    components: {
      MainBox,
      OrderBaseInfo,
      FollowUs,
      ShareModal,
      RentAddress
    },
    data () {
      return {
        title: this.$route.meta.title,
        orderId: '',
        orderData: {
          aAddress:{},
          bAddress:{},
          allTime:{}
        },
        showShare: false,
        isShare:false,
      }
    },
    mounted () {
      this.orderId = this.$route.query.orderId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.orderDetailById();
    },
    methods: {
      jumpToOrderDetail () {
        if(this.orderData.productTypeLevelOne === 'CAR_HAILING' || this.orderData.productTypeLevelOne === 'TAXI'){
          this.$router.push({
            name: 'carhailingOrderDetail',
            query: {
              orderId: this.orderId,
              productTypeLevelOne: this.orderData.productTypeLevelOne
            }
          })
        }else if(this.orderData.productTypeLevelOne === 'CAR_RENTAL') {
          this.$router.push({
            name: 'rentOrderDetail',
            query: {
              orderId: this.orderId,
              productTypeLevelOne: this.orderData.productTypeLevelOne
            }
          })
        }else if(this.orderData.productTypeLevelOne === 'GOODS') {
            this.$router.push({
                name: 'shopOrderDetail',
                query: {
                    orderId: this.orderId,
                }
            })
        }else{
          this.$router.push({
            name: 'orderDetail',
            query: {
              orderId: this.orderId
            }
          })
        }
      },
      dateCompare(startTime, endTime) {
        startTime = TOOL.changeDateStyle(startTime);
        endTime = TOOL.changeDateStyle(endTime);
        let compareMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        let days = Math.floor(compareMs/(3600000*24));
        let hours = Math.ceil((compareMs%(3600000*24))/3600000);
        this.orderData.allTime = {day: days, hour: hours};
        return {day: days, hour: hours}
      },

      orderDetailById () {
        this.$store.commit('UPDATE_LOADING', true)
        let apiName = 'orderDetailById';
        if(this.productTypeLevelOne === 'CAR_RENTAL') {
            apiName = 'rentOrderDetailById';
        }
        api[apiName]({
          orderId: this.orderId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.orderData = data.resultData;
            if(this.productTypeLevelOne === 'CAR_RENTAL') {
              this.dateCompare(this.orderData.startTime,this.orderData.endTime);
            }

          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      getSharePath () {
        let routeName
        let type = this.orderData.productTypeLevelOne
        let queryData = {
          startPlace: this.orderData.aAddress.city,
          endPlace: this.orderData.bAddress.city,
          startTime: TOOL.newGetDate({type: 'holeDate'})
        }
        let queryStation = {
          onStation: JSON.stringify(this.orderData.onStation),
          offStation: JSON.stringify(this.orderData.offStation)
        }
        switch (type) {
          case 'CITY_BUS':
          case 'STATION_BUS':
            routeName = 'list'
            break;
          case 'AIRPORT_BUS':
            if (this.orderData.airportType == 0) {
              routeName = 'airportPickList'
            } else {
              routeName = 'airportSendList'
            }
            break;
          case 'TRAIN_STATION_BUS':
            if (this.orderData.shuttleType == 0) {
              routeName = 'trainPickList'
              queryData.startPlace = this.orderData.aAddress.detailAddress
              queryData.endPlace = this.orderData.bAddress.searchShowAddress
            } else {
              routeName = 'trainSendList'
              queryData.startPlace = this.orderData.aAddress.searchShowAddress
              queryData.endPlace = this.orderData.bAddress.detailAddress
            }
            break;
          case 'TOUR_BUS':
            routeName = 'sights'
            break;
          case 'WORK_BUS':
            routeName = 'workList'
            queryData = {
              onStation: JSON.stringify(this.orderData.onStation),
              offStation: JSON.stringify(this.orderData.offStation)
            }
            break;
          case 'SCHOOL_BUS':
            routeName = 'schoolList'
            queryData = {
              onStation: JSON.stringify(this.orderData.onStation),
              offStation: JSON.stringify(this.orderData.offStation)
            }
            break;
          case 'CUSTOM_BUS':
            routeName = 'charterList'
            queryData = {}
            break;
          case 'LINE_BUS':
            routeName = 'carpoolingList'
            queryData = {productId: this.orderData.productId}
            break;
        }
      },

    }
  }
</script>
<style scoped lang="less">
  @import '../../../styles/theme.less';

  .pay-btn-box{
    display:flex;
    padding:30px;
    a{
      display:block;
      flex:1;
      height:80px;
      line-height:80px;
      text-align:center;
      font-size:28px;
      color:#524c4c;
      &.btn-pay-share{
         margin-right:20px;
         background-color: #ff6600;
         color: #fff;
         -webkit-border-radius:5PX;
         -moz-border-radius:5PX;
         border-radius:5PX;
      }
      &.btn-pay-detail{
         border:1PX solid #ddd;
         -webkit-border-radius:5PX;
         -moz-border-radius:5PX;
         border-radius:5PX;
         background: #fff;
      }
    }
  }

  .share-tips p:first-child {
    margin-bottom: 30px;
  }

  .share-tips em {
    color: #ff6600;
    font-size: 36px;
  }
  .group-eval {
    width: 100%;
    height: 80px;
    padding: 0 20px;
    display: flex;
    background: #fff;
    div {
      flex: 1;
      height: 80px;
      line-height: 80px;
      padding-left: 52px;
      font-size: 24px;
      color: #4c4c4c;
      background: url('../../../assets/city/eval.png') no-repeat 10px center;
      background-size: 30px 30px;
    }
  }
  .pay-success {
    width: 100%;
    height: 155px;
    line-height: 155px;
    padding: 0 20px;
    font-size: 36px;
    color: #272636;
    background: #fff;

    span {
      float: left;
      display: inline-block;
      height: 155px;
      line-height: 155px;
    }
  }
  .success-img {
    width: 70px;
    margin-right: 30px;
    background: url('../../../assets/city/success.png') no-repeat center center;
    background-size: 70px 70px;
  }
  .float-r {
    float: right !important;
  }
  .f-s-money {
    font-size: 40px !important;
  }
  .shop__properties {
    padding: 20px;
    background: #fff;
  }
  .shop__name {
    font-size: 34px;
    color: #333;
    padding-bottom: 20px;
    width: 100%;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .shop__properties-item {
    font-size: 28px;
    color: #999;
    padding-bottom: 20px;
  }
</style>
