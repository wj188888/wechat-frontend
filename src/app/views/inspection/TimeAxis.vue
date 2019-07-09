<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div>
      <div class="ta-driver-top" v-if="driverMsg.carType">
        <div class="ta-driver-top-avatar">
          <img :src="driverMsg.avatar" alt="">
        </div>
        <div class="ta-driver-top-msg">{{driverMsg.userName}}</div>
        <a class="ta-driver-top-phone" :href="driverPhone"></a>
      </div>
      <div class="ta-box" v-for="(history,index) of histories" :key="history.id">
        <div class="ta-l">
          <div class="ta-l-time" :class="{'pad-t-100':history.showTime}">
            <!--<p>{{history.createdTime.substring(5,10)}}</p>-->
            <p>{{history.createdTime.substring(11,16)}}</p>
          </div>
        </div>
        <div class="ta-r">
          <span class="point" :class="{'show-time-dian':history.showTime}"></span>
          <span class="hidden-line" v-if="index == (histories.length - 1)"></span>
          <p class="show-time" v-if="history.showTime">{{history.showTime}}</p>
          <div class="ta-r-box-out">
            <span class="allow-l"></span>
            <!--其它常规状态-->
            <div class="ta-r-box-in" v-if="!history.timeCard.carType&&!history.timeCard.hasOwnProperty('through')&&!(history.status==12||history.status==13)">
              <div class="ta-remark-title">
                {{history.timeCard.remarkTitle}}
              </div>
              <div class="ta-Info" v-if="history.timeCard.payInfo">
                <span class="c-f-888">{{history.timeCard.payInfo}}</span>
                <span class="c-f-f60" v-if="history.timeCard.money">{{history.timeCard.money | formatPrice}}</span>
              </div>
              <div class="ta-Info" v-if="history.timeCard.remarkInfo">
                {{history.timeCard.remarkInfo}}
              </div>
            </div>
            <!--司机接单的状态-->
            <div class="ta-r-box-in" v-if="history.timeCard.carType">
              <div class="ta-remark-title">
                {{history.timeCard.remarkTitle}}
                <span class="c-f-888 pull-right"
                      v-if="orderData.status==0||orderData.status==1||orderData.status==2||orderData.status==3||orderData.status==14"
                      @click="handCancel">取消订单</span>
              </div>
              <div>
                <div class="ta-driver">
                  <div class="ta-driver-avatar">
                    <img :src="history.timeCard.avatar" alt="">
                  </div>
                  <div class="ta-driver-msg">
                    <div class="ta-driver-name">{{history.timeCard.userName}}</div>
                    <div class="ta-driver-star">
                      <span class="driver-star"></span>
                      <span>{{history.timeCard.grade.toFixed(1)}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ta-Info">
                {{history.timeCard.pickUpAddress}}
              </div>
              <div class="ta-Info">
                取车地址：{{history.timeCard.pickUpAddress}}
              </div>
              <div class="ta-Info">
                取车时间：{{history.timeCard.pickUpTime | formatInspectionTime}}
              </div>
            </div>
            <!--车辆年检的状态-->
            <div class="ta-r-box-in-noPosi" v-if="history.timeCard.hasOwnProperty('through')"
                 :class="{'pad-b-75':(history.status==9||history.status==10)&&(orderData.settlementStatus==0||orderData.settlementStatus==1)&&!((orderDetail.payForm==0&&orderDetail.payType==0)||(orderDetail.payForm==1&&orderDetail.payType==1))}"
            >
              <div class="ta-remark-title">
                <span class="c-f-56ab71" v-if="history.timeCard.through">恭喜您，成功通过年检！</span>
                <span class="c-f-ea5449" v-if="!history.timeCard.through">抱歉，您未通过年检！</span>
              </div>
              <div class="insp-img-box">
                <div class="insp-img" v-for="(img,imgIndex) of history.timeCard.imageUrls">
                  <img :src="img" alt="">
                </div>
              </div>
              <div class="ta-Info" v-if="history.timeCard.remark">
                {{history.timeCard.remark}}
              </div>
              <!--<div class="ta-Info" v-if="history.timeCard.payInfo">
                <span class="c-f-888">{{history.timeCard.payInfo}}</span>
                <span class="c-f-f60" v-if="history.timeCard.money">{{history.timeCard.money | formatPrice}}</span>
              </div>-->
              <div class="ta-driver-pay"
                   v-if="(history.status==9||history.status==10)&&(orderData.settlementStatus==0||orderData.settlementStatus==1)&&!((orderDetail.payForm==0&&orderDetail.payType==0)||(orderDetail.payForm==1&&orderDetail.payType==1))">
                <div class="ta-driver-pay-l">
                  <!--已付款-->
                  <p class="c-f-888" v-show="orderData.settlementStatus==1">
                    {{history.timeCard.payInfo}}：{{orderData.actualPayment | formatPrice}}
                  </p>
                  <!--未付款-->
                  <p v-if="orderData.settlementStatus==0">
                    <span class="c-f-888">{{history.timeCard.payInfo}}</span>
                    <span class="c-f-f60">{{orderData.actualPayment | formatPrice}}</span>
                  </p>
                </div>
                <div class="ta-driver-pay-r" v-if="orderData.settlementStatus==0">
                  <div class="btn" @click="wxPay">立即支付</div>
                </div>
              </div>
            </div>
            <!--用户评价-->
            <div class="ta-r-box-in-noPosi pad-b-100" v-if="history.status==12||history.status==13">
              <div class="ta-remark-title">
                {{history.timeCard.remarkTitle}}
              </div>
              <div class="ta-eval">
                <div class="ta-eval-title">
                  <div class="eval-title">
                    <span>服务评价</span>
                    <span class="eval-l-line"></span>
                    <span class="eval-r-line"></span>
                  </div>
                </div>
                <div class="ta-eval-star">
                  <div class="star-box" v-for="(star, starIndex) of starArr"
                       :class="{'star-yes':star.checked,'star-no':!star.checked,}"
                       @click="calScore(starIndex,history.status)"
                  >
                  </div>
                </div>
              </div>
              <div class="ta-eval-btn" @click="carInspectionOrderReview" v-if="history.status==12">
                提交评价
              </div>
              <div class="ta-eval-btn c-f-4c4c4c"
                   @click="carInspectionGetShareTheme" v-if="history.status==13">
                分享一波呢
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <share-modal :show="showShare" @closeShare="showShare = false"></share-modal>
    </div>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import ShareModal from 'appComponents/shareModal/index.vue'

  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      ShareModal
    },
    data() {
      return {
        title:this.$route.meta.title,
        pageRouter: this.$route.name,
        orderId: this.$route.query.orderId,
        driverPhone:'tel:',
        showShare: false,
        orderScore: 0,
        starArr: [{checked: false},{checked: false},{checked: false},{checked: false},{checked: false}],
        orderData: {},
        orderDetail: {},
        driverMsg: {},
        histories: [],
        axisTimer: ''
      }
    },
    mounted() {
      this.initialize();
    },
    computed: {

    },
    watch: {
        $route () {
            this.initialize()
        }
    },
    methods: {
      initialize() {
        this.findInspectionTimeAxis();
        this.getInspectionOrderById();
        this.startAsk();
        this.$router.beforeEach((to, from, next) => {
          clearInterval(this.axisTimer);
          next();
        })
      },
      startAsk() {
        if(this.axisTimer) {
          clearInterval(this.axisTimer);
        }
        this.axisTimer = setInterval(() => {
          this.findInspectionTimeAxis();
        }, 5000);
      },
      stopAsk() {
        clearInterval(this.axisTimer);
      },
      getInspectionOrderById() {
        api.getInspectionOrderById(this.orderId).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.orderDetail = data.resultData.order;
            console.log(this.orderDetail);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      findInspectionTimeAxis() {
        api.findInspectionTimeAxis({orderId: this.orderId}).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.orderData = data.resultData;
            this.driverPhone = 'tel:' + this.orderData.phone;
            this.histories = data.resultData.histories.slice(0);
            for(let [index, x] of this.histories.entries()) {
                if(x.timeCard.carType) {
                    if(!x.timeCard.avatar) {
                      x.timeCard.avatar = 'static/pics/driver.png';
                    }
                    this.driverMsg = Object.assign(this.driverMsg, x.timeCard);
                }
                if(x.timeCard.orderScore>=0) {
                    if(x.timeCard.orderScore == 0) {
                        continue;
                    }
                    this.calScore(x.timeCard.orderScore - 1, 12);
                }
                if(index > 0) {
                    if(this.histories[index].createdTime.split(' ')[0]!=this.histories[index-1].createdTime.split(' ')[0]){
                      this.histories[index].showTime = this.histories[index].createdTime.split(' ')[0];
                    }
                }
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      /**
       * 评分
       * @param starIndex
       * @param status
       */
      calScore(starIndex, status) {
        if(status != 12) {
          return false;
        }
        starIndex = parseInt(starIndex);
        this.orderScore = starIndex + 1;
        for(let [index, value] of this.starArr.entries()) {
            if(index <= starIndex) {
              value.checked = true;
            } else {
              value.checked = false;
            }
        }
      },
      /**
       * 订单评价
       */
      carInspectionOrderReview() {
        this.stopAsk();
        let apiData = {
          reviewScore: this.orderScore,
          orderId: this.orderId,
        };
        api.carInspectionOrderReview(apiData).then(res => {
          this.startAsk();
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$store.dispatch('showSuccess', '评价成功');
            this.findInspectionTimeAxis();
            /*setTimeout(() => {
                this.$router.go(0);
            }, 1000);*/
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      /**
       * 订单分享
       */
      carInspectionGetShareTheme() {
         api.carInspectionGetShareTheme({orderId:this.orderId}).then(res => {
           const data = TOOL.toJson(res.data);
           if(data.resultCode === '0') {
             let shareData = data.resultData;
             interfaceApi.share({
               share: true,
               shareUrl: location.href,
               shareTitle: shareData.title,
               shareDesc: shareData.description,
               shareImgUrl: shareData.image
             });
             this.showShare = true;
           } else {
             this.$store.dispatch('showError', data.resultMsg);
           }
         })
      },
      sharePage () {
        if(this.ticketInfo.shareTheme){
          interfaceApi.share({
            share: true,
            shareUrl: location.href,
            shareTitle: this.ticketInfo.shareTheme.title,
            shareDesc: this.ticketInfo.shareTheme.description,
            shareImgUrl: this.ticketInfo.shareTheme.image
          });
        }else{
          interfaceApi.share({
            share: true,
            shareUrl: window.location.href
          });
        }
      },
      handCancel() {
        this.stopAsk();
        this.$store.dispatch('showConfirm', {
          content: '是否取消订单！',
          cancelText:'放弃',
          confirmText: '是的',
          onConfirm: () => {
            this.cancelInspection();
          },
          onCancel: () => {
            this.startAsk();
          }
        });
      },
      cancelInspection() {
        api.cancelInspection(this.orderId).then(res => {
          const data = TOOL.toJson(res.data);
          this.startAsk();
          if(data.resultCode === '0') {
            this.$store.dispatch('showError', '订单已成功取消！');
            setTimeout(() => {
              this.$router.replace({
                name: 'historyOrder'
              })
            }, 1000);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      wxPay() {
        let apiData = {
            tradeNo: this.orderId,
            productTypeLevelOne: 'CAR_INSPECTION',
            routerName: '',
            wxPaySuccess: TOOL.wxPaySuccess,
            wxPayFail: TOOL.wxPayFail,
            price: this.orderData.actualPayment
        };
        interfaceApi.wxPay(apiData);
        /*this.stopAsk();
        let apiData = {
          openId: appStorage.get('payOpenId'),
          tradeNo: this.orderId
        };
        this.$store.commit('UPDATE_LOADING', true);
        api.unifiedCarInsOrder(apiData).then(res => {
          this.$store.commit('UPDATE_LOADING', false)
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.wxPayBridge(data.resultData);
          } else {
            this.startAsk();
            this.$store.dispatch('showError', data.resultMsg);
          }
        })*/
      },
      wxPayBridge(data) {
        let that = this;
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          appId: data.appId,
          timeStamp: data.timeStamp.toString(),
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign
        }, function (weData) {
          that.startAsk();
          if (weData.err_msg === 'get_brand_wcpay_request:ok') {
            that.$store.dispatch('showSuccess', '支付成功');
            that.$router.go(0);
          }else{
            that.$store.dispatch('showError', '支付失败，请重新支付！');
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .ta-box {
    display: flex;

    width: 100%;
    padding: 0 20px;
    height: auto;
  }
  .ta-l {
    position: relative;

    width: 65px;
    font-size: 28px;
    color: #121212;
    margin-right: 20px;
  }
  .ta-l-time {
    padding-top: 50px;
  }
  .ta-r {
    position: relative;
    width: 0;
    flex: 1;

    padding-left: 25px;
    border-left: 4px solid #f60;
  }
  .ta-r-box-out {
    position: relative;
    width: 100%;
    padding: 20px;
    margin-top: 30px;
    border: 1PX solid #e5e5e5;
    border-radius: 10px;

    background: #fff;
  }
  .ta-r-box-in {

  }
  .ta-r-box-in-noPosi {

  }
  .ta-remark-title {
    /*padding-bottom: 28px;*/
    font-size: 28px;
    color: #121212;
  }
  .ta-Info {
    font-size: 24px;
    line-height: 30px;
    color: #888;
    margin-top: 15px;
    word-break: break-all;
    word-wrap: break-word;
  }

  .point {
    display: inline-block;
    position: absolute;
    top: 50px;
    left: -12px;

    width: 20px;
    height: 20px;

    background: url("../../../assets/inspection/axioPoint.png") no-repeat center center;
    background-size: 20px 20px;
  }

  .allow-l {
    display: inline-block;
    position: absolute;
    top: 20px;
    left: -11px;

    width: 15px;
    height: 22px;

    background: url("../../../assets/inspection/allow.png") no-repeat center center;
    background-size: 15px 22px;
  }
  .hidden-line {
    display: inline-block;
    position: absolute;
    left: -4px;
    top: 70px;

    width: 4px;
    height: 100%;

    background: #f2f2f2;
  }
  .ta-driver {
    display: flex;

    width: 100%;
    height: 80px;
    margin-top: 20px;
  }
  .ta-driver-pay {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 80px;
    padding: 0 20px;
    border-top: 1PX solid #e5e5e5;
  }
  .ta-driver-pay-l {
    width: 0;
    flex: 1;
    font-size: 28px;
    color: #f60;
    height: 80px;
    line-height: 80px;
  }
  .ta-driver-pay-r {
    width: 160px;
    height: 100%;
    padding-top: 15px;

    .btn {
      display: inline-block;
      width: 160px;
      height: 50px;
      line-height: 50px;
      border-radius: 10px;

      text-align: center;
      color: #fff;
      background: #f60;
    }
  }
  .ta-driver-avatar {
    width: 80px;
    height: 80px;
    border-radius: 100%;

    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .ta-driver-msg {
    width: 0;
    flex: 1;
    padding-left: 20px;
  }
  .ta-driver-name {
    font-size: 28px;
    color: #121212;
    padding: 10px 0 15px 0;
  }
  .ta-driver-star {
    font-size: 24px;
    color: #f90;
  }
  .driver-star {
    display: inline-block;

    width: 20px;
    height: 20px;

    background: url("../../../assets/inspection/star.png") no-repeat center center;
    background-size: 20px 20px;
  }
  .ta-driver-top {
    display: flex;

    width: 100%;
    height: 130px;
    padding: 0 30px 0 20px;

    background: #fff;
  }
  .ta-driver-top-avatar {
    width: 100px;
    height: 100px;
    margin-top: 15px;
    border-radius: 100%;

    overflow: hidden;

    img {
      width: 100%;
      height: 100px;
    }
  }
  .ta-driver-top-msg {
    width: 0;
    flex: 1;
    height: 130px;
    line-height: 130px;
    padding-left: 20px;

    font-size: 32px;
    color: #121212;
  }
  .ta-driver-top-phone {
    display: inline-block;
    width: 64px;
    height: 130px;

    background: url("../../../assets/inspection/phone.png") no-repeat center 33px;
    background-size: 64px 64px;
  }
  .insp-img-box {
    display: flex;

    height: 150px;
    margin-top: 20px;
  }
  .insp-img {
    width: 0;
    max-width: 160px;
    flex: 1;
    height: 100%;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .insp-img:last-child {
    margin-right: 0;
  }
  .ta-eval {
    width: 100%;
    margin-top: 20px;
  }
  .ta-eval-title {
    width: 100%;
    height: 30px;
    line-height: 30px;

    font-size: 24px;
    color: #888;
    text-align: center;

    .eval-title {
      display: inline-block;
      position: relative;
    }
    .eval-l-line,
    .eval-r-line {
      position: absolute;
      right: 100px;
      top: 14px;

      width: 80px;
      height: 1PX;

      background: #888;
    }
    .eval-r-line {
      left: 100px;
      right: 0;
    }
  }
  .ta-eval-star {
    margin-top: 20px;
    text-align: center;
  }
  .star-box {
    display: inline-block;
    width: 58px;
    height: 58px;

    margin-right: 20px;
  }
  .star-box:last-child {
    margin-right: 0;
  }
  .ta-eval-btn {
    position: absolute;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 80px;
    line-height: 80px;
    border-top: 1PX solid #e5e5e5;

    text-align: center;
    font-size: 28px;
    color: #f60;
  }
  .star-yes {
    background: url("../../../assets/inspection/evaled.png") no-repeat center center;
    background-size: 58px 58px;
  }
  .star-no {
    background: url("../../../assets/inspection/eval.png") no-repeat center center;
    background-size: 58px 58px;
  }
  .show-time {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 20px;

    text-align: center;
    font-size: 28px;
    color: #888;
  }
  .show-time-dian {
    top: 100px !important;
  }


  .pad-b-75 {
    padding-bottom: 75px !important;
  }
  .pad-b-100 {
    padding-bottom: 100px !important;
  }
  .pad-t-100 {
    padding-top: 100px !important;
  }
</style>
