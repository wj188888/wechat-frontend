<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="feeder-box mar20 radius-box">
      <div class="feeder-form line line-x-t">
        <div class="inline-box">
          <label :class="{'icon-feeder-send':feederData.serviceType === 1, 'icon-feeder-pick':feederData.serviceType !== 1}"></label>
          <span>{{feederData.serviceType === 1 ? '送站服务' : '接站服务'}}</span>

          <!--0待支付，1已支付， 2已失效（过了支付时间），3已安排，4已退款，5已完成，6退款申请中-->
          <span class="text-right pad-r-20"
                :class="{'text-888': feederData.status === 4 || feederData.status === 6, 'text-ff6600': feederData.status === 3 || feederData.status === 5}"
                v-if="feederData.status === 3 || feederData.status === 4 || feederData.status === 5 || feederData.status === 6">
        {{feederData.status | getFeederStatusText}}
      </span>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-time"></label>
          <span>{{feederData.startupTime}}</span>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-start"></label>
          <span>{{feederData.onStation.name}}</span>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-end"></label>
          <span>{{feederData.offStation.name}}</span>
        </div>
        <div class="inline-box line line-x-t">
          <label class="icon-passenger"></label>
          <span>乘车人：{{feederData.passgerNum}}人</span>
        </div>
      </div>
    </div>

    <div class="feeder-box mar20 radius-box" v-if="feederData.driverName || feederData.carId">
      <div class="inline-box">
        <label>服务信息</label>
      </div>
      <div class="inline-box line line-x-t" v-if="feederData.driverName">
        <label>司机姓名：</label>
        <span>{{feederData.driverName}}</span>
      </div>
      <div class="inline-box line line-x-t" v-if="feederData.driverTelephone">
        <label>司机电话：</label>
        <span>{{feederData.driverTelephone}}</span>
      </div>
      <div class="inline-box line line-x-t" v-if="feederData.licensePlat">
        <label>车牌号码：</label>
        <span>
         {{feederData.licensePlat}} <em v-text="feederData.licensePlatType === 1 ? '(蓝)' : '(黄)'"></em>
        </span>
      </div>
      <div class="inline-box line line-x-t" v-if="feederData.brandName">
        <label>车辆品牌：</label>
        <span>{{feederData.brandName}}</span>
      </div>
      <div class="inline-box line line-x-t" v-if="feederData.color">
        <label>车辆颜色：</label>
        <span>{{feederData.color}}</span>
      </div>
    </div>

    <div slot="footer">
      <div class="abs-bottom-box  line line-x-t" v-if="feederData.status === 1 && canRefund">
        <div class="buy-right buy-w100">
          <p class="order-tips price" v-if="feederData.actualPayment > 0">共计 <span>{{ feederData.actualPayment | formatPrice }}</span></p>
          <p class="order-tips price" v-else><span>免费</span></p>
          <a class="button button-empty-gray button-small radius-box" @click="shuttleOrderRefund">取消服务</a>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox,
    },
    data () {
//      对于接驳订单 订单状态 0：待付款 1：已支付 2:已失效 3：已派单 4：已退款 5：已完成
      return {
        title: this.$route.meta.title,
        feederId: '',
        feederData:{
          onStation:{},
          offStation:{},
        },
        canRefund: false
      }
    },
    mounted () {
      this.feederId = this.$route.query.feederId
      this.shuttleOrderFindById()
    },
    methods: {
      /**
       * 查询接驳信息
       */
      shuttleOrderFindById () {
        api.shuttleOrderFindById(this.feederId).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.feederData = data.resultData
            let beginTime = TOOL.newGetDate({type: 'holeDate'})
            this.canRefund = TOOL.dateCompare(beginTime, this.feederData.startupTime, 'datetime') < 0
          }
        });
      },

      /**
       * 接驳订单退款
       */
      shuttleOrderRefund () {
        this.$store.dispatch('showConfirm', {
          title: '温馨提醒',
          content: '是否确定退单？',
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.shuttleOrderRefund(this.feederId).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode === '0') {
                this.shuttleOrderFindById()
                this.$store.dispatch('showSuccess', '退单成功')
              }else{
                this.$store.dispatch('showError', data.resultMsg);
              }
            });
          },
          onCancel: () => {
          }
        })
      }

    }

  }
</script>
<style lang="less" scoped>
  .feeder-box{
    background: #fff;
    label{
      color:#4c4c4c!important;
    }
  }
  .feeder-form{
    label{
      width: 60px;
    }
    .icon-time{
      background:url("../../../assets/order_time.png") no-repeat center center;
      background-size: 30px 30px;
    }
    .icon-start{
      background:url("../../../assets/order_start.png") no-repeat center center;
      background-size: 30px 30px;
    }
    .icon-end{
      background:url("../../../assets/order_end.png") no-repeat center center;
      background-size: 30px 30px;
    }
    .icon-passenger{
      background:url("../../../assets/feeder_user.png") no-repeat center center;
      background-size: 20px 20px;
    }
    .icon-feeder-send{
      background:url("../../../assets/icon-feeder-send.png") no-repeat center center;
      background-size:26px 26px;
    }
    .icon-feeder-pick{
      background:url("../../../assets/icon-feeder-pick.png") no-repeat center center;
      background-size:26px 26px;
    }
  }
  .abs-bottom-box{
    .order-tips{
      float:left;
      line-height:96px;
      padding-left:20px;
      font-size:24px;
      color:#4c4c4c;
    }
    .price{
      font-size:28px;
      span{
        font-size: 30px;
        color: #ff6600;
      }
    }
    .icon-tips{
      padding-left:60px;
      background:url("../../../assets/i.png") no-repeat 20px center;
      background-size:30px 30px;
    }
    .button-small{
      float:right;
      margin-right:20px;
      margin-top:23px;
      font-size: 28px;
      width: auto;
      padding:0 20px;
      height: 50px !important;
      line-height: 50px
    }
  }
  .text-888{
    color:#888;
    padding-right:20px;
  }
  .text-ff6600{
    color:#ff6600;
    padding-right:20px;
  }
</style>
