<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <a class="hd-cancel fc-4c4c4c" slot="title" @click="handCancel">取消订单</a>
    <div class="insp-countDown">
      <h3 class="insp-cd-title">正在为您预约中...</h3>
      <p class="insp-cd-p">
        亲耐心等待，如果请求被受理，将以通知的形式发送给您。如果倒计时结束后，订单将自动取消
      </p>
      <div class="insp-cd-box">
        <div class="insp-cd-timer">
          <p class="insp-cd-timer-p" id="myname">倒计时</p>
          <p class="insp-cd-timer-second">
            <span class="f-s-40">{{remainedTime.minute}}</span>
            <span>分</span>
            <span class="f-s-40">{{remainedTime.second}}</span>
            <span>秒</span>
          </p>
        </div>
        <div class="insp-canvas-box">
          <div class="insp-small-ball"></div>
          <div class="insp-canvas-l">
            <div class="insp-canvas-l-move">
              <div class="insp-canvas-l-round"></div>
            </div>
          </div>
          <div class="insp-canvas-r">
            <div class="insp-canvas-r-move">
              <div class="insp-canvas-r-round"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="insp-material-box">
      <div class="insp-material">
        <div class="insp-material-title">
          <div class="insp-material-l"><span class="aline"></span></div>
          <div class="insp-material-r">车辆年检所需材料</div>
        </div>
        <div class="appS-content-title relative">
          <div class="appS-orange-circle"></div>
          <p class="appS-title-one">所需材料</p>
          <p class="appS-p" v-html="carMaterial"></p>
        </div>
      </div>
    </div>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox
    },
    data() {
      return {
        title:this.$route.meta.title,
        pageRouter: this.$route.name,
        orderId: this.$route.query.orderId,
        status: this.$route.query.status,
        allSeconds: 300,
        orderData: {},
        carMaterial: '',
        timerRound: '',
        timerPolling: '',
        remainedTime: {
          minute: 10,
          second: 0,
        },
        localData: {
          orderId: '',
          seconds: 0
        }
      }
    },
    watch: {
      'localData.seconds'(newVal) {
          let remainedSecond = this.allSeconds - newVal;
          this.remainedTime.minute = Math.floor(remainedSecond/60);
          this.remainedTime.second = remainedSecond%60;
      }
    },
    mounted() {
      let count = 0;
      let that = this;
      let $huduR = $('.insp-canvas-r-move');
      let $huduL = $('.insp-canvas-l-move');
      let $ball = $('.insp-small-ball');
      this.timerRound = setInterval(() => {
        count = that.countTime();
        if(count >= 360) {
          clearInterval(that.timerRound);
          that.carInspectionOrderOverTimeCancel();
        }
        if(count <= 180) {
          $huduR.css('transform', 'rotate(' + (count+180) + 'deg)');
//          $huduR.css('-webkit-transform', 'rotate(' + (count+180) + 'deg)');
          $ball.css('transform', 'rotate(' + count + 'deg)');
//          $ball.css('-webkit-transform', 'rotate(' + count + 'deg)');
        } else {
          $huduR.css('transform', 'rotate(360deg)');
//          $huduR.css('-webkit-transform', 'rotate(360deg)');
          $huduL.css('transform', 'rotate(' + count + 'deg)');
//          $huduL.css('-webkit-transform', 'rotate(' + count + 'deg)');
          $ball.css('transform', 'rotate(' + count + 'deg)');
//          $ball.css('-webkit-transform', 'rotate(' + count + 'deg)');
        }
      }, 1000);
      this.timerPolling = setInterval(() => {
        that.inspectionOrderPolling();
      }, 5000);
      this.getInspectionOrderById();
    },
    computed: {

    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timerRound);
      clearInterval(this.timerPolling);
      next();
      next();
    },
    methods: {
      getInspectionOrderById() {
        api.getInspectionOrderById(this.orderId).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.orderData = data.resultData.order;
            this.status = this.orderData.status;
            this.allSeconds = data.resultData.order.validDuration*60;
            if(data.resultData.second >= 0) {
              this.localData.seconds = data.resultData.second;
            } else {
              this.localData.seconds = 0;
            }
            this.carInspectionGetMaterial();
            this.inspectionOrderPolling();
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      // 查找具体车型的车检材料
      carInspectionGetMaterial() {
        let apiData = {
          subStoreId: this.orderData.subStoreDto.id,
          carTypeUniqueCode: this.orderData.carSubTypeDto.parentType
        };
        api.carInspectionGetMaterial(apiData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.carMaterial = data.resultData;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      handCancel() {
        this.$store.dispatch('showConfirm', {
          content: '是否取消订单！',
          cancelText:'放弃',
          confirmText: '是的',
          onConfirm: () => {
            this.cancelInspection();
          },
          onCancel: () => {

          }
        });
      },
      carInspectionOrderOverTimeCancel() {
        let that = this;
        clearInterval(this.timerPolling);
        this.$store.commit('UPDATE_LOADING', true);
        api.carInspectionOrderOverTimeCancel(this.orderId).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$store.dispatch('showSuccess', '订单超时，已为您取消订单！');
            setTimeout(() => {
              this.$router.replace({
                name: 'historyOrder'
              })
            }, 1000);
          } else {
            this.timerPolling = setInterval(() => {
              that.inspectionOrderPolling();
            }, 5000);
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      cancelInspection() {
        let that = this;
        clearInterval(this.timerPolling);
        this.$store.commit('UPDATE_LOADING', true);
        api.cancelInspection(this.orderId).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$store.dispatch('showSuccess', '订单已成功取消！');
            setTimeout(() => {
              this.$router.replace({
                name: 'historyOrder'
              })
            }, 1000);
          } else {
            this.timerPolling = setInterval(() => {
              that.inspectionOrderPolling();
            }, 5000);
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      inspectionOrderPolling() {
        let aipData = {
          orderId: this.orderId,
          status: this.status
        };
        api.inspectionOrderPolling(aipData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            if(data.resultData.ifChange) {
              if(data.resultData.order.status == 5) {
                this.$store.dispatch('showError', '订单已超时，请重新下单！');
                this.$router.replace({
                  name: 'historyOrder'
                })
              } else {
                this.$store.dispatch('showSuccess', '已成功接单');
                setTimeout(() => {
                  this.$router.replace({
                    name: 'timeAxis',
                    query: {
                      orderId: this.orderId,
                      status: this.status
                    }
                  });
                }, 1000);
              }
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      countTime() {
        this.localData.seconds = parseInt(this.localData.seconds) + 1;
        if(this.localData.seconds >= this.allSeconds) {

        }
        return Math.ceil(this.localData.seconds*360/this.allSeconds);
      }
    }
  }
</script>
<style lang="less" scoped>
  .appS-content-title{
    padding: 20px 20px 20px 60px;
    border-top: 1PX solid #e5e5e5;
  }
  .appS-title-one {
    color: #4c4c4c;
    font-size: 28px;
    margin-bottom: 10px;
  }
  .appS-p {
    font-size: 28px;
    color: #888;
    /*margin-top: 15px;*/

    line-height: 34px;
  }
  .appS-orange-circle{
    width: 12px;
    height:12px;
    position: absolute;
    left: 30px;
    top:28px;
    background: url("../../../assets/circle-down.png") no-repeat center;
    background-size:cover;
  }
  .insp-countDown {
    width: 100%;
    height: auto;
    padding: 0 70px;
  }
  .insp-cd-title {
    width: 100%;
    padding: 40px 0 30px 0;

    font-size: 36px;
    color: #56ab71;
    text-align: center;
  }
  .insp-cd-p {
    width: 100%;
    line-height: 30px;

    font-size: 24px;
    color: #888;
    text-align: center;
    word-break: break-all;
    word-wrap: break-word;
  }
  .insp-cd-box {
    position: relative;

    width: 280px;
    height: 280px;
    margin: 60px auto 150px auto;
  }
  .insp-cd-timer {
    width: 100%;
    height: 100%;
    border: 10px solid #ccc;
    border-radius: 100%;
  }
  .insp-cd-timer-p {
    width: 100%;
    padding: 40px 0 60px 0;

    font-size: 28px;
    color: #888;
    text-align: center;
  }
  .insp-cd-timer-second {
    width: 100%;

    font-size: 28px;
    color: #121212;
    text-align: center;
  }
  .insp-canvas-box {
    /*display: flex;*/
    position: absolute;
    top: 0;
    left: 0;

    width: 280px;
    height: 280px;
  }
  .insp-canvas-l,
  .insp-canvas-r {
    position: relative;

    float: left;
    /*flex: 1;*/
    width: 50%;
    height: 280px;
    overflow: hidden;
  }
  .insp-canvas-l-move,
  .insp-canvas-r-move {
    position: relative;

    width: 100%;
    height: 100%;
    overflow: hidden;

    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform-origin: 100% 50%;
    -webkit-transform-origin: 100% 50%;
    -webkit-mask-image: -webkit-radial-gradient(white, black)
  }
  .insp-canvas-r-move {
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      transform-origin: 0 50%;
      -webkit-transform-origin: 0 50%;
  }
  .insp-canvas-l-round {
    /*position: absolute;
    left: 0;
    top: 0;*/

    width: 280px;
    height: 280px;
    border: 10px solid #56ab71;
    border-radius: 100%;
    transform: rotate(0deg);
  }
  .insp-canvas-r-round {
   /* position: absolute;
    right: 0;
    top: 0;*/

    width: 280px;
    height: 280px;
    margin-left: -140px;
    border: 10px solid #56ab71;
    border-radius: 100%;
    transform: rotate(0deg);
  }
  .insp-material-box {
    width: 100%;
    height: auto;
    padding: 0 20px;
  }
  .insp-small-ball {
    position: absolute;
    top: -10px;
    left: 50%;
    margin-left: -15px;

    display: inline-block;
    width: 30px;
    height: 30px;

    background: url("../../../assets/inspection/xiaoqiu.png") no-repeat center center;
    background-size: 30px 30px;

    transform: rotate(0deg);
    transform-origin: 50% 150px;
  }
  .insp-material {
    width: 100%;
    height: auto;
    border: 1PX solid #e5e5e5;
    border-radius: 10px;

    background: #fff;
  }
  .insp-material-title {
    display: flex;

    width: 100%;
    height: 80px;
  }
  .insp-material-l {
    position: relative;

    width: 52px;
    height: 80px;
    .aline {
      display: inline-block;

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      width: 6px;
      height: 24px;
      margin: auto;

      background: #f60;
    }
  }
  .insp-material-r {
    width: 0;
    flex: 1;
    height: 80px;
    line-height: 80px;

    font-size: 28px;
    color: #121212;
  }
</style>
