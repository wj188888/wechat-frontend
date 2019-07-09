<template>
  <x-dialog :show="show" :hide-on-blur="true" @on-hide="hideScoreDialogHandle" class="score-dialog">
   <h2>积分抵现规则</h2>
    <p>1.用{{scoreRule.exchangeIntegral}}积分抵现{{scoreRule.exchangeAmount}}元</p>
    <p>2.订单金额需满{{scoreRule.orderAmountLimit}}元（含）</p>
    <p>3.积分抵现不得超过单笔订单金额的{{scoreRule.orderExchangeRate}}%</p>
    <p>4.每次使用须是{{scoreRule.baseUseNum}}积分的整数倍</p>
    <p>5.积分抵现{{ scoreRule.canUseDiscount ? '可与' : '不与'}}其他优惠活动同享</p>
    <p>6.积分抵现的产品{{scoreRule.refund ? '允许退票' : '不允许退票'}}</p>
    <a class="button button-no-radius" @click="hideScoreDialogHandle">我知道了</a>
  </x-dialog>
</template>
<script>
  import { XDialog } from 'vux'
  export default {
    props:['showScoreDialog', 'scoreRule'],
    components: {
      XDialog,
    },
    data () {
      return {

      }
    },
    computed: {
      show () {
        return this.showScoreDialog
      }
    },
    mounted () {

    },
    methods:{
      hideScoreDialogHandle () {
        this.$emit('hideScoreDialogHandle')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .score-dialog{
    h2{
      padding:26px 0 28px;
      font-size:36px;
      color:#121212;
      text-align:center;
    }
    p{
      padding:10px 30px;
      font-size:28px;
      color:#888;
      text-align:left;
    }
    .button{
      margin-top:35px;
      border-top:1PX solid @bc-e5e5e5;
      color: @fc-ff6600;
    }
  }
</style>
