<template>
  <main-box :title="title" main-class="pad-20">
    <search-box
      :start-place="searchKeys.startPlace"
      :end-place="searchKeys.endPlace"
      @changeStation="changeStation"
      @jumpToFrom="jumpToCitySearch('startPlace')"
      @jumpToTo="jumpToCitySearch('endPlace')">
      <group class="datetime-x line line-x-t">
        <calendar
          title="出行时间"
          :replace-text-list="{'TODAY':'今'}"
          :weeks-list="calendar.weeksList"
          :disable-past="calendar.disablePast"
          :display-format="formatDate"
          v-model="searchKeys.startTime">
        </calendar>
      </group>
    </search-box>
    <input type="button" class="button button-primary" @click="search" value="查询"/>
    <div class="city-search" v-if="historySearch.length > 0">
      <div class="city-search__head">
        <div class="city-search__head-title">历史搜索</div>
        <div class="city-search__head-line"></div>
      </div>
      <div class="city-search__result">
        <div class="city-search__item" v-for="(item,index) in limitHistory(this.historySearch)"
             @click="historySearchFun(index)">
          <div class="city-search__onStation">
            {{item.startPlace}}
          </div>
          <div class="city-search__station-middle">
            <span class="city-search__station-line"></span>
          </div>
          <div class="city-search__offStation">
            {{item.endPlace}}
          </div>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import SearchBox from 'appComponents/searchBox/index.vue'
  import { Group, Calendar } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      SearchBox,
      Group,
      Calendar,
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
        historySearch: [],
        searchKeys: {
          startPlace: TOOL.placeHolder.startPlace,
          endPlace: TOOL.placeHolder.endPlace,
          startTime: 'TODAY'
        }
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    watch: {
      //定位城市初始化赋值
      appCity (newVal, val) {
        let localData = {}
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        this.searchKeys.startPlace = localData.startPlace || newVal
        this.location = appStorage.get('appCity') || newVal

      },
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      fomartDate (value, a) {
        return value
      },
      initialize () {
        if(this.$route.query.pageName){
          this.title = this.$route.query.pageName
        }
        this.pageId = this.$route.query.pageId || 1;
        // 获取最近历史搜索记录
        if(appStorage.get('cityHistorySearch')) {
            this.historySearch = JSON.parse(appStorage.get('cityHistorySearch'));
        }

        let localData = {};
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        this.location = appStorage.get('appCity') || this.appCity
        this.searchKeys.startPlace = localData.startPlace || this.appCity
        this.searchKeys.endPlace = localData.endPlace || TOOL.placeHolder.endPlace
  
        let nowTime = TOOL.newGetDate({type: 'time'}),
          nowDate = TOOL.newGetDate({type: 'date'});
        if(localData.startTime){
          this.searchKeys.startTime = localData.startTime
        }else{
          this.searchKeys.startTime = nowDate
        }
        
        if(TOOL.dateCompare(this.searchKeys.startTime, nowDate) < 0){
          this.searchKeys.startTime = nowDate
        }
        
        /**
         * 控制时间超过下午18点就时间默认显示第二天
         */
        if (TOOL.dateCompare(nowTime, TOOL.rangeTime, 'time') > 0) {
          nowDate = TOOL.changeDate(nowDate, 'd', 1)
          this.searchKeys.startTime = TOOL.newGetDate({date: nowDate, type: 'date'});
        }
      },

      limitHistory (data) {
        return data.slice(0 ,3)
      },
  
      formatDate (date) {
        return TOOL.newGetDate({date: date, type: 'formatStartupTime'})
      },
      
      /**
       * 往返切换
       */
      changeStation () {
        let startPlace = this.searchKeys.startPlace
        if (this.searchKeys.endPlace !== TOOL.placeHolder.endPlace) {
          this.searchKeys.startPlace = this.searchKeys.endPlace
        } else {
          this.searchKeys.startPlace = TOOL.placeHolder.startPlace
        }

        if (startPlace !== TOOL.placeHolder.startPlace) {
          this.searchKeys.endPlace = startPlace
        } else {
          this.searchKeys.endPlace = TOOL.placeHolder.endPlace
        }
      },

      /**
       * 跳到定位城市选择界面
       */
      jumpToLocationSearch () {
        this.$router.push({
          name: 'pageLocation',
          query: {
            page: 'city',
            placeType: 'appCity'
          }
        })
      },

      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.searchKeys))
      },

      /**
       * 跳到城市选择界面
       */
      jumpToCitySearch (place) {
        let query = {
          fromPage: this.pageRouter,
          placeType: place,
          pageId: this.pageId,
          productTypeLevelOne: 'CITY_BUS'
        }
        if (place === 'endPlace') {
          let validata = TOOL.formValidate([
            {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'}
          ]);
          if (!validata.valid) {
            this.$store.dispatch('showError', validata.msg);
            return false;
          }
          query.source = this.searchKeys.startPlace
        } else {
          this.searchKeys.endPlace = TOOL.placeHolder.endPlace
        }
        this.saveForm()
        this.$router.push({
          name: 'pageCity',
          query: query
        })
      },

      saveCitySearch() {
        let newObj = {
          startPlace: this.searchKeys.startPlace,
          endPlace: this.searchKeys.endPlace,
          startTime: this.searchKeys.startTime
        };

        let tag = 'true'
        for(let i = 0; i < this.historySearch.length; i++){
          if(this.historySearch[i].startPlace === newObj.startPlace && this.historySearch[i].endPlace === newObj.endPlace){
            tag = i
            break;
          }
        }
        if(this.historySearch.length >= 10) {
          if(tag === 'true'){
            this.$set(this.historySearch, 0, newObj)
          }else{
            this.$set(this.historySearch, tag, newObj)
          }
        }else {
          if(tag === 'true'){
            this.historySearch.unshift(newObj);
          }else{
            this.$set(this.historySearch, tag, newObj)
          }
        }
        appStorage.set('cityHistorySearch', JSON.stringify(this.historySearch))
      },

      historySearchFun(index) {
        let searchData = this.historySearch[index];
        this.searchKeys.startPlace = searchData.startPlace;
        this.searchKeys.endPlace = searchData.endPlace;
        this.searchKeys.startTime = searchData.startTime;
        let nowDate = TOOL.newGetDate({type: 'date'});
        if(TOOL.dateCompare(searchData.startTime, nowDate) < 0){
          this.searchKeys.startTime = nowDate
        }
        this.search();
      },

      /**
       *  跳转查询页面
       */
      search () {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'},
          {value: this.searchKeys.endPlace, emptyTips: '请选择目的地'},
          {value: this.searchKeys.startTime, emptyTips: '请选择出行时间'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        // 缓存查询历史记录
        this.saveCitySearch();
        this.saveForm()
        appStorage.remove('busCarpooling');
        this.$router.push({
          name: 'list',
          query: {
            pageId: this.pageId,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime + ' 00:00:00'
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .city-search {
    width: 100%;
    height: auto;
    margin-top: 50px;

    font-size: 28px;
    color: #888;
  }
  .city-search__head {
    position: relative;

    width: 100%;
    height: 30px;
    margin-bottom:10px;
    overflow: hidden;
  }
  .city-search__head-title {
    position: absolute;
    top: 2px;
    left: 50%;
    display: inline-block;

    width: 200px;
    padding: 0 30px;
    margin-left: -100px;
    background: #f2f2f2;

    text-align: center;
  }
  .city-search__head-line {
    width: 90%;
    height: 1PX;
    margin: 14px auto;

    background: #e5e5e5;
  }
  .city-search__result {
    width: 100%;
    height: auto;
  }
  .city-search__item {
    display: flex;

    width: 100%;
    padding:20px 0 40px;
    margin-bottom:10px;
    height: 30px;
    /*line-height: 30px;*/
  }
  .city-search__onStation {
    width: 0;
    flex: 1;
    height: 30px;
    padding-top: 2px;
    text-align: right;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .city-search__station-middle {
    position: relative;

    height: 30px;
    width: 80px;
    background: #f2f2f2;
  }
  .city-search__station-line {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;

    width: 20px;
    height: 1PX;
    margin-left: -10px;

    background: #888;
    text-align: center;
  }
  .city-search__offStation {
    width: 0;
    flex: 1;
    height: 30px;
    padding-top: 2px;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
