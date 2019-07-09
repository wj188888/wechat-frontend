<template>
  <ul>
    <li class="score-ticket-box line line-x-t" v-for="data in datas" @click="jumptoScoreOrder(data)">
      <div class="order-box">
        <div class="start clearfix">
          <span class="icon-procduct" :class="[data.productTypeLevelTwo || data.productTypeLevelOne]"></span>
          <span class="circle circle-bg-start">始</span>
          <span class="place">{{ data.aAddress | getAddressTitle }}</span>
          <div class="price">
            <p class="number"><em>{{data.integralPrice}}积分</em> 起</p>
            <p class="fix-time">已换{{data.exchangeTimes}}份</p>
          </div>
        </div>
        <div class="end clearfix">
          <span class="company">{{data.productTypeLevelTwo || data.productTypeLevelOne | getProductTwoName}}</span>
          <span class="circle circle-bg-end">终</span>
          <span class="place">{{ data.bAddress | getAddressTitle }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
  export default {
    props:['datas'],
    data () {
      return {

      }
    },
    mounted () {},
    methods: {
      jumptoScoreOrder (data) {
        let specialProduct = [
          'CITY_SPECIAL_BUS',
          'AIRPORT_SPECIAL_BUS',
          'TRAIN_SPECIAL_BUS',
          'SCHOOL_SPECIAL_BUS',
          'SCENIC_SPECIAL_BUS'
        ]

        let expressProduct = [
          'CITY_EXPRESS_BUS',
          'AIRPORT_EXPRESS_BUS',
          'TRAIN_EXPRESS_BUS',
          'SCHOOL_EXPRESS_BUS',
          'SCENIC_EXPRESS_BUS'
        ]

        if(specialProduct.indexOf(data.productTypeLevelTwo) > -1){
          appStorage.remove('scoreBusSpecial')
          this.$router.push({
            name: 'scoreBusSpecial',
            query: {
              productId: data.productId,
              startPlace: data.aAddress.city,
              endPlace: data.bAddress.city,
              integralExId: data.exchangeRuleId,
              productTypeLevelOne: data.productTypeLevelOne,
            }
          })
        }else if(expressProduct.indexOf(data.productTypeLevelTwo) > -1){
          appStorage.remove('scoreBusExpress')
          this.$router.push({
            name: 'exchangeProductSku',
            query: {
              productId: data.productId,
              productTypeLevelOne: data.productTypeLevelOne,
              productTypeLevelTwo: data.productTypeLevelTwo,
            }
          })
        }else if(data.productTypeLevelOne === 'STATION_BUS'){
          appStorage.remove('scoreBusStation')
          this.$router.push({
            name: 'exchangeProductSku',
            query:{
              productId: data.productId,
              productTypeLevelOne: data.productTypeLevelOne,
              productTypeLevelTwo: data.productTypeLevelTwo,
            }
          })
        }else{
          appStorage.remove('scoreBusTour')
          this.$router.push({
            name: 'scoreBusTourProduct',
            query:{
              productId: data.productId,
              integralPrice: data.exchangeIntegral,
              integralExId: data.exchangeRuleId
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .score-ticket-box {
    width:100%;
    padding-top: 30px;
    padding-bottom:30px;
    position: relative;
    background-color: @c-fff;
    &:active{
      -moz-opacity:0.8;
      opacity:0.8;
    }
    .number{
      font-size:24px;
      color:@fc-888;
      em{
        font-size:32px;
        color:@fc-ff6600;
      }
    }
    .place{
      width:300px;
    }
    .icon-procduct{
      float:left;
      margin-left:60px;
      margin-right:20px;
      width:70px;
      height:70px;
      background: no-repeat center center;
      background-size:70px 70px;
      &.CITY_SPECIAL_BUS{
        background-image:url("../../../../static/pics/CITY_SPECIAL_BUS.png")
      }
      &.CITY_EXPRESS_BUS{
        background-image:url("../../../../static/pics/CITY_EXPRESS_BUS.png")
      }
      &.STATION_BUS,
      &.STATION_FIXED_BUS,
      &.STATION_STREAM_BUS{
        background-image:url("../../../../static/pics/STATION_BUS.png")
      }

      &.AIRPORT_SPECIAL_BUS{
        background-image:url("../../../../static/pics/AIRPORT_SPECIAL_BUS.png")
      }
      &.AIRPORT_EXPRESS_BUS{
        background-image:url("../../../../static/pics/AIRPORT_EXPRESS_BUS.png")
      }

      &.TRAIN_SPECIAL_BUS{
        background-image:url("../../../../static/pics/TRAIN_SPECIAL_BUS.png")
      }
      &.TRAIN_EXPRESS_BUS{
        background-image:url("../../../../static/pics/TRAIN_EXPRESS_BUS.png")
      }

      &.SCHOOL_SPECIAL_BUS{
        background-image:url("../../../../static/pics/SCHOOL_SPECIAL_BUS.png")
      }
      &.SCHOOL_EXPRESS_BUS{
        background-image:url("../../../../static/pics/SCHOOL_EXPRESS_BUS.png")
      }

      &.SCENIC_SPECIAL_BUS{
        background-image:url("../../../../static/pics/SCENIC_SPECIAL_BUS.png")
      }
      &.SCENIC_EXPRESS_BUS{
        background-image:url("../../../../static/pics/SCENIC_EXPRESS_BUS.png")
      }

      &.TOUR_SCENIC{
        background-image:url("../../../../static/pics/TOUR_BUS.png")
      }
    }
    .fix-time {
      font-size: 24px;
      color: @fc-888;
      text-align: right;
      margin-top: 64px;
    }
    .company{
      width:100px!important;
      margin-left:50px!important;
      color: @fc-4c4c4c !important;
      text-align: center;
    }
  }
</style>
