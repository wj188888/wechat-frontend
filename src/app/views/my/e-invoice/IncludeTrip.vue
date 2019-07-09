<template>
    <main-box :title="title" :show-more="false">
      <div class="scroll-box">

        <div class="ticket-order">
          <ul class="order-list">
            <li class="line line-x flex-li" v-for="data in includeTrip">
              <div class="mes-center">
                <div class="hd clearfix mar-t-25 mar-b-25 f-s-26 pad-0" style="height: auto">
                  <span class="text-gray">{{data.productTypeLevelTwo | getProductTwoName}}&nbsp;&nbsp;{{data.startupTime.substring(0,16)}}</span>
                </div>
                <div class="bd pad-0">
                  <div class="order-station f-s-28 mar-b-15">
                    <i class="start-dian mar-r-10"></i>
                    <span>{{data.aAddress.searchShowAddress}}&nbsp;</span>
                    <em class="dian"></em>
                    <span class="rental-address-limit" v-if="data.aAddress.stationName">&nbsp;{{data.aAddress.stationName + data.aAddress.name}}</span>
                    <span class="rental-address-limit" v-else>&nbsp;{{data.aAddress.name}}</span>
                  </div>
                  <div class="order-station f-s-28 off-station">
                    <i class="end-dian mar-r-10"></i>
                    <span>{{data.bAddress.searchShowAddress}}&nbsp;</span>
                    <em class="dian"></em>
                    <span class="rental-address-limit" v-if="data.bAddress.stationName">&nbsp;{{data.bAddress.stationName + data.bAddress.name}}</span>
                    <span class="rental-address-limit" v-else>&nbsp;{{data.bAddress.name}}</span>
                  </div>
                </div>
              </div>
              <div class="mes-right text-right f-s-32 relative">
                <P class="money-position yuan"><em class="money">{{data.actualPayment | formatPrice('normal')}}</em>元</P>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import Scroll from 'components/betterScroll/scroll/scroll'
    import { XDialog } from 'vux'

    export default {
        components: {
            MainBox,
            Scroll,
            XDialog
        },
        data () {
            return {
                title: this.$route.meta.title,
                includeTrip:[],
            }
        },
        mounted () {
            this.initialize()
        },
        methods: {
            initialize () {
              if(appStorage.get('invoiceOrders')){
                this.includeTrip = JSON.parse(appStorage.get('invoiceOrders'));
              }
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../../styles/theme.less";


    .flex-li{
       display: flex;
      flex-wrap: nowrap;
      height: 170px;
      align-items: center;
      padding: 0 30px;
      .mes-left{
        width: 50px;
        height:100%;
        .check-item{
          height:100%;
          margin-bottom: 0;
          border: 0;
        }
        .check-box{
          width: 100%;
          height:100%;
          padding-left: 0;
        }
      }
      .mes-center{
        flex:1;
        height:100%;
      }
      .mes-right{
        width: 150px;
        height:100%;
      }
      .icon-com{
        left: 0 ;
        top:70px ;
      }
    }
    .start-dian {
      width: 30px;
      height:30px;
      background-color: transparent !important;
      background: url("../../../../assets/order_start.png") no-repeat left center;
      background-size: 100% 100%;
    }
    .end-dian {
      width: 30px;
      height:30px;
      background-color: transparent !important;
      background: url("../../../../assets/order_end.png") no-repeat left center;
      background-size: 100% 100%;
    }
  .dian{
    display: inline-block;
    width: 5px;
    height:5px;
    background: #121212;
    border-radius: 50%;
    vertical-align: middle;
  }
  .money{
    font-size:28px;
    color: #ff6600;
  }
  .yuan{
    font-size:28px;
    color: #4c4c4c;
  }
  .money-position{
    position: absolute;
    bottom:0;
    right:0;
    margin-bottom: 20px;
  }

</style>
