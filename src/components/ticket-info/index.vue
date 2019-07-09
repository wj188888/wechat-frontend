<template>
  <div class="city-top-container line line-x-b">
    <span class="theme">{{productType}}</span>
    <div class="content">
      <div class="start">
        <p class="city">{{ ticketInfo.aAddress | getAddressTitle }}</p>
        <p class="place">{{ticketInfo.aAddress.detailAddress}}</p>
      </div>
      <div class="desc">
        <p class="time isflow-time" v-if="ticketInfo.isFlow === 1">
          <span>{{ ticketInfo.startupTime | formatDate('time') }}</span>
          <span><br/>前有效</span>
        </p>
        <span class="time" v-else>
          {{ ticketInfo.startupTime | formatDate('time') }}
        </span>
        <div class="border">
          <i class="right"></i>
        </div>
        <span class="date">{{ ticketInfo.startupTime | formatDate('date') }}</span>
      </div>
      <div class="end">
        <p class="city">{{ ticketInfo.bAddress | getAddressTitle }}</p>
        <p class="place">{{ticketInfo.bAddress.detailAddress}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['productType', 'ticketInfo'],
    data () {
      return {
        showNotice: false,
        showRefundNotice: false,
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "../../styles/theme.less";
  .city-top-container {
    position: relative;
    width: 100%;
    height: 200px;
    padding:0 20px;
    background-color: @c-fff;
    overflow:hidden;
    .theme {
      position: absolute;
      width: 120px;
      height: 40px;
      line-height: 40px;
      font-size:22px;
      text-align: center;
      color: @fc-6d6d6d;
      top: 20px;
      left: 30px;
      border: 1PX solid @bc-d9d9d9;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
    .content {
      display: flex;
      margin-top: 60px;
      .start, .end {
        flex: 3;
        min-width: 260px;
        .city {
          font-size: 34px;
          color: @fc-121212;
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .place {
          color: @fc-929292;
          font-size: 24px;
          padding-top: 15px;
          line-height: 30px;
          /*height: 50px;*/
          /*line-height: 50px;*/
          margin-top: 5px;
        }
      }
      .start{
        text-align:right;
      }
      .end{
        padding-right:20px;
      }
      .desc {
        flex:2;
        min-width: 168px;
        position: relative;
        text-align: center;
        padding-left: 20px;
        padding-right: 20px;
        .time {
          display: block;
          font-size: 37px;
          color: @fc-121212;
          margin-bottom: 10px;
        }
        .date {
          display: block;
          font-size: 24px;
          color: @fc-393a3e;
          margin-top: 10px;
        }
        .border {
          position: relative;
          width: 100%;
          border: 1PX solid @bc-d9d9d9;
        }
        .right {
          position: absolute;
          top: -5px;
          right: 0;
          height: 1PX;
          width: 10px;
          border: 1PX solid @bc-d9d9d9;
          display: inline-block;
          transform: rotate(40deg);
        }
      }
    }
  }
  .isflow-time {
    font-size: 24px !important;
  }

  .isflow-time span:last-child {
    font-size: 20px;
  }
</style>
