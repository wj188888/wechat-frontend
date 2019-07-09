<template>
  <main-box :title="title" main-class="pad-20">
    <div class="inline-box mar-first">
      <label>车费</label>
      <input type="number" v-model="mileageFee" placeholder="请输入计价器金额"  maxlength="8"/>
      <i>元</i>
    </div>
    <div class="inline-box">
      <label>路桥费</label>
      <input type="number" v-model="roadFee" placeholder="请输入路桥费" maxlength="8"/>
      <i>元</i>
    </div>
    <div class="inline-box mar-t-20" v-if="reducedAmount">
      <label>优惠活动</label>
      <span>-{{reducedAmount}}</span>
      <i>元</i>
    </div>
    <div class="inline-box" v-if="orderCouponPrice">
      <label>优惠券</label>
      <span>-{{orderCouponPrice}}</span>
      <i>元</i>
    </div>
    <p class="cash-payment-tips">若实际路桥费已由乘客自己垫付，则无需填写路桥费</p>
    <p class="cash-payment-price">共 <em>{{totalPrice | formatPrice('normal')}}</em> 元</p>
    <input type="button" class="button button-primary" value="立即付款" @click="wxPayUnifiedTaxiOrder"/>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import service from 'mixins/service'

  export default {
    components: {
      MainBox,
    },
    mixins: [service],
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        orderId:'',
        productTypeLevelOne:'',
        mileageFee: '',
        roadFee: 0,
        payType: 1,
        startupTime:'',
        productId:'',
      }
    },
    computed: {
      totalPrice () {
        let mileageFee = this.mileageFee || 0
        let roadFee = this.roadFee || 0
        return parseFloat(mileageFee) + parseFloat(roadFee) - this.reducedAmount - this.orderCouponPrice
      }
    },
    watch:{
      totalPrice (newVal) {
        if(newVal > 0){
          this.initActivityAndCoupon(newVal)
        }
      },
    },
    created () {
      this.orderId = this.$route.query.orderId
      this.productTypeLevelOne = this.$route.query.productTypeLevelOne
      this.startupTime = this.$route.query.startupTime
      this.productId = this.$route.query.productId
    },
    methods: {
      initActivityAndCoupon () {
        this.showPrice = false
        this.ticketAmount = this.totalPrice
        this.passengerNum = 1
        this.ticketTotalAmount = this.totalPrice
        this.activityAndCounponParam = {
          type: 'productId',
          id: this.productId,
          productId: this.productId,
          productTypeLevelOne: this.productTypeLevelOne,
          startupTime: this.startupTime
        }
        this.getOptimalActivity()
      },

      wxPayUnifiedTaxiOrder () {
        let validata = TOOL.formValidate([
          {value: this.mileageFee, emptyTips: '计价器金额不能为空', regName: 'floatNumber', regTips: '计价器金额需为大于0的数字'},
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        if(this.roadFee && !TOOL.regExp.floatNumber.test(this.roadFee)){
          this.$store.dispatch('showError', '路桥费需为大于0的数字');
          return
        }
        interfaceApi.wxPay({
          tradeNo: this.orderId,
          productTypeLevelOne: this.productTypeLevelOne,
          payType: this.payType,
          mileageFee: this.mileageFee,
          roadFee: this.roadFee,
          wxPaySuccess: TOOL.wxPaySuccess,
          wxPayFail: TOOL.wxPayFail,
          price: this.totalPrice
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .inline-box{
    padding:0 36px;
    &.mar-first{
      margin-top:50px;
      margin-bottom:26px;
    }
    input{
      text-align:right;
    }
    span{
      text-align:right;
    }
    i{
      line-height: 2rem;
      padding: 1.5rem 0;
      font-size: 1.4rem;
      color: #121212;
    }
  }
  .cash-payment-tips{
    margin-top:20px;
    color:#888;
    font-size:24px;
  }
  .cash-payment-price{
    padding:60px 0 80px;
    text-align:center;
    font-size:28px;
    color:#121212;
    em{
      position: relative;
      top:2PX;
      font-size:48px;
    }
  }
</style>
