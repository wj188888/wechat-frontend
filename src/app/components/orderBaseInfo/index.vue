<template>
  <div class="order-ticket-info line line-x-b" v-show="data.productTypeLevelTwo">
    <h2>
      <span>&nbsp;【 {{data.productTypeLevelTwo || data.productTypeLevelOne | getProductTwoName}} 】&nbsp;</span>
      <span class="citya-box" v-if="data.productTypeLevelOne !== 'WORK_BUS' && data.productTypeLevelOne !== 'SCHOOL_BUS'">
        {{ data.aAddress | getAddress }}
      </span>
      <span class="jt-tour-type" :class="{'jt-two-way':data.tourType === 0 && data.productTypeLevelOne === 'CUSTOM_BUS'}" v-if="data.productTypeLevelOne !== 'WORK_BUS' && data.productTypeLevelOne !== 'SCHOOL_BUS'"></span>
      <span v-if="data.productTypeLevelOne !== 'WORK_BUS' && data.productTypeLevelOne !== 'SCHOOL_BUS'">
        {{ data.bAddress | getAddress }}
      </span>
      <slot name="price"></slot>
    </h2>
    <p class="ticket-time">
      {{ data.startupTime | formatDate('monthDayHour') }}&nbsp;&nbsp;&nbsp;<span class="line line-box radius-box" v-if="data.carGrade">{{data.carGrade | getCarType}}</span>
    </p>
    <div class="ticket-info">
      <ul>
        <li>
          {{ data.aAddress | getStation(data.onStation) }}
          <span class="reach-time" v-if="data.onStation && data.onStation.reachTime">
            预计 <em>{{getTime(data.onStation.reachTime)}}</em>
          </span>
        </li>
        <li>
          {{ data.bAddress | getStation(data.offStation) }}
          <span class="reach-time" v-if="data.offStation && data.offStation.reachTime">
            预计 <em>{{getTime(data.offStation.reachTime)}}</em>
          </span>
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
      props:['data'],
      data() {
          return {

          }
      },
      mounted() {

      },
      methods: {
        /**
         * 分段计价计算预计到达时间
         */
        getTime(reachTime){
          let time = reachTime * 60 * 1000 + +TOOL.newGetDate({date: this.data.startupTime, type: 'formatDate'})
          return TOOL.newGetDate({date: time, type: 'time'})
        },
      }
  }
</script>


<style scoped lang="less">
  @import '../../../styles/theme.less';

  .order-ticket-info {
    padding: 22px 20px;
    background-color: #fff;
    h2 {
      margin-left: -16px;
      margin-bottom: 30px;
      font-weight: normal;
      font-size: 32px;
      color: #121212;
      .citya-box {
        margin-left: -12px;
      }
      .jt-tour-type {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 30px;
        background:url("../../../assets/jt_one_way.png") no-repeat center center;
        background-size:37px 9px;
        vertical-align: top;
      }
      .jt-two-way{
        background:url("../../../assets/jt_two_way.png") no-repeat center center;
        background-size:37px 20px;
      }
    }
    .ticket-time {
      margin-bottom:25px;
      padding-left: 50px;
      background: url('../../../assets/order_time.png') no-repeat 0 center;
      background-size: 30px 30px;
      font-size: 28px;
      color: #4c4c4c;
      span{
        position: relative;
        top:-2PX;
        padding:5px 10px;
        font-size:24px;
      &:after{
         border-color:#dfdfdf;
       }
      }
    }
    .ticket-info {
      position: relative;
      margin-bottom: 20px;
      overflow: hidden;
      li {
        position: relative;
        line-height: 34px;
        margin-bottom: 25px;
        padding-left: 50px;
        padding-right:140px;
        font-size: 28px;
        color: #4c4c4c;
        background: url('../../../assets/order_start.png') no-repeat 0 center;
        background-size: 30px 30px;
        &:last-child {
           margin-bottom: 0;
         }
        &:last-child {
           background: url('../../../assets/order_end.png') no-repeat 0 center;
           background-size: 30px 30px;
         }
      }
      .reach-time{
        position: absolute;
        top:0;
        right:0;
        line-height: 34px;
        color:#2290f9;
        em{
          color:#4c4c4c;
        }
      }
    }
  }
</style>
