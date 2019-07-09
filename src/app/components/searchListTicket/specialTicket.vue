<template>
  <div v-if="skus">
    <ticket-title :title="title">
      <slot name="title"></slot>
    </ticket-title>
    <div class="bg-fff line line-x-t line-x-b">
      <div class="list-nav" @click="jumpToPage">
        <span class="car-icon"></span>
        <span class="time">时间自定&nbsp;&nbsp;&nbsp;专车接送</span>
        <span class="orange">{{'¥' + skus.price}}</span>
        <span class="blue-start">起</span>
      </div>
      <ticket-discount :sku="skus" @showDiscountDialog="showDiscountDialog" :css-class="'pad-b-20'"></ticket-discount>
    </div>
  </div>
</template>
<script>
  import TicketTitle from 'appComponents/title/ticketTitle'
  import TicketDiscount from 'appComponents/searchListTicket/ticketDiscount'

  export default {
    props:['title', 'skus'],
    components:{
      TicketTitle,
      TicketDiscount
    },
    data () {
      return {

      }
    },
    mounted () {

    },
    methods:{
      jumpToPage () {
        this.$emit('jumpToPage')
      },

      showDiscountDialog (discountSku) {
        this.$emit('showDiscountDialog', discountSku)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";

  .list-nav {
    height: 160px;
    line-height: 160px;
    position: relative;
    background-color: @c-fff;
    width: 100%;
    span {
      display: block;
      float: left;
    }
    .car-icon {
      width: 180px;
      height: 126px;
      margin-left: 20px;
      margin-top: 17px;
      background: url("../../../assets/city/zhuanche.png") no-repeat 0 center;
      background-size: 100%;
    }
    .time {
      font-size: 28px;
      color: @c-121212;
      margin-left: 50px;
    }
    .orange {
      position: absolute;
      font-size: 28px;
      color: @c-ff6600;
      right: 75px;
    }
    .blue-start {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #3096F9;
      color: @c-fff;
      position: absolute;
      top: 65px;
      right: 30px;
      text-align: center;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      font-size: 22px;
    }
  }
</style>
