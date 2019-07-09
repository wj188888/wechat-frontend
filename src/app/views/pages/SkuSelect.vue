<template>
  <main-box :title="title" main-class="scrollingBox" :go-back="goBack">
    <div class="canlendar-box">
      <p class="canlendar-year">
        <span class="prev-year" :class="{'disabled': disablePrev}" @click="prevMonth()"></span>
        <span class="year-text" v-text="yearMonthText"></span>
        <span class="next-year" :class="{'disabled': disableNext}" @click="nextMonth"></span>
      </p>
      <ul class="canlendar-week">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <div class="calender-layout" :class="{'to-left': toLeft}">
        <div class="calendar-box" v-for="monthList in monthLists">
          <price-calendar
                  :render-month="monthList.value"
                  :hide-header="true"
                  :hide-week-list="true"
                  :return-six-rows="false"
                  v-model="currentValue"
                  :show-last-month="false"
                  :show-next-month="false"
                  :disable-past="true"
                  :replace-text-list="{'TODAY':'今天'}"
                  @afterSelect="afterSelect"
                  :render-function="buildSlotFn"
                  :render-on-value-change="false"></price-calendar>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import PriceCalendar from 'components/price-calendar/index.vue'

  const date = new Date()
  export default {
    components: {
      MainBox,
      PriceCalendar
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: '',
        storeId: '',
        flightId: '',
        skuList: [],
        currentValue: '',
        nowYear: date.getFullYear(),
        nowMonth: date.getMonth() + 1,
        toLeft: false,
        disablePrev: true,
        disableNext: false,
        yearMonthText: date.getFullYear() + '年' + (date.getMonth() + 1) + '月',
      }
    },
    computed: {
      monthLists () {
        let nextYear = 0, nextMonth = 0;
        if (this.nowMonth == 12) {
          nextMonth = 1
          nextYear = this.nowYear + 1
        } else {
          nextMonth = this.nowMonth + 1
          nextYear = this.nowYear
        }

        return [
          {name: this.nowYear + ' - ' + this.nowMonth, value: [this.nowYear, this.nowMonth]},
          {name: nextYear + ' - ' + nextMonth, value: [nextYear, nextMonth]},
        ]
      },
    },
    mounted () {
      this.pageRouter = this.$route.query.pageRouter
      this.storeId = this.$route.query.storeId
      this.flightId = this.$route.query.flightId
//      this.payType = this.$route.query.payType
      this.productId = this.$route.query.productId
      this.carBrand = this.$route.query.carBrand
      this.totalSeats = this.$route.query.totalSeats
      this.startDate = this.$route.query.startDate
      this.endDate = this.$route.query.endDate
      this.skuFind()
    },
    methods: {
      buildSlotFn (line, index, data) {
        let temp = '';
//        data.disabled = true
        for (let m = 0; m < this.skuList.length; m++) {
          let newValTemp = this.skuList[m], startupTime, sMonth, sTime;
          if (this.pageRouter == 'carpooling' || this.pageRouter == 'carpoolingSelf') {
            if (newValTemp.date) {
              startupTime = newValTemp.date.replace(/-/g, '\/')
              sMonth = new Date(startupTime).getMonth();
              sTime = new Date(startupTime).getDate();
              if (sMonth == data.month && sTime == data.day) {
                temp = '¥' + newValTemp.carPoolPrice
                if (this.pageRouter == 'carpoolingSelf') {
                  temp = '¥' + newValTemp.charterPrice
                }
                
                //当天是否发车
                if (newValTemp.startup) {
                  data.disabled = false
                }else{
                  data.disabled = true
                }
                data.date = newValTemp.date
                break
              }
            }
          } else {
            if (newValTemp.startupTime) {
              startupTime = newValTemp.startupTime.replace(/-/g, '\/')
              sMonth = new Date(startupTime).getMonth();
              sTime = new Date(startupTime).getDate();
              if (sMonth == data.month && sTime == data.day) {
                if(this.pageRouter === 'scoreBusTour'){
                  temp = newValTemp.integralPrice
                }else{
                  temp = '¥' + newValTemp.price
                }
                data.disabled = false
                data.id = newValTemp.id
                break
              }
            }
          }
        }
        return temp;
      },
      /**
       * 根据店铺id SkuId查询SKU信息
       */
      skuFind () {
        this.$store.commit('UPDATE_LOADING', true)
        let resource;
        if (this.pageRouter === 'porderWrite') {
          resource = api.findSightSku(this.flightId, {
            productId: this.flightId,
            startDate: this.startDate,
            endDate: this.endDate
          })
        }else if(this.pageRouter === 'scoreBusTour'){
          resource = api.integralExchangeGetPrices({
            productId: this.flightId,
            exchangeType: 0,
            startDate: this.startDate,
            endDate: this.endDate
          })
        } else if (this.pageRouter === 'workTicket') {
          resource = api.workSkuFind({flightId: this.flightId, storeId: this.storeId})
        } else if (this.pageRouter === 'carpooling' || this.pageRouter === 'carpoolingSelf') {
          resource = api.lineProductGetPrices(this.productId, {
            carBrand: this.carBrand,
            totalSeats: this.totalSeats,
            startDate: this.startDate,
            endDate: this.endDate,
          })
        }
        resource.then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.skuList = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg)
          }
        })
      },

      prevMonth () {
        if (this.disablePrev) return
        this.disablePrev = true
        this.disableNext = false
        this.toLeft = false
        this.yearMonthText = this.monthLists[0]['value'][0] + '年' + this.monthLists[0]['value'][1] + '月'
      },

      nextMonth () {
        if (this.disableNext) return
        this.disablePrev = false
        this.disableNext = true
        this.toLeft = true
        this.yearMonthText = this.monthLists[1]['value'][0] + '年' + this.monthLists[1]['value'][1] + '月'
      },

      /**
       * 打开日期选择车票
       */
      afterSelect (value) {
        let localData = {}
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        for (let i = 0; i < this.skuList.length; i++) {
          if (this.pageRouter == 'carpooling' || this.pageRouter == 'carpoolingSelf') {
            if (this.skuList[i].date == value.date) {
              localData.skuPrice = this.skuList[i]
              appStorage.set(this.pageRouter, JSON.stringify(localData));
              this.$router.go(-1)
              break
            }
          } else {
            if(!value.id) {
              appStorage.remove([this.pageRouter])
              return
            }
            if (this.skuList[i].id == value.id) {
              localData = Object.assign(localData, this.skuList[i])
              appStorage.set(this.pageRouter, JSON.stringify(localData));
              this.$router.go(-1)
              break
            }
          }
        }
      },

      goBack () {
        appStorage.remove([this.pageRouter])
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang="less">
  @import "../../../styles/theme.less";
  .canlendar-box{
    font-size:26px;
    color:#262424;
    text-align:center;
    .canlendar-year{
      height:70px;
      line-height:70px;
      font-size:32px;
      color:#2b2f32;
      text-align:center;
      background-color: @bg-f2f2f2;
      span{
        display: inline-block;
        height: 70px;
        vertical-align: middle;
      }
      .year-text{
        margin:0 40px;
      }
      .prev-year,
      .next-year{
        width:180px;
        background-repeat:no-repeat;
        background-size:13px 22px;
      }
      .prev-year{
        padding-right: 40px;
        background-position:140px center;
        background-image:url('../../../assets/month_left_active.png');
        &.disabled{
           background-image:url('../../../assets/month_left.png');
        }
      }
      .next-year{
        padding-left:40px;
        background-position:40px center;
        background-image:url('../../../assets/month_right_active.png');
        &.disabled{
           background-image:url('../../../assets/month_right.png');
        }
      }
    }
    .canlendar-week{
      display: flex;
      padding: 0 25px;
      height:60px;
      line-height:60px;
      background-color:#e5e5e5;
      li{
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-align:center;
        font-size:32px;
        color:#2b2f32;
      }
    }
    .calender-layout{
      position:relative;
      left:0;
      width:200%;
      overflow:hidden;
      transition:left .5s;
      &.to-left{
         left:-100%;
      }
    }
    .calendar-box{
      display:inline-block;
      width:50%;
      padding:30px 25px 80px;
      background: @bg-fff;
    }
    .inline-calendar td{
      position:relative;
      width:14.2857%;
      text-align:center;
      &.is-disabled span{
         line-height:80px;
         color: @fc-999;
      }
      >span{
         display:block;
         width:80%;
         height:80px;
         margin:0 auto;
         border-radius:3PX;
         font-size:32px;
         color:#2b2f42;
      }
      >.slot-box{
         position:absolute;
         bottom:15px;
         width:100%;
         text-align:center;
         font-size:24px;
         color: @fc-ff6600;
      }
      &.is-week-0,
      &.is-week-6 {
        span {
          color: #249fea;
        }
      }
      &.current{
        span{
          color: @fc-fff!important;
          background-color:#fb853d;
        }
        p{
          color: @fc-fff;
        }
      }
      &.is-today,
      &.is-today.is-disabled{
         color:#807e7e;
      }
    }
    .is-disabled{
      p{
        display:none;
      }
    }
  }
</style>
