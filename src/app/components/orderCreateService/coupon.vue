<template>
  <div class="inline-box line line-x-t" @click="jumpToSelectCoupon">
    <label class="auto-width label-coupon"><i>券</i>优惠券</label>
    <span class="pad-r-20 text-right" v-if="orderCouponPrice">- ¥{{orderCouponPrice}}</span>
    <span class="pad-r-20 text-right" v-else>暂无可用优惠券</span>
    <i class="icon-r-jt"></i>
  </div>
</template>
<script>
  export default {
    props:{
      orderCouponPrice: 0,
    },
    data () {
      return {

      }
    },
    computed: {

    },
    mounted () {

    },
    methods:{
      jumpToSelectCoupon () {
        this.$emit('jumpToSelectCoupon')
      }
    }
  }
</script>
