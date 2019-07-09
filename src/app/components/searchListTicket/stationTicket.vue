<template>
  <div v-if="skus.length > 0">
    <ticket-title :title="title"></ticket-title>
    <div class="station-ticket-box list-box line line-x-t"
         v-for="sku in skus"
         @click="jumpToPage(sku.id, sku.price)">
      <div class="order-box">
        <div class="start clearfix">
          <span class="time" v-if="sku.isFlow === 0">{{ sku.startupTime | formatDate('time') }}</span>
          <p class="station-start" v-if="sku.isFlow === 1">
            <span>{{ sku.startupTime | formatDate('time') }}</span>
            <span>前有效</span>
          </p>
          <span class="circle circle-bg-start">始</span>
          <span class="place">{{sku.source + ' ' + (sku.sourceDetailAddress || '')}}</span>
          <div class="price">
            <p class="number">{{'¥' + sku.price}}</p>
            <p class="remain">余票<em>{{sku.availableSeats + '张'}}</em></p>
            <p class="fix-time station-time">
              <span class="liushui" v-if="sku.isFlow === 1">流水班</span>
              <span class="guding" v-else>固定班</span>
            </p>
          </div>
        </div>
        <div class="end clearfix">
          <span class="company">{{sku.firmName}}</span>
          <span class="circle circle-bg-end" v-if="sku.destination === sku.terminal">终</span>
          <span class="circle circle-bg-station" v-else>过</span>
          <span class="place">{{sku.destination + ' ' + (sku.destDetailAddress || '')}}</span>
        </div>
      </div>
      <ticket-discount :sku="sku" @showDiscountDialog="showDiscountDialog"></ticket-discount>
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
    mounted () {},
    methods:{
      jumpToPage (ticketId, price) {
        this.$emit('jumpToPage', ticketId, price)
      },

      showDiscountDialog (discountSku) {
        this.$emit('showDiscountDialog', discountSku)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .station-ticket-box {
    width:100%;
    padding-top: 40px;
    padding-bottom:25px;
    position: relative;
    background-color: @c-fff;
    &:active{
      -moz-opacity:0.8;
      opacity:0.8;
    }
    .remain {
      font-size: 24px;
    }
    .fix-time {
      font-size: 24px;
      color: @fc-929292;
      text-align: right;
      margin-top: 17px;
    }
  }

  .station-start {
    float: left;
    width: 6rem;
    margin-left: 20px;
    font-size: 20px;
    span {
      float: left;
      width: 100%;
      color: #ff6600;
      &:first-child {
        font-size: 40px;
        color: #212325;
      }
    }

  }

  .station-time {
    margin-top: 10px !important;
    span {
      padding: 6px 8px 5px;
      color: #fff;
      -webkit-border-radius: 4px;
      border-radius: 4px;
    }
    .guding {
      background-color: #A3DBFC;
    }
    .liushui {
      background-color: #FEBEA2;
    }
  }
</style>
