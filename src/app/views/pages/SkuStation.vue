<template>
  <main-box :title="title">
    <div class="container-map">
      <div class="ticket-box line line-x-b">
        <div class="mar-40-20">
          <div class="container-box line line-box radius-box" style="height:10rem;">
            <div class="order-box">
              <div class="start clearfix">
                <span class="time">{{ workSku.startupTime | formatDate('time') }}</span>
                <span class="circle circle-bg-start">始</span>
                <span class="place" v-text="workSku.aAddress.detailAddress">青羊区</span>
                <div class="price">
                  <p class="number" v-text="'¥' + workSku.price">¥0</p>
                  <p class="remain" v-text="'余票' + workSku.availableSeats + '张'">余票6张</p>
                </div>
              </div>
              <div class="end clearfix">
                <span class="company" v-text="workSku.firmName">店铺名字</span>
                <span class="circle circle-bg-end">终</span>
                <span class="place" v-text="workSku.bAddress.detailAddress">成都国际节能大厦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-station">
        <ul class="station-list">
          <li class="line line-x-b" v-for="station in stationList" @click="setStation(station)">
            <i class="station-num" v-text="station.rank + 1"></i>
            <span v-text="station.name"></span>
            <!--<span class="station-tag station-start" v-if="station.rank == 0">起点</span>-->
            <!--<span class="station-tag station-end" v-if="station.rank && station.rank == stationPop.stationList.length">终点</span>-->
          </li>
        </ul>
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
        dataKey: '',
        workSku: {
          aAddress:{},
          bAddress:{},
        },
        stationList: '',
      }
    },
    mounted(){
      this.pageRouter = this.$route.query.pageRouter
      this.dataKey = this.$route.query.dataKey
      if (appStorage.get(this.pageRouter)) {
        this.workSku = JSON.parse(appStorage.get(this.pageRouter))
        this.stationList = this.workSku[this.dataKey + 'List']
      }
    },
    methods: {

      /**
       * 设置站点
       * @param station
       */
      setStation (station) {
        this.workSku[this.dataKey] = station.name
        appStorage.set(this.pageRouter, JSON.stringify(this.workSku))
        this.$router.go(-1)
      },
    }
  }
</script>
