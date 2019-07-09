<template>
  <div class="discount-box line line-x-t" v-if="(sku.activityName && sku.activityName.length) || (sku.couponName && sku.couponName.length) || sku.provide || sku.isAfterSale === 1" :class="[cssClass]">
    <p class="station-sale" v-if="sku.isAfterSale === 1">
      <i class="tag">站外站点</i>允许车站外上车点上车
    </p>
    <p class="station-sale" v-if="sku.isAfterSale === 1">
      <i class="tag">站外售票</i>允许发车后继续售票
    </p>
    <p class="activity" v-if="sku.activityName && sku.activityName.length">
      <i class="tag">优惠活动</i>{{sku.activityName[0]}}
    </p>
    <p class="coupon" v-if="sku.couponName && sku.couponName.length">
      <i class="tag">优惠券</i>{{sku.couponName[0]}}
    </p>
    <p class="feeder" v-if="sku.provide">
      <i class="tag">接驳服务</i>
      <span v-if="sku.freeType === 0">全免费接送服务</span>
      <span v-if="sku.freeType === 1">可免费接送服务</span>
      <span v-if="sku.freeType === 2">{{sku.shuttlePrice}}元起接送服务</span>
    </p>
    <a class="more-discount" v-if="getDiscountLen(sku)" @click.stop="showDiscountDialog(sku)">
      更多优惠<i class="icon-b-jt"></i>
    </a>
  </div>
</template>
<script>
  export default {
    props:['sku', 'cssClass'],
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
      
      getDiscountLen (sku) {
        let len = 0;
        if(sku.activityName && sku.activityName.length){
          len += sku.activityName.length
        }
        if(sku.couponName && sku.couponName.length){
          len += sku.couponName.length
        }
        return len
      },
      
      showDiscountDialog (discountSku) {
        this.$emit('showDiscountDialog', discountSku)
      }
    }
  }
</script>
<style lang="less" scoped>
  .discount-box{
    padding-top:1px;
    margin-top:30px;
    margin-left:180px;
    p{
      position: relative;
      padding-left:120px;
      padding-right:140px;
      margin-top:20px;
      font-size:22px;
      line-height:1.6;
      color:#4c4c4c;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 40px;
      white-space: nowrap;
    }
    .tag{
      position: absolute;
      left:0;
      top:0;
      display: block;
      padding:2px 5px;
      color: #ff6600;
      font-size:20px;
      line-height:normal;
      border:1PX solid #ff6600;
      border-radius:4px;
    }
    .feeder{
      .tag{
        color:#3c94e6;
        border:1px solid #3c94e6;
      }
    }
    .station-sale{
      .tag{
        color:#2290f9;
        border:1px solid #2290f9;
      }
    }
    .more-discount{
      position: absolute;
      right:20px;
      top:0;
      padding:20px 25px 40px 60px;
      color:#4c4c4c;
      i:after{
        left:auto;
        right:0;
        top:32px;
      }
    }
  }
</style>