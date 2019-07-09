<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="flight-container">
      <h3 v-if="flightList.length > 0">{{ date | formatDate('monthDay') }}</h3>
      <ul class="flight-list" v-if="flightList.length > 0">
        <li v-for="flight in flightList" @click="setFlight(flight)">
          <div class="airline-name" :style="{backgroundImage:'url(\'' + flight.airLineImg + '\')'}">
            <span>{{ flight.airline | getAirline('name') }}</span>
            <span>{{ flight.airline | getAirline('code') }}</span>
          </div>
          <div class="airport-place">
            <div class="start">
              <p class="city" v-text="flight.takeoffTime"></p>
              <p class="place" v-text="flight.startPlace"></p>
            </div>
            <div class="border">
              <i class="right"></i>
            </div>
            <div class="end">
              <p class="city" v-text="flight.reachTime"></p>
              <p class="place" v-text="flight.endPlace"></p>
            </div>
          </div>
        </li>
      </ul>
      <div class="city-no-bus" v-if="flightList.length === 0">
        <p>对不起</p>
        <p>今天没有您搜索的航班</p>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'

  export default {
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: '',
        type: '',
        flightNumber: '',
        startPlace: '',
        endPlace: '',
        date: '',
        flightList: []
      }
    },
    mounted () {
      this.pageRouter = this.$route.query.pageRouter
      this.type = this.$route.query.type
      this.flightNumber = this.$route.query.flightNumber
      this.startPlace = this.$route.query.startPlace
      this.endPlace = this.$route.query.endPlace
      this.date = this.$route.query.date
      this.variflightFind()
    },
    methods: {
      /**
       * 搜索航班
       */
      variflightFind () {
        this.$store.commit('UPDATE_LOADING', true)
        let resouce, params;
        if (this.type == 'flightNumber') {
          params = {
            flightNumber: this.flightNumber,
            date: TOOL.newGetDate({date: this.date, type: 'holeDate'})
          }
          resouce = api.variflightFindByNum(params)
        } else {
          params = {
            startPlace: this.startPlace,
            endPlace: this.endPlace,
            date: this.date
          }
          resouce = api.variflightFindByPlace(params)
        }
        resouce.then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.$store.commit('UPDATE_LOADING', false)
            this.flightList = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 设置航班
       */
      setFlight (flight) {
        if (appStorage.get(this.pageRouter)) {
          let localData = JSON.parse(appStorage.get(this.pageRouter))
          localData.variflight = flight
          localData.variflightDate = this.date
          appStorage.set(this.pageRouter, JSON.stringify(localData))
          history.go(-2)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .flight-container {
    h3 {
      width: 100%;
      float: left;
      font-size: 24px;
      color: @fc-ccc;
      font-weight:normal;
      padding-left: 30px;
      height: 40px;
      line-height: 40px;
    }
    .flight-list {
      li {
        float: left;
        width: 100%;
        padding:20px;
        margin-bottom:15px;
        background-color: @bg-fff;
      }
      .airline-name{
        padding-left:50px;
        background: no-repeat left center;
        background-size: 28px 28px;
        font-size:26px;
        color: @fc-808080;
      }
      .airport-place{
        padding-top: 30px;
        margin: 0 auto;
        display: flex;
        .start,
        .end{
          flex:1;
          .city{
            margin-bottom:20px;
            font-size:40px;
            color: @fc-ff6600;
          }
          .place{
            font-size:26px;
            color: @fc-121212;
          }
        }
        .start{
          text-align:right;
        }
        .end{
          text-align:left;
        }
        .border{
          position: relative;
          top:40px;
          margin:0 30px;
          width: 96px;
          border-top: 1PX solid @bc-999;
          .right{
            position: absolute;
            top: -3PX;
            right: -1PX;
            height: 1PX;
            width: 12px;
            border-top: 1PX solid @bc-999;
            display: inline-block;
            transform: rotate(40deg);
          }
        }
      }
    }
  }
</style>
