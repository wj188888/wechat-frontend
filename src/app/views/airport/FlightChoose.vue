<template>
  <main-box :title="title">
    <div class="inline-box mar-t-20 line line-x-t" @click="jumpToAirPortCity('startPlace')">
      <label>出发城市</label>
      <input type="text" v-model="searchKeys.startPlace.airportName" placeholder="请选择出发城市" readonly/>
      <a @click.stop="jumpToFlightNumber" class="flight-search">根据航班号查询</a>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t">
      <label>到达城市</label>
      <input type="text" v-model="searchKeys.endPlace.airportName" placeholder="请选择到达城市" readonly/>
    </div>
    <div class="inline-box mar-b-20 line line-x">
      <label>起飞日期</label>
      <input type="text" placeholder="请选择起飞日期" v-mobidate:dateStart="searchKeys.date" readonly/>
    </div>

    <div class="mar-lr-20">
      <input @click="variflightFindByNum" type="button" class="button button-primary" value="查询"/>
    </div>

    <div class="flight-tip">
      <i></i>
      <span>国际航班起降时间均为当地时间</span>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Mobidate from 'directives/mobiDate'
  const now = new Date()

  export default {
    directives: {
      Mobidate
    },
    components: {
      MainBox
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        dataPageName: '',
        searchKeys: {
          startPlace: '',
          endPlace: '',
          date: ''
        },
        airportCode: '',
        dateStart: {
          min: now,
          max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          yearSuffix: '年',
          daySuffix: '日',
          dateWheels: '|MM dd DD|',
          dateFormat: 'yy-mm-dd'
        },
      }
    },
    mounted () {
      //取值为pick
      this.dataPageName = this.$route.query.pageRouter
      this.searchKeys.endPlace = {
        airportName: this.$route.query.endPlace,
        airportCode: this.$route.query.airportCode
      }

      if (appStorage.get(this.pageRouter)) {
        this.searchKeys = JSON.parse(appStorage.get(this.pageRouter))

        //本地存储日期小于当前日期取值当前日期
        if (TOOL.dateCompare(this.searchKeys.date) < 0) {
          this.searchKeys.date = TOOL.newGetDate({type: 'date'})
        }
      }
    },
    methods: {

      /**
       * 存储订单到本地数据
       */
      saveFlightChooseForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.searchKeys))
      },

      /**
       * 跳转到机场城市选择界面
       */
      jumpToAirPortCity (dataKey) {
        this.saveFlightChooseForm()
        this.$router.push({
          name: 'airPortCity',
          query: {
            pageRouter: this.pageRouter,
            dataKey: dataKey
          }
        })
      },

      /**
       * 跳转到航班号搜索界面
       */
      jumpToFlightNumber () {
        this.saveFlightChooseForm()
        this.$router.replace({
          name: 'flightNumber',
          query: {
            pageRouter: this.dataPageName
          }
        })
      },

      /**
       * 查询航班
       */
      variflightFindByNum () {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace.airportCode, emptyTips: '请选择出发城市'},
          {value: this.searchKeys.endPlace.airportCode, emptyTips: '请选择到达城市'},
          {value: this.searchKeys.date, emptyTips: '请选择起飞日期'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.saveFlightChooseForm()
        this.$router.push({
          name: 'flightList',
          query: {
            pageRouter: this.dataPageName,
            type: 'flightChoose',
            startPlace: this.searchKeys.startPlace.airportCode,
            endPlace: this.searchKeys.endPlace.airportCode,
            date: this.searchKeys.date
          }
        })
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .flight-tip {
    margin-top: 90px;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    i {
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("../../../assets/airport/warning.png") no-repeat 0 0;
      margin-top: 3px;
      background-size: 100%;
      vertical-align: top;
    }
    span {
      display: inline-block;
      font-size: 24px;
      color: @fc-929292;
    }
  }
  .flight-search {
    flex: 1;
    font-size: 24px;
    color: @fc-262626;
    height: 100px;
    line-height: 100px;
    padding-right: 20px;
    text-align: right;
  }
</style>
