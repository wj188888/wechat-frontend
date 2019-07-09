<template>
  <div v-if="skus.length > 0">
    <ticket-title :title="title">
      <slot name="title"></slot>
    </ticket-title>
    <div class="express-ticket-box line line-x-t pad-b-0 mar-b-20" v-for="sku in skus"  @click="jumpToPage(sku.id, sku.price, sku.availableSeats)">
      <div class="order-box">
        <div class="start clearfix">
          <span class="time">{{ sku.startupTime | formatDate('monthDay') }}<br/> <em>{{ sku.startupTime | formatDate('time') }}</em></span>
          <span class="circle circle-bg-start">始</span>
          <span class="place">{{ sku.source + ' ' + (sku.sourceDetailAddress || '') }}</span>
          <div class="price">
            <p class="number" v-if="sku.minPrice > 0 && sku.minPrice < sku.maxPrice">¥{{getPrice(sku.minPrice)}}<span class="qi">起</span></p>
            <p class="number" v-else-if="sku.minPrice > 0 && sku.minPrice === sku.maxPrice">¥{{getPrice(sku.minPrice)}}</p>
            <p class="number" v-else>{{'¥' + sku.price}}</p>
            <p class="remain">余票<em>{{ sku.availableSeats + '张' }}</em></p>
            <p class="fix-time">{{ sku.carGrade | getCarType }}</p>
          </div>
        </div>
        <div class="end clearfix">
          <span class="company">{{ sku.firmName }}</span>
          <span class="circle circle-bg-end">终</span>
          <span class="place">{{ sku.destination + ' ' + (sku.destDetailAddress || '' )}}</span>
        </div>
      </div>
      <ticket-discount :sku="sku" @showDiscountDialog="showDiscountDialog"></ticket-discount>
      <a class="button button-empty-white button-no-radius button-more line line-x-t mar-t-15" @click.stop="showMoreRecommend(sku)">查看更多班次</a>
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
        sku: '',
        showDiscount: false
      }
    },
    mounted () {},
    methods:{
      jumpToPage (ticketId, price, availableSeats) {
        this.$emit('jumpToPage', ticketId, price, availableSeats)
      },
      
      getPrice (price) {
        if(price < 1){
          return price.toFixed(2)
        }else{
          return price
        }
      },
      
      showDiscountDialog (discountSku) {
        this.$emit('showDiscountDialog', discountSku)
      },
  
      showMoreRecommend (sku) {
        this.$emit('showMoreRecommend', sku)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .express-ticket-box {
    width:100%;
    padding-top: 30px;
    padding-bottom:30px;
    position: relative;
    background-color: @c-fff;
    &:active{
      -moz-opacity:0.8;
      opacity:0.8;
    }
    .remain {
      font-size: 24px;
    }
    .time{
      font-size:28px!important;
      line-height:1.2!important;
      em{
        font-size:24px;
      }
    }
    .fix-time {
      font-size: 24px;
      color: @fc-929292;
      text-align: right;
      margin-top: 17px;
    }
  }

</style>