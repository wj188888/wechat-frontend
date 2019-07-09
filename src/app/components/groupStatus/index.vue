<template>
  <div class="carpooling-detail-box pad-b-60">
    <ul class="carpooling-user-list" :class="{'one-row': data.minTeamMember < 5}">
      <li :class="{'ten-more': data.minTeamMember > 10, 'active': (data.unPayCount > 0 && data.hasAttend) ? i <= data.unPayCount : i <= (data.minTeamMember - data.availableSeats)}" v-for="i in data.minTeamMember"></li>
    </ul>
      <!--* 拼车状态 0.未付款 1.未成团，2.未安排，3.已安排，4.已失效（过期未支付），5.已取消（司机或企业超时未响应）-->
      <p class="group-tip" v-show="data.carPoolStatus == 1">
          <span v-if="data.availableSeats > 0 || (data.unPayCount > 0 && data.hasAttend)">
              还差&nbsp;<span class="c-f-primary">{{data.availableSeats || data.unPayCount}}</span>&nbsp;人成团
          </span>
          <span v-else>拼团成功</span>
      </p>
      <div class="countdown-box" @on-finish="finish" v-show="data.carPoolStatus == 1 && data.availableSeats > 0">
          <clocker :time="time" slot="value">
              <span>剩余</span>
              <span class="c-f-primary">
                    <span class="time">%D</span>
                    <span class="split">天</span>
                    <span class="time">%H</span>
                    <span class="split">时</span>
                    <span class="time">%M</span>
                    <span class="split">分</span>
                    <span class="time">%S</span>
                    <span class="split">秒</span>
                </span>
              <span>结束</span>
          </clocker>
      </div>
      <p v-show="data.carPoolStatus == 2" class="group-tip">拼团成功，正在为您安排车辆~</p>
      <p v-show="data.carPoolStatus == 3" class="group-tip">该团已拼团成功~</p>
      <p v-show="data.carPoolStatus == 5" class="group-tip">拼团失败，再去建一个吧~</p>
  </div>
</template>

<script>
  import { Clocker } from 'vux'
  export default {
      components: {
        Clocker
      },
      props: ['data'],
      computed: {
        time () {
            return this.data.teamExpireTime || TOOL.newGetDate({date: new Date(), type: 'future'})
        }
      },
      data() {
          return {

          }
      },
      mounted() {

      },
      methods: {
          /**
           * 倒计时结束
           */
          finish () {
              this.$emit('finish')
          }
      }
  }
</script>
<style lang="less" scoped>
  .countdown-box {
    width: 100%;
    height: 24px;
    margin-top: 26px;

    font-size: 24px;
    text-align: center;
    color: #4c4c4c;
  }
  .group-tip {
    width: 100%;
    height: 32px;

    font-size: 32px;
    color: #4c4c4c;
    text-align: center;
  }
  .pad-b-60 {
    padding-bottom: 60px;
  }
</style>
