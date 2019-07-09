<template>
  <main-box :title="title" main-class="scrollingBox">
    <div class="inline-box mar-t-20 line line-x">
      <label>航班号</label>
      <input type="text" v-model="searchKeys.flightNumber" placeholder="请输入航班号"/>
      <a @click.stop="jumpToFlightChoose" class="flight-search">根据起降城市查询</a>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box mar-b-20 line line-x">
      <label>起飞日期</label>
      <input type="text" placeholder="请选择起飞日期" v-mobidate:dateStart="searchKeys.date" readonly/>
    </div>
    <div class="mar-lr-20">
      <input type="button" @click="variflightFindByNum" class="button button-primary" value="查询"/>
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
          flightNumber: '',
          date: '',
        },
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
       * 存储搜索条件
       */
      saveFlightNumberForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.searchKeys))
      },

      /**
       * 跳转到起降城市搜索界面
       */
      jumpToFlightChoose () {
        this.saveFlightNumberForm()
        this.$router.replace({
          name: 'flightChoose',
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
          {value: this.searchKeys.flightNumber, emptyTips: '请输入航班号'},
          {value: this.searchKeys.date, emptyTips: '请选择起飞日期'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.saveFlightNumberForm()
        this.$router.push({
          name: 'flightList',
          query: {
            pageRouter: this.dataPageName,
            type: 'flightNumber',
            flightNumber: this.searchKeys.flightNumber,
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
