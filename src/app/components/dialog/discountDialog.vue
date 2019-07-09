<template>
  <x-dialog :show="show" :hide-on-blur="true" @on-hide="hideDiscountDialog" class="discount-dialog" v-if="discountSku">
    <p class="station-sale" v-if="discountSku.isAfterSale === 1">
      <i class="tag">站外站点</i>允许车站外上车点上车
    </p>
    <p class="station-sale" v-if="discountSku.isAfterSale === 1">
      <i class="tag">站外售票</i>允许发车后继续售票
    </p>
    <p class="activity" v-for="activityName in discountSku.activityName" v-if="discountSku.activityName">
      <i class="tag">惠</i> {{activityName}}
    </p>
    <p class="coupon" v-for="couponName in discountSku.couponName" v-if="discountSku.couponName">
      <i class="tag">券</i> {{couponName}}
        </p>
  </x-dialog>
</template>
<script>
  import { XDialog } from 'vux'
  export default {
    props:['showDiscount', 'discountSku'],
    components: {
      XDialog,
    },
    data () {
      return {

      }
    },
    computed: {
      show () {
          return this.showDiscount
      }
    },
    mounted () {

    },
    methods:{
      hideDiscountDialog () {
          this.$emit('hideDiscountDialog')
      }
    }
  }
</script>
